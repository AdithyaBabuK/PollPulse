import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Trash2, 
  Share2, 
  Lock, 
  Unlock, 
  Award, 
  Check, 
  Calendar, 
  BarChart2, 
  Sparkles,
  Info,
  Clock,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { Poll } from '../types';

interface PollCardProps {
  poll: Poll;
  userVotedOptionIds: string[]; // array of optionIds voted for
  onVoteSubmit: (pollId: string, selectedOptionIds: string[]) => void;
  onDeletePoll: (pollId: string) => void;
  onToggleStatus: (pollId: string) => void;
  onSharePoll: (poll: Poll) => void;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  userVotedOptionIds,
  onVoteSubmit,
  onDeletePoll,
  onToggleStatus,
  onSharePoll,
}) => {
  const [now, setNow] = useState<number>(Date.now());

  // Update time ticker every 10 seconds for smooth expiration calculation
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const isExpired = poll.expiresAt ? poll.expiresAt <= now : false;
  const isClosed = poll.status === 'Closed' || isExpired;
  const hasVoted = userVotedOptionIds.length > 0;

  // State for pending selections before "Submit Vote"
  const [selectedOptions, setSelectedOptions] = useState<string[]>(userVotedOptionIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultsManual, setShowResultsManual] = useState(false);

  // Category badge color mapping
  const categoryColors: Record<string, string> = {
    Tech: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    Feedback: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    Fun: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    General: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
    Design: 'bg-pink-500/10 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
    Product: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  };

  const handleOptionClick = (optionId: string) => {
    if (hasVoted || isClosed) return;

    if (poll.allowMultiple) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length === 0 || hasVoted || isClosed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onVoteSubmit(poll.id, selectedOptions);
      setIsSubmitting(false);
    }, 300);
  };

  // Format remaining time or expiry string
  const formatExpiryString = (): { text: string; urgent: boolean } => {
    if (!poll.expiresAt) return { text: 'No expiration', urgent: false };
    const diff = poll.expiresAt - now;
    if (diff <= 0) {
      const expDate = new Date(poll.expiresAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
      return { text: `Expired on ${expDate}`, urgent: true };
    }

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return { text: `Expires in ${days}d ${hours % 24}h`, urgent: false };
    }
    if (hours > 0) {
      return { text: `Expires in ${hours}h ${minutes % 60}m`, urgent: hours < 3 };
    }
    return { text: `Expires in ${minutes}m`, urgent: true };
  };

  const expiryInfo = formatExpiryString();

  // Calculate highest vote count to highlight winner
  const maxVotes = Math.max(...poll.options.map(o => o.votes), 0);

  const formattedDate = new Date(poll.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const shouldDisplayResults = hasVoted || isClosed || showResultsManual;

  return (
    <div 
      id={`poll-card-${poll.id}`}
      className={`group bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isClosed 
          ? 'border-slate-300/60 dark:border-white/10 opacity-90' 
          : 'border-slate-200/60 dark:border-white/10 hover:border-indigo-500/40'
      }`}
    >
      {/* Top Header Row */}
      <div className="p-5 md:p-6 pb-0 space-y-3">
        
        {/* Badges & Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-2">
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${categoryColors[poll.category] || categoryColors.General}`}>
              {poll.category}
            </span>

            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md flex items-center gap-1 border ${
              isClosed 
                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20' 
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
            }`}>
              {isClosed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {isExpired ? 'Expired' : poll.status}
            </span>

            {/* Expiry Countdown Badge */}
            {poll.expiresAt && (
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md flex items-center gap-1 border ${
                expiryInfo.urgent
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 animate-pulse'
                  : 'bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-300/40 dark:border-white/5'
              }`}>
                <Clock className="w-3 h-3" />
                {expiryInfo.text}
              </span>
            )}

            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-300/40 dark:border-white/5">
              {poll.allowMultiple ? 'Multiple votes' : 'Single vote'}
            </span>
          </div>

          {/* Controls: Share, Toggle Status, Delete */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onSharePoll(poll)}
              title="Share Poll"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleStatus(poll.id)}
              title={isClosed ? 'Reopen Poll' : 'Close Poll'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            >
              {isClosed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onDeletePoll(poll.id)}
              title="Delete Poll"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Author Badge if provided */}
        {poll.authorName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {poll.authorAvatar ? (
              <img src={poll.authorAvatar} alt={poll.authorName} className="w-4 h-4 rounded-full object-cover" />
            ) : (
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>By <strong className="text-slate-800 dark:text-slate-200">{poll.authorName}</strong></span>
          </div>
        )}

        {/* Question Title & Description */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
            {poll.question}
          </h2>
          {poll.description && (
            <p className="mt-1 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {poll.description}
            </p>
          )}
        </div>

        {/* Closed/Expired Notice Banner */}
        {isClosed && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>
              {isExpired ? 'This poll has reached its expiration date. Final results are locked below.' : 'Voting is manually closed for this poll.'}
            </span>
          </div>
        )}
      </div>

      {/* Options Form / Live Results */}
      <div className="p-5 md:p-6 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {poll.options.map((option) => {
            const percentage = poll.totalVotes > 0 
              ? Math.round((option.votes / poll.totalVotes) * 100) 
              : 0;

            const isSelected = selectedOptions.includes(option.id);
            const isUserVotedThis = userVotedOptionIds.includes(option.id);
            const isWinner = maxVotes > 0 && option.votes === maxVotes && shouldDisplayResults;

            return (
              <div 
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`relative rounded-xl border transition-all duration-200 overflow-hidden ${
                  hasVoted || isClosed
                    ? 'cursor-default border-slate-200/60 dark:border-white/10'
                    : isSelected
                      ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 cursor-pointer shadow-md'
                      : 'border-slate-200/60 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-100/40 dark:bg-black/20 cursor-pointer'
                }`}
              >
                {/* Animated Progress Bar Background */}
                {shouldDisplayResults && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-r-lg ${
                      isWinner
                        ? 'bg-indigo-500/20 dark:bg-indigo-500/30 border-r-2 border-indigo-400/80 backdrop-blur-sm'
                        : 'bg-slate-300/40 dark:bg-white/10 backdrop-blur-xs'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Option Content Container */}
                <div className="relative z-10 p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    
                    {/* Input Control (Radio/Checkbox) or User Voted Checkmark */}
                    {!shouldDisplayResults ? (
                      <div className={`flex items-center justify-center w-5 h-5 transition-colors ${
                        poll.allowMultiple ? 'rounded-md' : 'rounded-full'
                      } border ${
                        isSelected
                          ? 'bg-indigo-500 border-indigo-500 text-white'
                          : 'border-slate-300 dark:border-white/20 bg-white/50 dark:bg-black/30'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    ) : (
                      isUserVotedThis ? (
                        <div className="p-0.5 rounded-full bg-indigo-500 text-white shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isWinner ? (
                        <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-white/20 flex-shrink-0" />
                      )
                    )}

                    {/* Option Text */}
                    <span className={`text-sm font-medium leading-snug truncate ${
                      isUserVotedThis
                        ? 'text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {option.text}
                    </span>

                    {/* "Your Vote" Badge */}
                    {isUserVotedThis && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500 text-white shadow-sm">
                        Your Vote
                      </span>
                    )}
                  </div>

                  {/* Results Metrics */}
                  {shouldDisplayResults && (
                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                      </span>
                      <span className={`text-xs font-bold w-10 text-right ${
                        isWinner
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Submit Vote CTA for un-voted active poll */}
          {!hasVoted && !isClosed && (
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={selectedOptions.length === 0 || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 ${
                  selectedOptions.length > 0 && !isSubmitting
                    ? 'bg-indigo-500 hover:bg-indigo-400 active:scale-[0.99] shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                    : 'bg-slate-300/60 dark:bg-white/5 text-slate-400 dark:text-slate-600 border border-slate-300/40 dark:border-white/5 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Recording Vote...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Vote</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Manual Toggle to Preview Results */}
        {!hasVoted && !isClosed && (
          <div className="text-center">
            <button
              onClick={() => setShowResultsManual(!showResultsManual)}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{showResultsManual ? 'Hide Live Breakdown' : 'Preview Live Breakdown'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 md:px-6 py-3.5 bg-slate-100/50 dark:bg-black/30 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium backdrop-blur-md">
        
        {/* Vote Counter Badge */}
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">{poll.totalVotes}</strong> {poll.totalVotes === 1 ? 'total vote' : 'total votes'}
          </span>
        </div>

        {/* Date & Voted State Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          {hasVoted && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              Voted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
