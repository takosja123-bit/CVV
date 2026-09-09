import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from './config';

export interface AuthUserState {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export function formatAuthUser(user: User | null): AuthUserState | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
}

export function mapAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled in the Firebase Console.';
    case 'auth/network-request-failed':
      return 'Network error occurred. Please check your internet connection.';
    default:
      return 'Authentication failed. Please check your details and try again.';
  }
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    const code = error?.code || 'unknown';
    const message = mapAuthErrorMessage(code);
    const customErr = new Error(message);
    (customErr as any).code = code;
    throw customErr;
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return result.user;
  } catch (error: any) {
    const code = error?.code || 'unknown';
    const message = mapAuthErrorMessage(code);
    const customErr = new Error(message);
    (customErr as any).code = code;
    throw customErr;
  }
}

/**
 * Sign up with Email, Password and optional Display Name
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && displayName.trim()) {
      await updateProfile(result.user, { displayName: displayName.trim() });
    }
    return result.user;
  } catch (error: any) {
    const code = error?.code || 'unknown';
    const message = mapAuthErrorMessage(code);
    const customErr = new Error(message);
    (customErr as any).code = code;
    throw customErr;
  }
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error', error);
    throw error;
  }
}

/**
 * Subscribe to Auth changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
