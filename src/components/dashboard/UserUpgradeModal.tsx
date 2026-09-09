import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Send,
  Zap,
  Crown,
  FileCheck,
  Award,
} from 'lucide-react';
import { PlanTier } from '../../types';

interface UserUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  currentTier: PlanTier;
  onSubmitUpgradeRequest: (targetTier: PlanTier, message: string) => void;
}

export const UserUpgradeModal: React.FC<UserUpgradeModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  currentTier,
  onSubmitUpgradeRequest,
}) => {
  const [selectedTier, setSelectedTier] = useState<PlanTier>(
    currentTier === 'Pro Plan' ? 'Premium Plan' : 'Pro Plan'
  );
  const [message, setMessage] = useState(
    'I would like to upgrade my account to access premium ATS templates, unlimited cloud storage, and verified job postings.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitUpgradeRequest(selectedTier, message);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Request Pro / Premium Upgrade</h2>
              <p className="text-[11px] text-slate-500">
                Direct submission to the Admin Dashboard for approval
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Submitted to Admin Dashboard!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your upgrade request has been sent to the Admin Dashboard. The admin will review and grant your upgrade, then forward to the Telegram Bot.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* User Details Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Requesting Account
                </div>
                <div className="font-semibold text-slate-800">{userEmail || 'Guest User'}</div>
                <div className="text-[11px] text-slate-500">{userName || 'JobCraft Member'}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Current Tier
                </div>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {currentTier}
                </span>
              </div>
            </div>

            {/* Choose Target Tier */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Select Tier to Request</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTier('Pro Plan')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === 'Pro Plan'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Pro Plan</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    ATS Harvard & Executive templates, unlimited PDF exports, isolated resume storage.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTier('Premium Plan')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === 'Premium Plan'
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Premium Plan</span>
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    All templates + priority review, direct hiring company access, telegram alerts.
                  </div>
                </button>
              </div>
            </div>

            {/* Note / Request message */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Note for Admin (Reason for upgrade)
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain why you would like an upgrade..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none leading-relaxed text-xs"
              />
            </div>

            {/* Admin Workflow explanation */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Admin Verification:</span> Your request is sent first to the Admin Dashboard for approval. Once granted by admin, your account receives the requested tier and a confirmation can be sent to the Telegram bot.
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm shadow-amber-950/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Admin Dashboard</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
