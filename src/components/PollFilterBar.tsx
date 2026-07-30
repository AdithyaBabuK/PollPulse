import React from 'react';
import { Search, Filter, SortAsc, RefreshCw, Layers } from 'lucide-react';
import { PollCategory } from '../types';

interface PollFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalFilteredCount: number;
  onClearFilters: () => void;
}

const CATEGORIES: (PollCategory | 'All')[] = ['All', 'Tech', 'Fun', 'Feedback', 'General', 'Design', 'Product'];

export const PollFilterBar: React.FC<PollFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  totalFilteredCount,
  onClearFilters,
}) => {
  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || statusFilter !== 'All' || sortBy !== 'newest';

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-slate-200/60 dark:border-white/10 shadow-xl space-y-4">
      {/* Top row: Search & Status Selector */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="poll-search-input"
            type="text"
            placeholder="Search polls by question, description or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-md"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Toggle Buttons */}
        <div className="flex items-center p-1 bg-slate-200/50 dark:bg-black/30 rounded-xl border border-slate-300/50 dark:border-white/10 text-xs font-semibold backdrop-blur-md">
          {['All', 'Active', 'Closed'].map((status) => (
            <button
              key={status}
              id={`status-filter-${status.toLowerCase()}`}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === status
                  ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm border border-slate-200/80 dark:border-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            id="poll-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs md:text-sm font-medium rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 backdrop-blur-md"
          >
            <option value="newest" className="bg-slate-900 text-white">Newest First</option>
            <option value="most-voted" className="bg-slate-900 text-white">Most Votes</option>
            <option value="least-voted" className="bg-slate-900 text-white">Least Votes</option>
            <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <div className="flex items-center text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-wider whitespace-nowrap">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Categories:
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`cat-filter-${cat.toLowerCase()}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              selectedCategory === cat
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                : 'bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-slate-300/40 dark:border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Filters
          </button>
        )}
      </div>

      {/* Results summary counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-1.5 font-medium">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Showing <strong className="text-slate-800 dark:text-slate-200">{totalFilteredCount}</strong> {totalFilteredCount === 1 ? 'poll' : 'polls'}</span>
        </div>
        {hasActiveFilters && (
          <span className="italic text-slate-400">Filters applied</span>
        )}
      </div>
    </div>
  );
};
