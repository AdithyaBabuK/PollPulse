import React, { useState } from 'react';
import { User } from '../types';
import { X, LogIn, UserPlus, Sparkles, Check, Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (newUser: Omit<User, 'id' | 'createdAt'>, password?: string) => void;
  currentUser: User | null;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: 'Alex Rivers',
    email: 'alex@pollpulse.io',
    avatarUrl: AVATAR_PRESETS[0],
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'user-demo-2',
    name: 'Sarah Chen',
    email: 'sarah@pollpulse.io',
    avatarUrl: AVATAR_PRESETS[2],
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'user-demo-3',
    name: 'Marcus Vance',
    email: 'marcus@pollpulse.io',
    avatarUrl: AVATAR_PRESETS[1],
    createdAt: Date.now() - 86400000 * 5,
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  users,
  onRegister,
  currentUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'demo'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    const allUsers = [...DEMO_USERS, ...users];
    const existingUser = allUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (existingUser) {
      onLogin(existingUser);
      onClose();
    } else {
      // Create user on the fly if unknown email for quick seamless test
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: loginEmail.split('@')[0] || 'Member',
        email: loginEmail.trim(),
        avatarUrl: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
        createdAt: Date.now(),
      };
      onRegister(newUser, loginPassword);
      onLogin(newUser);
      onClose();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const newUserPayload = {
      name: signupName.trim(),
      email: signupEmail.trim(),
      avatarUrl: selectedAvatar,
    };

    onRegister(newUserPayload, signupPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden glass-card">
        
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-indigo-600/80 to-violet-600/80 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/20">
              PollPulse Account
            </span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">
            {authMode === 'login' ? 'Welcome Back!' : authMode === 'signup' ? 'Create Your Account' : 'Switch Active User'}
          </h3>
          <p className="text-xs text-indigo-100 mt-0.5">
            Authenticate to publish polls under your profile and track votes across devices.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-black/20 p-1 text-xs font-bold">
          <button
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
          <button
            onClick={() => { setAuthMode('demo'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'demo'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick Demo</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
              >
                Sign In to PollPulse
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Alex Rivers"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="alex@pollpulse.io"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Avatar selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Choose Profile Avatar</label>
                <div className="flex gap-2 justify-between">
                  {AVATAR_PRESETS.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === url
                          ? 'border-indigo-400 scale-110 shadow-lg shadow-indigo-500/50'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                      {selectedAvatar === url && (
                        <div className="absolute inset-0 bg-indigo-500/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
              >
                Create Account & Sign In
              </button>
            </form>
          )}

          {/* DEMO ACCOUNTS SWITCHER */}
          {authMode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                Switch between pre-configured user profiles to test multi-user voting history and poll authorship instantly:
              </p>
              
              <div className="space-y-2">
                {[...DEMO_USERS, ...users].map((usr) => {
                  const isActive = currentUser?.id === usr.id;
                  return (
                    <button
                      key={usr.id}
                      onClick={() => {
                        onLogin(usr);
                        onClose();
                      }}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left ${
                        isActive
                          ? 'bg-indigo-500/20 border-indigo-400 shadow-lg shadow-indigo-500/20'
                          : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={usr.avatarUrl || AVATAR_PRESETS[0]}
                          alt={usr.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            {usr.name}
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500 text-white">
                                Active
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">{usr.email}</p>
                        </div>
                      </div>
                      <ShieldCheck className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
