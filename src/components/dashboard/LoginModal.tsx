import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  LogOut,
  Cloud,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logoutUser,
  AuthUserState,
} from '../../firebase/authService';
import { isDeviceBlocked, recordUserDevice } from '../../firebase/cvService';
import { getDeviceId, getBrowserFingerprint } from '../../utils/deviceId';

const BLOCKED_MESSAGE =
  "This device has been blocked from accessing JobCraft. If you believe this is a mistake, please contact support.";

/**
 * Checks the device block list. If blocked, immediately signs the just-authenticated
 * user back out so they never reach the dashboard, regardless of which account they used.
 * Returns true if the sign-in should proceed.
 */
async function guardAgainstBlockedDevice(): Promise<boolean> {
  const deviceId = getDeviceId();
  const fingerprint = getBrowserFingerprint();
  const blocked = await isDeviceBlocked(deviceId, fingerprint);
  if (blocked) {
    await logoutUser();
    return false;
  }
  return true;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUserState | null;
  onAuthSuccess?: (user: AuthUserState) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setGoogleLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();

      const allowed = await guardAgainstBlockedDevice();
      if (!allowed) {
        setErrorMessage(BLOCKED_MESSAGE);
        return;
      }
      recordUserDevice(user.uid, getDeviceId(), getBrowserFingerprint(), { email: user.email, name: user.displayName || displayName || null });

      setSuccessMessage('Successfully signed in with Google!');
      setTimeout(() => {
        onClose();
        if (onAuthSuccess) {
          onAuthSuccess({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
          });
        }
      }, 600);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google sign in was unsuccessful.');
    } finally {
      setLoading(false);
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        const user = await signUpWithEmail(email, password, displayName);

        const allowed = await guardAgainstBlockedDevice();
        if (!allowed) {
          setErrorMessage(BLOCKED_MESSAGE);
          return;
        }
        recordUserDevice(user.uid, getDeviceId(), getBrowserFingerprint(), { email: user.email, name: user.displayName || displayName || null });

        setSuccessMessage('Account created successfully! Cloud sync enabled.');
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) {
            onAuthSuccess({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || displayName || 'User',
              photoURL: user.photoURL,
              isAnonymous: user.isAnonymous,
            });
          }
        }, 600);
      } else {
        const user = await signInWithEmail(email, password);

        const allowed = await guardAgainstBlockedDevice();
        if (!allowed) {
          setErrorMessage(BLOCKED_MESSAGE);
          return;
        }
        recordUserDevice(user.uid, getDeviceId(), getBrowserFingerprint(), { email: user.email, name: user.displayName || displayName || null });

        setSuccessMessage('Welcome back! Your CVs are loaded.');
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) {
            onAuthSuccess({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL,
              isAnonymous: user.isAnonymous,
            });
          }
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setSuccessMessage('Signed out. Local fallback active.');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage('Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {currentUser ? 'Firebase Account' : 'Sign In to JobCraft ✨'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {currentUser ? 'Cloud Sync Active' : 'Cloud Sync & Multi-Device Storage'}
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

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* If already logged in */}
          {currentUser ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Avatar'}
                    className="w-12 h-12 rounded-full border border-slate-300 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {currentUser.displayName || 'JobCraft Member'}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Firestore Connected & Synchronized</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cloud Persistence Enabled</span>
                </div>
                <p className="text-[11px] text-blue-700/90 leading-relaxed">
                  Your CVs, Cover Letters, and Tracked Jobs are automatically saved to your private Firestore database keyed by your unique User ID.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-xs cursor-pointer transition-all hover:border-slate-400 active:scale-[0.99] disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  or with email
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Mode Toggle Tab */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
                {mode === 'signup' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-[10px] text-slate-400 mt-1">Must be at least 6 characters</p>
                  )}
                </div>


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
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all disabled:opacity-60"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
