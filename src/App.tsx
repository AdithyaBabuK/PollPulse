import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PollFilterBar } from './components/PollFilterBar';
import { PollCard } from './components/PollCard';
import { CreatePollForm } from './components/CreatePollForm';
import { PollAnalytics } from './components/PollAnalytics';
import { MyPollsView } from './components/MyPollsView';
import { AuthModal, DEMO_USERS } from './components/AuthModal';
import { PetalWallpaper } from './components/PetalWallpaper';
import { Toast, ToastMessage } from './components/Toast';
import { INITIAL_POLLS } from './data/initialPolls';
import { Poll, TabType, ThemeMode, User, MultiUserVoteRecord, UserVoteRecord } from './types';
import { Vote, Plus, Sparkles, AlertCircle, Layers } from 'lucide-react';

export default function App() {
  // --- User Authentication State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pollpulse_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading current user:', e);
    }
    return DEMO_USERS[0]; // Default logged-in demo user for instant interactive experience
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('pollpulse_all_users');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading all users:', e);
    }
    return DEMO_USERS;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // --- LocalStorage Polls Initialization ---
  const [polls, setPolls] = useState<Poll[]>(() => {
    try {
      const saved = localStorage.getItem('pollpulse_polls_v2');
      if (saved) {
        const parsed: Poll[] = JSON.parse(saved);
        // Check for expired polls
        const now = Date.now();
        return parsed.map(p => ({
          ...p,
          status: p.expiresAt && p.expiresAt <= now ? 'Closed' : p.status
        }));
      }
    } catch (e) {
      console.error('Error reading localStorage polls:', e);
    }
    return INITIAL_POLLS;
  });

  // --- Multi-User Vote Records ---
  const [multiUserVotes, setMultiUserVotes] = useState<MultiUserVoteRecord>(() => {
    try {
      const saved = localStorage.getItem('pollpulse_multi_user_votes_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading localStorage multi-user votes:', e);
    }
    return {
      'user-demo-1': {},
      'user-demo-2': {},
      'user-demo-3': {},
    };
  });

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('Active');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Active user's vote record resolved dynamically
  const activeUserId = currentUser?.id || 'guest_user';
  const activeUserVotes: UserVoteRecord = multiUserVotes[activeUserId] || {};

  // Force dark class on <html> for live wallpaper theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Sync Polls, Users, and Multi-User Votes to LocalStorage
  useEffect(() => {
    localStorage.setItem('pollpulse_polls_v2', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('pollpulse_multi_user_votes_v2', JSON.stringify(multiUserVotes));
  }, [multiUserVotes]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pollpulse_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pollpulse_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pollpulse_all_users', JSON.stringify(users));
  }, [users]);

  // Periodic Expiry Check (Auto-closes polls when expiresAt reached)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPolls((prevPolls) => {
        let changed = false;
        const updated = prevPolls.map((poll) => {
          if (poll.expiresAt && poll.expiresAt <= now && poll.status === 'Active') {
            changed = true;
            return { ...poll, status: 'Closed' as const };
          }
          return poll;
        });
        if (changed) {
          addToast('One or more polls have reached their expiry time and closed.', 'info');
          return updated;
        }
        return prevPolls;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Auth Handlers ---
  const handleLoginUser = (user: User) => {
    setCurrentUser(user);
    addToast(`Logged in as ${user.name}`, 'success');
  };

  const handleRegisterUser = (newUserPayload: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...newUserPayload,
      id: `user-${Date.now()}`,
      createdAt: Date.now(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast(`Welcome to PollPulse, ${newUser.name}!`, 'success');
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    addToast('Signed out of PollPulse.', 'info');
  };

  // --- Voting & Poll Actions ---
  const handleVoteSubmit = (pollId: string, selectedOptionIds: string[]) => {
    if (activeUserVotes[pollId] || selectedOptionIds.length === 0) return;

    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map((option) => {
            if (selectedOptionIds.includes(option.id)) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });

          return {
            ...poll,
            totalVotes: poll.totalVotes + selectedOptionIds.length,
            options: updatedOptions,
          };
        }
        return poll;
      })
    );

    setMultiUserVotes((prev) => ({
      ...prev,
      [activeUserId]: {
        ...(prev[activeUserId] || {}),
        [pollId]: selectedOptionIds,
      },
    }));

    addToast('Vote submitted successfully!', 'success');
  };

  const handleCreatePoll = (newPollData: Omit<Poll, 'id' | 'totalVotes' | 'createdAt' | 'status'>) => {
    const newPoll: Poll = {
      ...newPollData,
      id: `poll-${Date.now()}`,
      totalVotes: 0,
      createdAt: Date.now(),
      status: 'Active',
    };

    setPolls((prev) => [newPoll, ...prev]);
    setActiveTab('active');
    setStatusFilter('Active');
    setSelectedCategory('All');
    setSearchTerm('');
    addToast('New poll published and open for voting!', 'success');
  };

  const handleDeletePoll = (pollId: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
    setMultiUserVotes((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((uId) => {
        if (copy[uId][pollId]) {
          delete copy[uId][pollId];
        }
      });
      return copy;
    });
    addToast('Poll removed.', 'info');
  };

  const handleToggleStatus = (pollId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          const newStatus = poll.status === 'Active' ? 'Closed' : 'Active';
          addToast(`Poll marked as ${newStatus}.`, 'info');
          return { ...poll, status: newStatus };
        }
        return poll;
      })
    );
  };

  const handleResetData = () => {
    if (window.confirm('Reset all polls to pre-populated sample data? Your custom polls will be replaced.')) {
      setPolls(INITIAL_POLLS);
      setMultiUserVotes({
        'user-demo-1': {},
        'user-demo-2': {},
        'user-demo-3': {},
      });
      addToast('Restored pre-populated sample polls!', 'info');
    }
  };

  const handleSharePoll = (poll: Poll) => {
    const shareText = `Vote on "${poll.question}" on PollPulse!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      addToast('Poll link copied to clipboard!', 'info');
    } else {
      addToast('Copy poll: ' + poll.question, 'info');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setStatusFilter('All');
    setSortBy('newest');
  };

  // --- Filtering & Sorting ---
  const filteredPolls = polls
    .filter((poll) => {
      // Search
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        poll.question.toLowerCase().includes(term) ||
        (poll.description && poll.description.toLowerCase().includes(term)) ||
        (poll.tags && poll.tags.some((tag) => tag.toLowerCase().includes(term))) ||
        poll.options.some((opt) => opt.text.toLowerCase().includes(term));

      // Category
      const matchesCategory = selectedCategory === 'All' || poll.category === selectedCategory;

      // Status (Expired polls evaluate as Closed)
      const effectiveStatus = (poll.expiresAt && poll.expiresAt <= Date.now()) ? 'Closed' : poll.status;
      const matchesStatus = statusFilter === 'All' || effectiveStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'most-voted') return b.totalVotes - a.totalVotes;
      if (sortBy === 'least-voted') return a.totalVotes - b.totalVotes;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      return b.createdAt - a.createdAt; // default newest
    });

  const activePollsCount = polls.filter((p) => {
    const isExpired = p.expiresAt ? p.expiresAt <= Date.now() : false;
    return p.status === 'Active' && !isExpired;
  }).length;

  const myPollsCount = currentUser
    ? polls.filter((p) => p.authorId === currentUser.id).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans transition-colors duration-300 relative overflow-x-hidden pb-20 flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Live Tree Petals Wallpaper Background */}
      <PetalWallpaper petalDensity={75} />

      <div className="relative z-10">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activePollsCount={activePollsCount}
          myPollsCount={myPollsCount}
          onResetData={handleResetData}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogoutUser}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 space-y-6">
          
          {/* TAB 1: ACTIVE & ALL POLLS VIEW */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              
              {/* Filter & Search Bar */}
              <PollFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                totalFilteredCount={filteredPolls.length}
                onClearFilters={handleClearFilters}
              />

              {/* Polls Grid */}
              {filteredPolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredPolls.map((poll) => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      userVotedOptionIds={activeUserVotes[poll.id] || []}
                      onVoteSubmit={handleVoteSubmit}
                      onDeletePoll={handleDeletePoll}
                      onToggleStatus={handleToggleStatus}
                      onSharePoll={handleSharePoll}
                    />
                  ))}
                </div>
              ) : (
                /* Empty Filter State */
                <div className="text-center py-16 px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      No polls found matching criteria
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                      Try adjusting your search terms, status filters, or category tags.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Poll
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE A POLL FORM */}
          {activeTab === 'create' && (
            <div className="py-2">
              <CreatePollForm
                onCreatePoll={handleCreatePoll}
                onCancel={() => setActiveTab('active')}
                currentUser={currentUser}
              />
            </div>
          )}

          {/* TAB 3: MY ACTIVITY / MY POLLS */}
          {activeTab === 'mypolls' && (
            <div className="py-2">
              <MyPollsView
                polls={polls}
                currentUser={currentUser}
                userVotes={activeUserVotes}
                onVoteSubmit={handleVoteSubmit}
                onDeletePoll={handleDeletePoll}
                onToggleStatus={handleToggleStatus}
                onSharePoll={handleSharePoll}
                onGoToCreate={() => setActiveTab('create')}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 4: POLL ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="py-2">
              <PollAnalytics polls={polls} />
            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-black text-[10px]">
              P
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">PollPulse</span>
            <span>— Real-Time Interactive Voting Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Instant State Persistence</span>
            <span>•</span>
            <span>Real-time Breakdown</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLoginUser}
        users={users}
        onRegister={handleRegisterUser}
        currentUser={currentUser}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

