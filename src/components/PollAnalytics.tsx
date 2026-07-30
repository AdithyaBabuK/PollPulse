import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  PieChart, 
  Layers, 
  Download, 
  Activity, 
  CheckCircle2, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Poll } from '../types';

interface PollAnalyticsProps {
  polls: Poll[];
  onSelectPoll?: (pollId: string) => void;
}

export const PollAnalytics: React.FC<PollAnalyticsProps> = ({ polls, onSelectPoll }) => {
  // Aggregate Metrics
  const totalVotesAcrossAll = polls.reduce((acc, p) => acc + p.totalVotes, 0);
  const activePollsCount = polls.filter(p => p.status === 'Active').length;
  const closedPollsCount = polls.filter(p => p.status === 'Closed').length;

  // Most Popular Poll
  const sortedPollsByVotes = [...polls].sort((a, b) => b.totalVotes - a.totalVotes);
  const mostPopularPoll = sortedPollsByVotes[0];

  // Highest Voted Option across all polls
  let topSingleOption: { text: string; votes: number; pollQuestion: string } | null = null;
  polls.forEach(p => {
    p.options.forEach(opt => {
      if (!topSingleOption || opt.votes > topSingleOption.votes) {
        topSingleOption = { text: opt.text, votes: opt.votes, pollQuestion: p.question };
      }
    });
  });

  // Category engagement breakdown
  const categoryStats: Record<string, { count: number; votes: number }> = {};
  polls.forEach(p => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { count: 0, votes: 0 };
    }
    categoryStats[p.category].count += 1;
    categoryStats[p.category].votes += p.totalVotes;
  });

  const categoriesList = Object.entries(categoryStats).map(([category, data]) => ({
    category,
    pollCount: data.count,
    totalVotes: data.votes,
    percentageOfVotes: totalVotesAcrossAll > 0 ? Math.round((data.votes / totalVotesAcrossAll) * 100) : 0
  })).sort((a, b) => b.totalVotes - a.totalVotes);

  // Export Summary as JSON file download
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(polls, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pollpulse-analytics-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Poll Analytics & Real-Time Insights</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Comprehensive metric overview tracking participation, engagement share, and option leaderboards.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs transition-all"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Analytics JSON</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Votes */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Votes Cast
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalVotesAcrossAll.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Live
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Across {polls.length} total active & closed polls
          </p>
        </div>

        {/* Card 2: Active vs Closed */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Poll Ratio
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {activePollsCount}
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
              / {polls.length} Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {closedPollsCount} polls currently closed
          </p>
        </div>

        {/* Card 3: Top Performing Poll */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Top Reach Poll
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight block truncate">
              {mostPopularPoll ? `${mostPopularPoll.totalVotes} votes` : '0 votes'}
            </span>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold truncate mt-0.5">
              {mostPopularPoll?.question || 'None'}
            </p>
          </div>
        </div>

        {/* Card 4: Top Single Choice */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Most Voted Choice
            </span>
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight block truncate">
              {topSingleOption ? `${topSingleOption.votes} votes` : '0 votes'}
            </span>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-bold truncate mt-0.5">
              "{topSingleOption?.text || 'None'}"
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Category Breakdown & Most Popular Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Share Breakdown */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-500" />
              <span>Category Engagement</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">Distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoriesList.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{item.category}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.totalVotes} votes ({item.percentageOfVotes}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200/50 dark:bg-black/30 rounded-full overflow-hidden border border-slate-300/30 dark:border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                    style={{ width: `${item.percentageOfVotes}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight Card: Most Popular Poll Breakdown */}
        {mostPopularPoll && (
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-indigo-950/90 backdrop-blur-2xl text-white rounded-2xl p-6 md:p-8 shadow-2xl border border-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                  <Award className="w-3.5 h-3.5" />
                  #1 Most Popular Poll
                </span>
                <span className="text-xs text-indigo-200 font-medium">
                  {mostPopularPoll.category} Category
                </span>
              </div>

              <div>
                <h4 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  {mostPopularPoll.question}
                </h4>
                {mostPopularPoll.description && (
                  <p className="text-xs md:text-sm text-indigo-200 mt-1 line-clamp-2 font-medium">
                    {mostPopularPoll.description}
                  </p>
                )}
              </div>

              {/* Option breakdown */}
              <div className="space-y-2 pt-2">
                {mostPopularPoll.options.map((opt) => {
                  const pct = mostPopularPoll.totalVotes > 0 
                    ? Math.round((opt.votes / mostPopularPoll.totalVotes) * 100) 
                    : 0;
                  return (
                    <div key={opt.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-indigo-100">
                        <span>{opt.text}</span>
                        <span>{opt.votes} votes ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-indigo-950/80 rounded-full overflow-hidden border border-indigo-800/40">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-indigo-800/60 flex items-center justify-between text-xs text-indigo-300 font-medium relative z-10">
              <span>Total Engagement: <strong className="text-white font-bold">{mostPopularPoll.totalVotes} votes</strong></span>
              <span className="capitalize">Status: {mostPopularPoll.status}</span>
            </div>
          </div>
        )}
      </div>

      {/* Poll Leaderboard Table */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <span>Poll Leaderboard & Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked list of all polls by participation and engagement share.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-black/30 border-b border-slate-200/50 dark:border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Poll Question</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Total Votes</th>
                <th className="py-3.5 px-6 text-right">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/5 text-sm">
              {sortedPollsByVotes.map((poll, idx) => {
                const sharePct = totalVotesAcrossAll > 0 
                  ? Math.round((poll.totalVotes / totalVotesAcrossAll) * 100) 
                  : 0;

                return (
                  <tr 
                    key={poll.id} 
                    className="hover:bg-slate-200/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6 font-black text-slate-400 dark:text-slate-500 text-base">
                      #{idx + 1}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-100">
                      <div className="line-clamp-1">{poll.question}</div>
                      <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                        {poll.options.length} options • Created {new Date(poll.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs font-semibold">
                      <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-white/5">
                        {poll.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-semibold">
                      <span className={`px-2.5 py-1 rounded-md border ${
                        poll.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                      }`}>
                        {poll.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white">
                      {poll.totalVotes.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {sharePct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
