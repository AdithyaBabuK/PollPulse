export type PollCategory = 'Tech' | 'Fun' | 'Feedback' | 'General' | 'Design' | 'Product';

export type PollStatus = 'Active' | 'Closed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: number;
}

export interface Option {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  category: PollCategory;
  allowMultiple: boolean;
  totalVotes: number;
  options: Option[];
  createdAt: number;
  status: PollStatus;
  tags?: string[];
  expiresAt?: number | null;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
}

export type UserVoteRecord = Record<string, string[]>; // pollId -> array of optionIds voted for

export type MultiUserVoteRecord = Record<string, UserVoteRecord>; // userId -> (pollId -> optionIds[])

export type TabType = 'active' | 'create' | 'analytics' | 'mypolls';

export type ThemeMode = 'light' | 'dark';

