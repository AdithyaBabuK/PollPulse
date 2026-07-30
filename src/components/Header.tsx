import React, { useState } from 'react';
import { Vote, PlusCircle, BarChart3, Layers, RotateCcw, UserCheck, LogIn, UserX, FolderHeart, ChevronDown } from 'lucide-react';
import { TabType, User } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activePollsCount: number;
  myPollsCount?: number;
  onResetData: () => void;
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activePollsCount,
  myPollsCount = 0,
  onResetData,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/75 dark:bg-white/5 border-b border-slate-200/60 dark:border-white/10 transition-all duration-300 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('active')}>
            <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 group">
              <Vote className="w-5 h-5 md:w-6 md:h-6 transform group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="app-heading" className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  PollPulse
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Real-Time Interactive Polling
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden md:flex items-center p-1 bg-slate-200/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-slate-300/50 dark:border-white/10">
            <button
              id="tab-active-polls"
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'active'
                  ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-md border border-slate-200/80 dark:border-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Active Polls</span>
              {activePollsCount > 0 && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === 'active'
                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}>
                  {activePollsCount}
                </span>
              )}
            </button>

            <button
              id="tab-create-poll"
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-md border border-slate-200/80 dark:border-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create a Poll</span>
            </button>

            <button
              id="tab-my-polls"
              onClick={() => setActiveTab('mypolls')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'mypolls'
                  ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-md border border-slate-200/80 dark:border-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderHeart className="w-4 h-4" />
              <span>My Activity</span>
              {myPollsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                  {myPollsCount}
                </span>
              )}
            </button>

            <button
              id="tab-poll-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-md border border-slate-200/80 dark:border-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Poll Analytics</span>
            </button>
          </nav>

          {/* Controls: Auth, Theme & Reset Data */}
          <div className="flex items-center gap-2">
            
            {/* User Auth Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 dark:bg-white/10 hover:bg-indigo-500/20 dark:hover:bg-white/20 border border-indigo-500/20 dark:border-white/10 transition-all text-xs font-bold text-slate-800 dark:text-white"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-500/30"
                  />
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-white animate-fadeIn backdrop-blur-xl"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="p-3 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('mypolls');
                        setShowUserMenu(false);
                      }}
                      className="w-full mt-1 px-3 py-2 text-xs font-semibold text-left rounded-xl hover:bg-white/10 flex items-center gap-2 transition-colors"
                    >
                      <FolderHeart className="w-4 h-4 text-indigo-400" />
                      <span>My Polls & Votes</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs font-semibold text-left rounded-xl hover:bg-white/10 flex items-center gap-2 transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs font-semibold text-left rounded-xl hover:bg-rose-500/20 text-rose-300 flex items-center gap-2 transition-colors mt-1 border-t border-white/5"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-auth-login-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Sign Up</span>
              </button>
            )}

            <button
              id="reset-demo-btn"
              onClick={onResetData}
              title="Reset Sample Data"
              className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-300/60 dark:hover:bg-white/20 border border-slate-300/50 dark:border-white/10 transition-colors"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Mobile */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-semibold ${
              activeTab === 'active'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="relative">
              <Layers className="w-5 h-5" />
              {activePollsCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-bold rounded-full bg-indigo-600 text-white">
                  {activePollsCount}
                </span>
              )}
            </div>
            <span>Active</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-semibold ${
              activeTab === 'create'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create</span>
          </button>

          <button
            onClick={() => setActiveTab('mypolls')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-semibold ${
              activeTab === 'mypolls'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <FolderHeart className="w-5 h-5" />
            <span>My Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-semibold ${
              activeTab === 'analytics'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>

      </div>
    </header>
  );
};

