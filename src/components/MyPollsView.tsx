import React, { useState } from 'react';
import { Poll, User, UserVoteRecord } from '../types';
import { PollCard } from './PollCard';
import { FolderHeart, PlusCircle, Vote, Lock, Layers, CheckCircle2, User as UserIcon, Sparkles } from 'lucide-react';

interface MyPollsViewProps {
  polls: Poll[];
  currentUser: User | null;
  userVotes: UserVoteRecord;
  onVoteSubmit: (pollId: string, selectedOptionIds: string[]) => void;
  onDeletePoll: (pollId: string) => void;
  onToggleStatus: (pollId: string) => void;
  onSharePoll: (poll: Poll) => void;
  onGoToCreate: () => void;
  onOpenAuth: () => void;
}

export const MyPollsView: React.FC<MyPollsViewProps> = ({
  polls,
  currentUser,
  userVotes,
  onVoteSubmit,
  onDeletePoll,
  onToggleStatus,
  onSharePoll,
  onGoToCreate,
  onOpenAuth,
}) => {
  const [subTab, setSubTab] = useState<'created' | 'voted'>('created');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-white/10 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Track Your Poll History</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Log in or sign up to easily access polls created by your account and track your voting activity across sessions.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Log In / Sign Up Now</span>
        </button>
      </div>
    );
  }

  // Filter created polls
  const myCreatedPolls = polls.filter((p) => p.authorId === currentUser.id);

  // Filter voted polls
  const myVotedPollIds = Object.keys(userVotes).filter((pollId) => userVotes[pollId]?.length > 0);
  const myVotedPolls = polls.filter((p) => myVotedPollIds.includes(p.id));

  const displayPolls = subTab === 'created' ? myCreatedPolls : myVotedPolls;

  return (
    <div className="space-y-6">
      
      {/* Profile Activity Banner */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900/90 to-violet-900/90 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">{currentUser.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active User
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/30 p-2 rounded-2xl border border-white/10">
            <div className="px-4 py-2 text-center border-r border-white/10">
              <span className="block text-lg font-black text-white">{myCreatedPolls.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created</span>
            </div>
            <div className="px-4 py-2 text-center">
              <span className="block text-lg font-black text-indigo-400">{myVotedPolls.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Voted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Filter */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-black/30 p-1 rounded-2xl border border-slate-300/40 dark:border-white/10">
          <button
            onClick={() => setSubTab('created')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'created'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            <span>Polls Created by Me ({myCreatedPolls.length})</span>
          </button>

          <button
            onClick={() => setSubTab('voted')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'voted'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Polls I Voted On ({myVotedPolls.length})</span>
          </button>
        </div>

        <button
          onClick={onGoToCreate}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Poll</span>
        </button>
      </div>

      {/* Poll Grid */}
      {displayPolls.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              userVotedOptionIds={userVotes[poll.id] || []}
              onVoteSubmit={onVoteSubmit}
              onDeletePoll={onDeletePoll}
              onToggleStatus={onToggleStatus}
              onSharePoll={onSharePoll}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center bg-white/40 dark:bg-white/5 rounded-3xl border border-slate-200/60 dark:border-white/10 backdrop-blur-md">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
            {subTab === 'created'
              ? 'You have not created any polls yet.'
              : 'You have not voted on any polls yet.'}
          </p>
          <button
            onClick={onGoToCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Poll</span>
          </button>
        </div>
      )}

    </div>
  );
};
