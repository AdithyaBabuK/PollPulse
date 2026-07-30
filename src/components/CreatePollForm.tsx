import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Sparkles, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Tag, 
  AlignLeft,
  ListPlus,
  Clock,
  Calendar
} from 'lucide-react';
import { Poll, PollCategory, User } from '../types';

interface CreatePollFormProps {
  onCreatePoll: (newPoll: Omit<Poll, 'id' | 'totalVotes' | 'createdAt' | 'status'>) => void;
  onCancel?: () => void;
  currentUser?: User | null;
}

const CATEGORIES: PollCategory[] = ['Tech', 'Fun', 'Feedback', 'General', 'Design', 'Product'];

const PRESET_TEMPLATES = [
  {
    title: 'Team Meeting Time',
    category: 'General' as PollCategory,
    question: 'Which time slot works best for our weekly sync?',
    allowMultiple: true,
    options: ['Tuesday 10:00 AM EST', 'Wednesday 2:00 PM EST', 'Thursday 11:30 AM EST']
  },
  {
    title: 'Tech Stack Choice',
    category: 'Tech' as PollCategory,
    question: 'Which state management library should we standardize on?',
    allowMultiple: false,
    options: ['Zustand', 'Redux Toolkit', 'TanStack Store', 'React Context']
  },
  {
    title: 'Design Critique',
    category: 'Design' as PollCategory,
    question: 'Which layout direction feels cleaner for the app dashboard?',
    allowMultiple: false,
    options: ['Option A: Minimal Sidebar', 'Option B: Top Command Bar', 'Option C: Bento Grid Layout']
  }
];

export const CreatePollForm: React.FC<CreatePollFormProps> = ({ onCreatePoll, onCancel, currentUser }) => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PollCategory>('General');
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [expiryPreset, setExpiryPreset] = useState<'none' | '1h' | '24h' | '3d' | '7d' | 'custom'>('24h');
  const [customExpiry, setCustomExpiry] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setQuestion(template.question);
    setCategory(template.category);
    setAllowMultiple(template.allowMultiple);
    setOptions(template.options);
    setErrorMsg('');
  };

  const calculateExpiresAt = (): number | null => {
    const now = Date.now();
    switch (expiryPreset) {
      case '1h':
        return now + 3600000;
      case '24h':
        return now + 86400000;
      case '3d':
        return now + 86400000 * 3;
      case '7d':
        return now + 86400000 * 7;
      case 'custom':
        if (!customExpiry) return null;
        const time = new Date(customExpiry).getTime();
        return isNaN(time) ? null : time;
      case 'none':
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!question.trim()) {
      setErrorMsg('Please enter a poll question.');
      return;
    }

    const validOptions = options.map(o => o.trim()).filter(o => o.length > 0);
    if (validOptions.length < 2) {
      setErrorMsg('Please provide at least 2 non-empty poll options.');
      return;
    }

    const expiresAt = calculateExpiresAt();
    if (expiryPreset === 'custom' && !expiresAt) {
      setErrorMsg('Please select a valid future expiry date & time.');
      return;
    }
    if (expiresAt && expiresAt <= Date.now()) {
      setErrorMsg('Expiry date & time must be in the future.');
      return;
    }

    // Prepare poll data
    const newPollData = {
      question: question.trim(),
      description: description.trim() || undefined,
      category,
      allowMultiple,
      expiresAt,
      authorId: currentUser?.id,
      authorName: currentUser?.name || 'Anonymous Creator',
      authorAvatar: currentUser?.avatarUrl,
      options: validOptions.map((text, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text,
        votes: 0
      })),
      tags: tags.length > 0 ? tags : undefined
    };

    onCreatePoll(newPollData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-white/10 shadow-2xl overflow-hidden transition-all">
      
      {/* Form Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600/90 via-indigo-700/90 to-violet-700/90 p-6 md:p-8 text-white relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
                Poll Creator
              </span>
              {currentUser && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-100 border border-emerald-400/30">
                  Publishing as {currentUser.name}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Create a New Poll</h2>
            <p className="text-indigo-100 text-xs md:text-sm mt-1 max-w-lg font-medium">
              Formulate your question, set optional expiration timers, and publish instantly.
            </p>
          </div>
          <ListPlus className="w-12 h-12 text-white/20 hidden sm:block" />
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">

        {/* Quick Templates */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Quick Start Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.title}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200/50 dark:bg-white/5 hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-300/40 dark:border-white/10 transition-colors backdrop-blur-md"
              >
                + {tmpl.title}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs md:text-sm font-semibold flex items-center gap-2 backdrop-blur-md">
            <X className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Question Input */}
          <div className="space-y-2">
            <label id="label-poll-question" className="block text-sm font-bold text-slate-900 dark:text-slate-100">
              Poll Question <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-poll-question"
              type="text"
              required
              placeholder="e.g., Which backend database strategy fits our high-scale deployment?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-md"
            />
          </div>

          {/* Optional Description */}
          <div className="space-y-2">
            <label id="label-poll-description" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5" />
              Description / Context (Optional)
            </label>
            <textarea
              id="input-poll-description"
              rows={2}
              placeholder="Add additional context or constraints for voters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-md"
            />
          </div>

          {/* Grid: Category & Voting Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Category Selector */}
            <div className="space-y-2">
              <label id="label-poll-category" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Category
              </label>
              <select
                id="select-poll-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PollCategory)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-md"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Vote Mode Switch */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Voting Rules
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 backdrop-blur-md">
                <div className="space-y-0.5">
                  <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 block">
                    Allow Multiple Votes
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {allowMultiple ? 'Voters can check multiple choices' : 'Single option selection only'}
                  </span>
                </div>
                <button
                  id="toggle-multiple-votes"
                  type="button"
                  onClick={() => setAllowMultiple(!allowMultiple)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                    allowMultiple ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      allowMultiple ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Expiry Date & Time Section */}
          <div className="space-y-2 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-black/20 backdrop-blur-md">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                Poll Expiry Duration & Schedule
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Auto-closes when reached
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
              {[
                { id: '1h', label: '1 Hour' },
                { id: '24h', label: '24 Hours' },
                { id: '3d', label: '3 Days' },
                { id: '7d', label: '7 Days' },
                { id: 'none', label: 'No Expiry' },
                { id: 'custom', label: 'Custom' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setExpiryPreset(preset.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    expiryPreset === preset.id
                      ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                      : 'bg-white/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-indigo-400/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {expiryPreset === 'custom' && (
              <div className="pt-2 animate-fadeIn">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Select Custom Expiry Date & Time
                </label>
                <input
                  id="input-custom-expiry"
                  type="datetime-local"
                  value={customExpiry}
                  onChange={(e) => setCustomExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-black/40 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            )}
          </div>

          {/* Dynamic Options List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                Poll Options <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ({options.length}/6 options)
              </span>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
                    #{idx + 1}
                  </span>
                  <input
                    id={`input-option-${idx}`}
                    type="text"
                    required
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-md"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                      title="Remove option"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button
                id="btn-add-option"
                type="button"
                onClick={handleAddOption}
                className="mt-1 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors backdrop-blur-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Tags (Optional - Press Enter to add)
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-black/30 backdrop-blur-md">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30"
                >
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add another tag..."}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Form CTA Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/50 dark:border-white/5">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              id="btn-publish-poll"
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
            >
              <Send className="w-4 h-4" />
              <span>Publish Poll Immediately</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

