import { CVData, TemplateId } from '../types';
import { getSkillLevel, getLanguageLevel } from '../components/templates/TemplateHelpers';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';

/**
 * Downloads a high-resolution, pixel-perfect PDF file (.pdf)
 * by capturing the rendered CV template with html-to-image (supports OKLCH and modern CSS) and assembling via jsPDF.
 */
export async function downloadDirectPdf(
  data: CVData,
  templateId: TemplateId | string = 'template-ats-classic',
  primaryColor: string = '#1e3a5f',
  elementSelector: string = '.cv-document-sheet'
): Promise<boolean> {
  const cleanName = (data.personal?.fullName || 'Resume').trim().replace(/\s+/g, '_');
  const fileName = `${cleanName}_CV.pdf`;

  const sheetElement = document.querySelector(elementSelector) as HTMLElement | null;

  if (sheetElement) {
    // Save previous styles
    const originalTransform = sheetElement.style.transform;
    const originalTransformOrigin = sheetElement.style.transformOrigin;

    try {
      // Temporarily remove CSS zoom/scale transform so canvas captures unscaled 100% dimensions
      sheetElement.style.transform = 'none';
      sheetElement.style.transformOrigin = 'top left';

      // Capture at high pixelRatio for crisp typography. We use toCanvas (not toPng)
      // because we need raw pixel access to find safe places to cut between pages.
      const sourceCanvas = await htmlToImage.toCanvas(sheetElement, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      // Restore original transform
      sheetElement.style.transform = originalTransform;
      sheetElement.style.transformOrigin = originalTransformOrigin;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfPageWidth = 210;
      const pdfPageHeight = 297;
      const totalWidthPx = sourceCanvas.width;
      const totalHeightPx = sourceCanvas.height;
      const pxPerMm = totalWidthPx / pdfPageWidth;
      const pageHeightPx = pdfPageHeight * pxPerMm;
      const imgWidth = pdfPageWidth;

      if (totalHeightPx <= pageHeightPx) {
        // Fits on a single page — no cut needed.
        const dataUrl = sourceCanvas.toDataURL('image/png');
        const imgHeight = totalHeightPx / pxPerMm;
        pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        pdf.save(fileName);
        return true;
      }

      const ctx = sourceCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not read canvas context');
      const imageData = ctx.getImageData(0, 0, totalWidthPx, totalHeightPx).data;

      // A row counts as "safe to cut" if it's essentially blank (close to white),
      // sampled sparsely across the width for speed.
      const isRowBlank = (y: number): boolean => {
        const rowStart = y * totalWidthPx * 4;
        for (let x = 0; x < totalWidthPx; x += 8) {
          const i = rowStart + x * 4;
          const r = imageData[i], g = imageData[i + 1], b = imageData[i + 2];
          if (r < 245 || g < 245 || b < 245) return false;
        }
        return true;
      };

      // Search up to ~12mm above the ideal cut line for a blank row, so we never
      // slice through the middle of a line of text or a bullet point.
      const maxSearchPx = 12 * pxPerMm;
      const findCutY = (idealY: number): number => {
        for (let dy = 0; dy <= maxSearchPx; dy++) {
          const candidate = Math.round(idealY - dy);
          if (candidate <= 0) break;
          if (isRowBlank(candidate)) return candidate;
        }
        return Math.round(idealY); // fallback: hard cut if no whitespace found
      };

      const cutPoints: number[] = [0];
      let cursor = 0;
      while (totalHeightPx - cursor > pageHeightPx) {
        const idealCut = cursor + pageHeightPx;
        const cutY = findCutY(idealCut);
        cutPoints.push(cutY > cursor ? cutY : Math.round(idealCut));
        cursor = cutPoints[cutPoints.length - 1];
      }
      cutPoints.push(totalHeightPx);

      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      if (!pageCtx) throw new Error('Could not create page canvas context');

      for (let p = 0; p < cutPoints.length - 1; p++) {
        const sliceStart = cutPoints[p];
        const sliceHeightPx = cutPoints[p + 1] - sliceStart;
        pageCanvas.width = totalWidthPx;
        pageCanvas.height = sliceHeightPx;
        pageCtx.clearRect(0, 0, totalWidthPx, sliceHeightPx);
        pageCtx.drawImage(
          sourceCanvas,
          0, sliceStart, totalWidthPx, sliceHeightPx,
          0, 0, totalWidthPx, sliceHeightPx
        );
        const pageDataUrl = pageCanvas.toDataURL('image/png');
        const sliceHeightMm = sliceHeightPx / pxPerMm;

        if (p > 0) pdf.addPage();
        pdf.addImage(pageDataUrl, 'PNG', 0, 0, imgWidth, sliceHeightMm, undefined, 'FAST');
      }

      pdf.save(fileName);
      return true;
    } catch (captureErr) {
      console.warn('Direct image-based PDF generation encountered an issue, falling back to print dialog:', captureErr);
      // Ensure transform is restored in case of error
      sheetElement.style.transform = originalTransform;
      sheetElement.style.transformOrigin = originalTransformOrigin;
    }
  }

  // Fallback: Open formatted printable window
  openPrintableResume(data, templateId, primaryColor);
  return true;
}

/**
 * Generates and downloads a real Microsoft Word .docx binary file
 * using the docx library with structured headings, bold titles, and bullet lists.
 */
export async function downloadTrueDocx(
  data: CVData,
  primaryColor: string = '#1e3a5f',
  templateId?: TemplateId | string
) {
  const { personal, experiences, education, skills, languages, achievements, references, projects, certifications } = data;
  const fileName = `${(personal?.fullName || 'Resume').trim().replace(/\s+/g, '_')}_CV.docx`;
  const colorHex = (primaryColor || '#1e3a5f').replace('#', '') || '1e3a5f';

  const isAtsTemplate = typeof templateId === 'string' && templateId.startsWith('template-ats');
  const isSidebarTemplate =
    !isAtsTemplate &&
    (templateId === 'template-b' ||
      templateId === 'template-c' ||
      templateId === 'template-e' ||
      templateId === 'template-f' ||
      templateId === 'template-h' ||
      templateId === 'template-i' ||
      templateId === 'template-j' ||
      templateId === 'template-k' ||
      templateId === 'template-l' ||
      templateId === 'template-m' ||
      templateId === 'template-sage-sidebar' ||
      templateId === 'template-black-badge' ||
      templateId === 'template-teal-grid');

  // Best-effort profile photo embed. Never blocks export if it fails (missing photo,
  // CORS, unsupported format, etc.) -- the rest of the document still exports fine.
  let photoImageRun: ImageRun | null = null;
  if (isSidebarTemplate && personal?.photoUrl) {
    try {
      const res = await fetch(personal.photoUrl);
      const blob = await res.blob();
      const buffer = await blob.arrayBuffer();
      const mimeToType: Record<string, 'png' | 'jpg' | 'gif' | 'bmp'> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
      };
      const imgType = mimeToType[blob.type];
      if (imgType) {
        photoImageRun = new ImageRun({
          data: buffer,
          type: imgType,
          transformation: { width: 96, height: 96 },
        } as ConstructorParameters<typeof ImageRun>[0]);
      }
    } catch {
      photoImageRun = null;
    }
  }

  const mainChildren: (Paragraph | Table)[] = [];
  const sidebarChildren: Paragraph[] = [];

  const addMainHeading = (title: string) => {
    mainChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 21,
            color: colorHex,
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );
  };

  const addSidebarHeading = (title: string) => {
    sidebarChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 18,
            color: 'FFFFFF',
            font: 'Arial',
          }),
        ],
        spacing: { before: 200, after: 80 },
        border: {
          bottom: { color: 'FFFFFF', space: 3, style: BorderStyle.SINGLE, size: 4 },
        },
      })
    );
  };

  // --- Header / identity ---
  if (isSidebarTemplate) {
    if (photoImageRun) {
      sidebarChildren.push(
        new Paragraph({
          children: [photoImageRun],
          alignment: AlignmentType.CENTER,
          spacing: { after: 140 },
        })
      );
    }
    sidebarChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: (personal?.fullName || 'Full Name').toUpperCase(),
            bold: true,
            size: 26,
            color: 'FFFFFF',
            font: 'Arial',
          }),
        ],
        spacing: { after: 40 },
      })
    );
    if (personal?.jobTitle) {
      sidebarChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personal.jobTitle.toUpperCase(),
              bold: true,
              size: 16,
              color: 'E5E7EB',
              font: 'Arial',
            }),
          ],
          spacing: { after: 160 },
        })
      );
    }

    const contactLines: string[] = [];
    if (personal?.phone) contactLines.push(`Phone: ${personal.phone}`);
    if (personal?.email) contactLines.push(`Email: ${personal.email}`);
    if (personal?.address) contactLines.push(`Address: ${personal.address}`);
    if (personal?.linkedin) contactLines.push(`LinkedIn: ${personal.linkedin}`);
    if (personal?.github) contactLines.push(`GitHub: ${personal.github}`);
    if (personal?.website) contactLines.push(`Website: ${personal.website}`);
    if (contactLines.length > 0) {
      addSidebarHeading('Contact');
      contactLines.forEach((line) => {
        sidebarChildren.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 16, color: 'F1F5F9', font: 'Arial' })],
            spacing: { after: 50 },
          })
        );
      });
    }
  } else {
    mainChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: (personal?.fullName || 'Full Name').toUpperCase(),
            bold: true,
            size: 32,
            color: colorHex,
            font: 'Arial',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    );
    if (personal?.jobTitle) {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personal.jobTitle.toUpperCase(),
              bold: true,
              size: 20,
              color: '555555',
              font: 'Arial',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
    }
    const contactParts: string[] = [];
    if (personal?.phone) contactParts.push(personal.phone);
    if (personal?.email) contactParts.push(personal.email);
    if (personal?.address) contactParts.push(personal.address);
    if (personal?.linkedin) contactParts.push(`LinkedIn: ${personal.linkedin}`);
    if (personal?.github) contactParts.push(`GitHub: ${personal.github}`);
    if (personal?.website) contactParts.push(personal.website);
    if (contactParts.length > 0) {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: contactParts.join('  •  '), size: 17, color: '666666', font: 'Arial' }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 220 },
        })
      );
    }
  }

  // --- Summary ---
  if (personal?.summary) {
    addMainHeading('Professional Summary');
    mainChildren.push(
      new Paragraph({
        children: [new TextRun({ text: personal.summary, size: 19, font: 'Arial' })],
        spacing: { after: 160 },
      })
    );
  }

  // --- Work Experience ---
  if (experiences && experiences.length > 0) {
    addMainHeading('Work Experience');
    experiences.forEach((exp) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.jobTitle, bold: true, size: 20, font: 'Arial' }),
            new TextRun({
              text: exp.company ? ` — ${exp.company}` : '',
              bold: true,
              color: '333333',
              size: 19,
              font: 'Arial',
            }),
            new TextRun({
              text: `   (${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''})`,
              italics: true,
              color: '666666',
              size: 17,
              font: 'Arial',
            }),
          ],
          spacing: { before: 100, after: 40 },
        })
      );
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((b) => {
          const cleanBullet = b.replace(/^[•\-\*]\s*/, '');
          mainChildren.push(
            new Paragraph({
              children: [new TextRun({ text: cleanBullet, size: 19, font: 'Arial' })],
              bullet: { level: 0 },
              spacing: { after: 30 },
            })
          );
        });
      }
    });
  }

  // --- Education ---
  if (education && education.length > 0) {
    addMainHeading('Education');
    education.forEach((edu) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true, size: 20, font: 'Arial' }),
            new TextRun({ text: ` — ${edu.institution}`, color: '333333', size: 19, font: 'Arial' }),
            new TextRun({
              text: `   (${edu.startDate ? `${edu.startDate} – ` : ''}${edu.endDate || 'Present'}${edu.location ? ` | ${edu.location}` : ''})`,
              italics: true,
              color: '666666',
              size: 17,
              font: 'Arial',
            }),
          ],
          spacing: { before: 100, after: 40 },
        })
      );
      if (edu.details) {
        mainChildren.push(
          new Paragraph({
            children: [new TextRun({ text: edu.details, size: 18, color: '444444', font: 'Arial' })],
            spacing: { after: 80 },
          })
        );
      }
    });
  }

  // --- Achievements (previously dropped entirely from the styled export) ---
  if (achievements && achievements.length > 0) {
    addMainHeading('Achievements');
    achievements.forEach((a) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `• ${a.title}`, bold: true, size: 19, font: 'Arial' }),
            new TextRun({ text: a.date ? ` (${a.date})` : '', italics: true, color: '666666', size: 17, font: 'Arial' }),
          ],
          spacing: { after: 10 },
        })
      );
      if (a.description) {
        mainChildren.push(
          new Paragraph({
            children: [new TextRun({ text: a.description, size: 18, color: '444444', font: 'Arial' })],
            spacing: { after: 40 },
          })
        );
      }
    });
  }

  // --- Skills ---
  if (skills && skills.length > 0) {
    if (isSidebarTemplate) {
      addSidebarHeading('Skills');
      skills.forEach((s) => {
        sidebarChildren.push(
          new Paragraph({
            children: [new TextRun({ text: getSkillLevel(s).name, size: 16, color: 'F1F5F9', font: 'Arial' })],
            bullet: { level: 0 },
            spacing: { after: 30 },
          })
        );
      });
    } else {
      addMainHeading('Skills & Competencies');
      const skillList = skills.map((s) => getSkillLevel(s).name).join('  •  ');
      mainChildren.push(
        new Paragraph({
          children: [new TextRun({ text: skillList, size: 19, color: '222222', font: 'Arial' })],
          spacing: { after: 140 },
        })
      );
    }
  }

  // --- Languages ---
  if (languages && languages.length > 0) {
    const langLabel = (l: (typeof languages)[number]) => {
      const { name, level } = getLanguageLevel(l);
      return `${name} (${level >= 5 ? 'Native / Bilingual' : level >= 4 ? 'Fluent' : level >= 3 ? 'Intermediate' : 'Basic'})`;
    };
    if (isSidebarTemplate) {
      addSidebarHeading('Languages');
      languages.forEach((l) => {
        sidebarChildren.push(
          new Paragraph({
            children: [new TextRun({ text: langLabel(l), size: 16, color: 'F1F5F9', font: 'Arial' })],
            bullet: { level: 0 },
            spacing: { after: 30 },
          })
        );
      });
    } else {
      addMainHeading('Languages');
      mainChildren.push(
        new Paragraph({
          children: [new TextRun({ text: languages.map(langLabel).join('  •  '), size: 19, color: '333333', font: 'Arial' })],
          spacing: { after: 140 },
        })
      );
    }
  }

  // --- Projects ---
  if (projects && projects.length > 0) {
    addMainHeading('Key Projects');
    projects.forEach((proj) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.title, bold: true, size: 19, font: 'Arial' }),
            new TextRun({
              text: proj.role ? ` (${proj.role})` : '',
              italics: true,
              color: '555555',
              size: 18,
              font: 'Arial',
            }),
            new TextRun({
              text: proj.link ? ` — ${proj.link}` : '',
              color: colorHex || '1d4ed8',
              size: 17,
              font: 'Arial',
            }),
          ],
          spacing: { before: 80, after: 30 },
        })
      );
      if (proj.description) {
        mainChildren.push(
          new Paragraph({
            children: [new TextRun({ text: proj.description, size: 18, color: '444444', font: 'Arial' })],
            spacing: { after: 60 },
          })
        );
      }
    });
  }

  // --- Certifications ---
  if (certifications && certifications.length > 0) {
    addMainHeading('Certifications');
    certifications.forEach((cert) => {
      mainChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `• ${cert.name}`, bold: true, size: 19, font: 'Arial' }),
            new TextRun({ text: cert.issuer ? ` — ${cert.issuer}` : '', color: '444444', size: 18, font: 'Arial' }),
            new TextRun({ text: cert.date ? ` (${cert.date})` : '', italics: true, color: '666666', size: 17, font: 'Arial' }),
          ],
          spacing: { after: 30 },
        })
      );
    });
  }

  // --- References ---
  if (references && references.length > 0) {
    if (isSidebarTemplate) {
      addSidebarHeading('References');
      references.forEach((ref) => {
        sidebarChildren.push(
          new Paragraph({
            children: [new TextRun({ text: ref.name, bold: true, size: 16, color: 'FFFFFF', font: 'Arial' })],
            spacing: { before: 40, after: 10 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `${ref.title}, ${ref.company}`, size: 15, color: 'F1F5F9', font: 'Arial' })],
            spacing: { after: 10 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Tel: ${ref.phone}`, size: 15, color: 'F1F5F9', font: 'Arial' })],
            spacing: { after: 60 },
          })
        );
      });
    } else {
      addMainHeading('References');
      references.forEach((ref) => {
        mainChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: ref.name, bold: true, size: 19, font: 'Arial' }),
              new TextRun({ text: ` — ${ref.title}, ${ref.company}`, color: '444444', size: 18, font: 'Arial' }),
              new TextRun({ text: ` | Tel: ${ref.phone}${ref.email ? ` | ${ref.email}` : ''}`, color: '666666', size: 17, font: 'Arial' }),
            ],
            spacing: { after: 40 },
          })
        );
      });
    }
  }

  let bodyChildren: (Paragraph | Table)[];
  let pageMargin = 720;

  if (isSidebarTemplate) {
    pageMargin = 0;
    const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const sidebarCell = new TableCell({
      width: { size: 32, type: WidthType.PERCENTAGE },
      shading: { fill: colorHex, type: ShadingType.CLEAR, color: 'auto' },
      margins: { top: 300, bottom: 300, left: 260, right: 260 },
      children: sidebarChildren,
    });
    const mainCell = new TableCell({
      width: { size: 68, type: WidthType.PERCENTAGE },
      margins: { top: 300, bottom: 300, left: 320, right: 300 },
      children: mainChildren,
    });
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [new TableRow({ children: [sidebarCell, mainCell] })],
    });
    bodyChildren = [table];
  } else {
    bodyChildren = mainChildren;
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: pageMargin,
              right: pageMargin,
              bottom: pageMargin,
              left: pageMargin,
            },
          },
        },
        children: bodyChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}

/**
 * Generates an HTML-based Word Document (.doc) with styling that matches
 * the selected template (e.g. ATS Clean 1-Column vs Sidebar 2-Column).
 */
export function downloadWordDoc(
  data: CVData,
  primaryColor: string = '#1e3a5f',
  templateId?: TemplateId | string
) {
  const { personal, experiences, education, skills, languages, achievements, references, projects, certifications } = data;
  const fileName = `${(personal?.fullName || 'Resume').trim().replace(/\s+/g, '_')}_CV.doc`;

  const isAtsTemplate = templateId?.startsWith('template-ats');
  const isSidebarTemplate =
    !isAtsTemplate &&
    (templateId === 'template-b' ||
      templateId === 'template-c' ||
      templateId === 'template-e' ||
      templateId === 'template-f' ||
      templateId === 'template-h' ||
      templateId === 'template-i' ||
      templateId === 'template-j' ||
      templateId === 'template-k' ||
      templateId === 'template-l' ||
      templateId === 'template-m' ||
      templateId === 'template-sage-sidebar' ||
      templateId === 'template-black-badge' ||
      templateId === 'template-teal-grid');

  let bodyContent = '';

  if (isSidebarTemplate) {
    // 2-Column Table Word layout matching Sidebar Templates
    bodyContent = `
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <tr>
          <!-- Left Sidebar -->
          <td style="width: 32%; vertical-align: top; background-color: #f8fafc; padding: 18pt 14pt; border-right: 2pt solid ${primaryColor};">
            <h1 style="font-size: 18pt; color: ${primaryColor}; margin: 0 0 4pt 0; text-transform: uppercase;">${escapeHtml(personal?.fullName || 'Full Name')}</h1>
            <div style="font-size: 10pt; font-weight: bold; color: #475569; text-transform: uppercase; margin-bottom: 14pt;">${escapeHtml(personal?.jobTitle || '')}</div>
            
            <h3 style="font-size: 10.5pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; margin-top: 10pt; margin-bottom: 6pt;">Contact</h3>
            <div style="font-size: 9pt; color: #334155; line-height: 1.5;">
              ${personal?.email ? `<div>✉ ${escapeHtml(personal.email)}</div>` : ''}
              ${personal?.phone ? `<div>✆ ${escapeHtml(personal.phone)}</div>` : ''}
              ${personal?.address ? `<div>📍 ${escapeHtml(personal.address)}</div>` : ''}
              ${personal?.linkedin ? `<div>💼 ${escapeHtml(personal.linkedin)}</div>` : ''}
              ${personal?.github ? `<div>🐙 ${escapeHtml(personal.github)}</div>` : ''}
              ${personal?.website ? `<div>🌐 ${escapeHtml(personal.website)}</div>` : ''}
            </div>

            ${skills && skills.length > 0 ? `
              <h3 style="font-size: 10.5pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt;">Skills</h3>
              <ul style="margin: 0; padding-left: 12pt; font-size: 9pt; color: #334155;">
                ${skills.map((s) => `<li>${escapeHtml(getSkillLevel(s).name)}</li>`).join('')}
              </ul>
            ` : ''}

            ${languages && languages.length > 0 ? `
              <h3 style="font-size: 10.5pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt;">Languages</h3>
              <ul style="margin: 0; padding-left: 12pt; font-size: 9pt; color: #334155;">
                ${languages.map((l) => `<li>${escapeHtml(getLanguageLevel(l).name)}</li>`).join('')}
              </ul>
            ` : ''}

            ${references && references.length > 0 ? `
              <h3 style="font-size: 10.5pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt;">References</h3>
              <div style="font-size: 8.5pt; color: #334155;">
                ${references.map((r) => `
                  <div style="margin-bottom: 6pt;">
                    <strong>${escapeHtml(r.name)}</strong><br/>
                    ${escapeHtml(r.title)}, ${escapeHtml(r.company)}<br/>
                    Tel: ${escapeHtml(r.phone)}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </td>

          <!-- Right Main Column -->
          <td style="width: 68%; vertical-align: top; padding: 18pt 16pt;">
            ${personal?.summary ? `
              <h2 style="font-size: 12pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1.5pt solid ${primaryColor}; padding-bottom: 3pt; margin-top: 0; margin-bottom: 6pt;">About Me</h2>
              <p style="font-size: 9.5pt; color: #334155; line-height: 1.4; margin-bottom: 14pt;">${escapeHtml(personal.summary)}</p>
            ` : ''}

            ${experiences && experiences.length > 0 ? `
              <h2 style="font-size: 12pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1.5pt solid ${primaryColor}; padding-bottom: 3pt; margin-top: 12pt; margin-bottom: 6pt;">Work Experience</h2>
              ${experiences.map((exp) => `
                <div style="margin-bottom: 10pt;">
                  <div style="font-size: 10.5pt; font-weight: bold; color: #0f172a;">${escapeHtml(exp.jobTitle)} — <span style="color: ${primaryColor};">${escapeHtml(exp.company)}</span></div>
                  <div style="font-size: 8.5pt; color: #64748b; font-style: italic; margin-bottom: 3pt;">${escapeHtml(exp.startDate)} – ${exp.current ? 'Present' : escapeHtml(exp.endDate)}${exp.location ? ` | ${escapeHtml(exp.location)}` : ''}</div>
                  ${exp.bullets && exp.bullets.length > 0 ? `
                    <ul style="margin: 0; padding-left: 14pt; font-size: 9pt; color: #334155; line-height: 1.35;">
                      ${exp.bullets.map((b) => `<li>${escapeHtml(b.replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            ` : ''}

            ${education && education.length > 0 ? `
              <h2 style="font-size: 12pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1.5pt solid ${primaryColor}; padding-bottom: 3pt; margin-top: 12pt; margin-bottom: 6pt;">Education</h2>
              ${education.map((edu) => `
                <div style="margin-bottom: 8pt;">
                  <div style="font-size: 10pt; font-weight: bold; color: #0f172a;">${escapeHtml(edu.degree)}</div>
                  <div style="font-size: 9pt; color: #475569;">${escapeHtml(edu.institution)} <span style="font-size: 8.5pt; color: #64748b; font-style: italic;">(${escapeHtml(edu.endDate || edu.startDate)})</span></div>
                  ${edu.details ? `<div style="font-size: 8.5pt; color: #64748b; margin-top: 2pt;">${escapeHtml(edu.details)}</div>` : ''}
                </div>
              `).join('')}
            ` : ''}

            ${projects && projects.length > 0 ? `
              <h2 style="font-size: 12pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1.5pt solid ${primaryColor}; padding-bottom: 3pt; margin-top: 12pt; margin-bottom: 6pt;">Key Projects</h2>
              ${projects.map((proj) => `
                <div style="margin-bottom: 6pt;">
                  <strong style="font-size: 9.5pt; color: #0f172a;">${escapeHtml(proj.title)}</strong> ${proj.role ? `<span style="font-size: 8.5pt; color: #64748b;">(${escapeHtml(proj.role)})</span>` : ''}
                  <div style="font-size: 8.5pt; color: #475569;">${escapeHtml(proj.description)}</div>
                </div>
              `).join('')}
            ` : ''}

            ${certifications && certifications.length > 0 ? `
              <h2 style="font-size: 12pt; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1.5pt solid ${primaryColor}; padding-bottom: 3pt; margin-top: 12pt; margin-bottom: 6pt;">Certifications</h2>
              ${certifications.map((c) => `
                <div style="font-size: 9pt; color: #334155; margin-bottom: 3pt;">
                  <strong>${escapeHtml(c.name)}</strong> — ${escapeHtml(c.issuer)} (${escapeHtml(c.date)})
                </div>
              `).join('')}
            ` : ''}
          </td>
        </tr>
      </table>
    `;
  } else {
    // Single-Column Clean Layout for ATS Classic, ATS Modern, ATS Executive, and standard layouts
    bodyContent = `
      <div style="font-family: Arial, sans-serif; max-width: 750pt; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2pt solid ${primaryColor}; padding-bottom: 8pt; margin-bottom: 12pt;">
          <h1 style="font-size: 22pt; color: ${primaryColor}; margin: 0 0 2pt 0; text-transform: uppercase;">${escapeHtml(personal?.fullName || 'Full Name')}</h1>
          <div style="font-size: 11pt; font-weight: bold; color: #555555; text-transform: uppercase; margin-bottom: 6pt;">${escapeHtml(personal?.jobTitle || '')}</div>
          <div style="font-size: 9.5pt; color: #666666;">
            ${[personal?.phone, personal?.email, personal?.address, personal?.linkedin, personal?.github, personal?.website].filter(Boolean).map(escapeHtml).join('  •  ')}
          </div>
        </div>

        <!-- Summary -->
        ${personal?.summary ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">Professional Summary</h2>
          <p style="font-size: 10pt; color: #333333; line-height: 1.4; margin-bottom: 10pt;">${escapeHtml(personal.summary)}</p>
        ` : ''}

        <!-- Work Experience -->
        ${experiences && experiences.length > 0 ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">Work Experience</h2>
          ${experiences.map((exp) => `
            <div style="margin-bottom: 8pt;">
              <table style="width: 100%; border-collapse: collapse;"><tr>
                <td style="font-size: 10.5pt; font-weight: bold; color: #111111; text-align: left; padding: 0;">
                  ${escapeHtml(exp.jobTitle)} — <span style="color: ${primaryColor};">${escapeHtml(exp.company)}</span>
                </td>
                <td style="color: #666666; font-size: 9pt; font-style: italic; text-align: right; white-space: nowrap; padding: 0;">
                  ${escapeHtml(exp.startDate)} – ${exp.current ? 'Present' : escapeHtml(exp.endDate)}${exp.location ? ` | ${escapeHtml(exp.location)}` : ''}
                </td>
              </tr></table>
              ${exp.bullets && exp.bullets.length > 0 ? `
                <ul style="margin: 3pt 0 6pt 16pt; padding: 0; font-size: 9.5pt; color: #333333; line-height: 1.35;">
                  ${exp.bullets.map((b) => `<li>${escapeHtml(b.replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        ` : ''}

        <!-- Education -->
        ${education && education.length > 0 ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">Education</h2>
          ${education.map((edu) => `
            <div style="margin-bottom: 6pt;">
              <table style="width: 100%; border-collapse: collapse;"><tr>
                <td style="font-size: 10.5pt; font-weight: bold; color: #111111; text-align: left; padding: 0;">
                  ${escapeHtml(edu.degree)} — <span style="color: #444444;">${escapeHtml(edu.institution)}</span>
                </td>
                <td style="color: #666666; font-size: 9pt; font-style: italic; text-align: right; white-space: nowrap; padding: 0;">
                  ${escapeHtml(edu.endDate || edu.startDate)}
                </td>
              </tr></table>
              ${edu.details ? `<div style="font-size: 9pt; color: #555555; margin-top: 2pt;">${escapeHtml(edu.details)}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}

        <!-- Skills -->
        ${skills && skills.length > 0 ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">Skills & Competencies</h2>
          <p style="font-size: 9.5pt; color: #333333; line-height: 1.4;">
            ${skills.map((s) => escapeHtml(getSkillLevel(s).name)).join('  •  ')}
          </p>
        ` : ''}

        <!-- Languages -->
        ${languages && languages.length > 0 ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">Languages</h2>
          <p style="font-size: 9.5pt; color: #333333; line-height: 1.4;">
            ${languages.map((l) => `${escapeHtml(getLanguageLevel(l).name)} (${getLanguageLevel(l).level}/5)`).join('  •  ')}
          </p>
        ` : ''}

        <!-- Projects -->
        ${projects && projects.length > 0 ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">Key Projects</h2>
          ${projects.map((p) => `
            <div style="margin-bottom: 6pt;">
              <table style="width: 100%; border-collapse: collapse;"><tr>
                <td style="text-align: left; padding: 0;">
                  <strong>${escapeHtml(p.title)}</strong> ${p.role ? `<span style="color: #666; font-size: 9pt;">(${escapeHtml(p.role)})</span>` : ''}
                </td>
                ${p.link ? `<td style="color: ${primaryColor}; font-size: 9pt; text-align: right; white-space: nowrap; padding: 0;">${escapeHtml(p.link)}</td>` : ''}
              </tr></table>
              <div style="font-size: 9.5pt; color: #444444; margin-top: 2pt;">${escapeHtml(p.description)}</div>
            </div>
          `).join('')}
        ` : ''}

        <!-- Certifications -->
        ${certifications && certifications.length > 0 ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">Certifications</h2>
          ${certifications.map((c) => `
            <div style="font-size: 9.5pt; margin-bottom: 3pt;">
              <strong>${escapeHtml(c.name)}</strong> — ${escapeHtml(c.issuer)} <span style="color: #777;">(${escapeHtml(c.date)})</span>
            </div>
          `).join('')}
        ` : ''}

        <!-- References -->
        ${references && references.length > 0 ? `
          <h2 style="font-size: 11.5pt; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1pt solid #dddddd; padding-bottom: 2pt; margin-top: 12pt; margin-bottom: 5pt; font-weight: bold;">References</h2>
          ${references.map((r) => `
            <div style="font-size: 9.5pt; margin-bottom: 4pt;">
              <strong>${escapeHtml(r.name)}</strong> — ${escapeHtml(r.title)}, ${escapeHtml(r.company)} (Tel: ${escapeHtml(r.phone)})
            </div>
          `).join('')}
        ` : ''}
      </div>
    `;
  }

  const htmlDocument = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeHtml(personal?.fullName || 'CV')}</title>
      <style>
        @page {
          size: 8.5in 11.0in;
          margin: 0.7in;
        }
        body {
          font-family: 'Arial', 'Calibri', sans-serif;
          color: #222222;
          background: #ffffff;
        }
      </style>
    </head>
    <body>
      ${bodyContent}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });

  triggerFileDownload(blob, fileName);
}

/**
 * Downloads a standalone HTML document (.html)
 */
export function downloadHtmlDocument(
  data: CVData,
  primaryColor: string = '#1e3a5f',
  templateId?: TemplateId | string
) {
  const fileName = `${(data.personal?.fullName || 'Resume').trim().replace(/\s+/g, '_')}_CV.html`;
  const sheetElement = document.querySelector('.cv-document-sheet') as HTMLElement | null;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(data.personal?.fullName || 'Resume')} - CV</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          body { background: white !important; margin: 0 !important; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body class="bg-slate-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div class="no-print mb-4 flex items-center gap-3">
        <button onclick="window.print()" class="bg-indigo-600 text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 cursor-pointer">
          Print / Save as PDF
        </button>
      </div>
      <div class="w-full max-w-[794px] bg-white shadow-xl rounded-sm">
        ${sheetElement ? sheetElement.innerHTML : '<div>No preview available</div>'}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  triggerFileDownload(blob, fileName);
}

/**
 * Opens a dedicated printable window with clean CSS
 */
export function openPrintableResume(
  data: CVData,
  templateId: TemplateId | string = 'template-ats-classic',
  primaryColor: string = '#1e3a5f'
) {
  const sheetElement = document.querySelector('.cv-document-sheet') as HTMLElement | null;
  if (!sheetElement) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(data.personal?.fullName || 'Resume')} - Print</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        </style>
      </head>
      <body>
        <div style="width: 794px; min-height: 1123px; margin: 0 auto; background: white;">
          ${sheetElement.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Triggers PDF export via the browser's print engine
 */
export function downloadPdf() {
  try {
    window.print();
  } catch (err) {
    console.error('Print failed', err);
  }
}

/**
 * Generates formatted text from CV data
 */
export function generateCVPlainText(data: CVData): string {
  const { personal, experiences, education, skills, languages, achievements, references, projects, certifications } = data;

  let text = '';
  text += `${(personal?.fullName || 'FULL NAME').toUpperCase()}\n`;
  text += `${personal?.jobTitle || 'Job Title'}\n`;
  if (personal?.gender) text += `Gender: ${personal.gender} | `;
  if (personal?.birthDate) text += `DOB: ${personal.birthDate} | `;
  text += `Email: ${personal?.email} | Phone: ${personal?.phone}\n`;
  if (personal?.address) text += `Address: ${personal.address}\n`;
  if (personal?.github) text += `GitHub: ${personal.github}\n`;
  if (personal?.linkedin) text += `LinkedIn: ${personal.linkedin}\n`;
  if (personal?.website) text += `Website: ${personal.website}\n`;
  text += `\n${'='.repeat(60)}\n\n`;

  if (personal?.summary) {
    text += `PROFESSIONAL SUMMARY\n${'-'.repeat(30)}\n`;
    text += `${personal.summary}\n\n`;
  }

  if (experiences && experiences.length > 0) {
    text += `EXPERIENCE\n${'-'.repeat(30)}\n`;
    experiences.forEach((exp) => {
      text += `${exp.jobTitle} - ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
      if (exp.location) text += `Location: ${exp.location}\n`;
      if (exp.bullets) {
        exp.bullets.forEach((b) => {
          text += `  • ${b}\n`;
        });
      }
      text += `\n`;
    });
  }

  if (education && education.length > 0) {
    text += `EDUCATION\n${'-'.repeat(30)}\n`;
    education.forEach((edu) => {
      text += `${edu.degree} - ${edu.institution} (${edu.endDate || edu.startDate})\n`;
      if (edu.details) text += `  ${edu.details}\n`;
      text += `\n`;
    });
  }

  if (skills && skills.length > 0) {
    text += `SKILLS\n${'-'.repeat(30)}\n`;
    skills.forEach((s) => {
      const { name, level } = getSkillLevel(s);
      text += `  • ${name} (Proficiency: ${level}/5)\n`;
    });
    text += `\n`;
  }

  if (languages && languages.length > 0) {
    text += `LANGUAGES\n${'-'.repeat(30)}\n`;
    languages.forEach((l) => {
      const { name, level } = getLanguageLevel(l);
      text += `  • ${name} (Level: ${level}/5)\n`;
    });
    text += `\n`;
  }

  if (achievements && achievements.length > 0) {
    text += `ACHIEVEMENTS\n${'-'.repeat(30)}\n`;
    achievements.forEach((a) => {
      text += `  • ${a.title}: ${a.description}\n`;
    });
    text += `\n`;
  }

  if (references && references.length > 0) {
    text += `REFERENCES\n${'-'.repeat(30)}\n`;
    references.forEach((r) => {
      text += `  • ${r.name} - ${r.title}, ${r.company} (Tel: ${r.phone})\n`;
    });
    text += `\n`;
  }

  if (projects && projects.length > 0) {
    text += `PROJECTS\n${'-'.repeat(30)}\n`;
    projects.forEach((p) => {
      text += `${p.title} (${p.role || 'Project'})\n`;
      text += `  ${p.description}\n\n`;
    });
  }

  if (certifications && certifications.length > 0) {
    text += `CERTIFICATIONS\n${'-'.repeat(30)}\n`;
    certifications.forEach((c) => {
      text += `  • ${c.name} - ${c.issuer} (${c.date})\n`;
    });
  }

  return text;
}

/**
 * Downloads a Plain Text (.txt) formatted CV
 */
export function downloadPlainText(data: CVData) {
  const fileName = `${(data.personal?.fullName || 'Resume').trim().replace(/\s+/g, '_')}_CV.txt`;
  const text = generateCVPlainText(data);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  triggerFileDownload(blob, fileName);
}

/**
 * Downloads full CV data as a JSON file backup
 */
export function downloadJson(data: CVData) {
  const fileName = `${(data.personal?.fullName || 'Resume').trim().replace(/\s+/g, '_')}_backup.json`;
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  triggerFileDownload(blob, fileName);
}

/**
 * Copies formatted text CV to clipboard
 */
export async function copyCVToClipboard(data: CVData): Promise<boolean> {
  try {
    const text = generateCVPlainText(data);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

function triggerFileDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
