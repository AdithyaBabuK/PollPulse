import { Poll } from '../types';

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'poll-1',
    question: 'Best Frontend Framework in 2026?',
    description: 'Which core framework or ecosystem are you betting on for major production builds this year?',
    category: 'Tech',
    allowMultiple: false,
    totalVotes: 248,
    status: 'Active',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    tags: ['React', 'Next.js', 'Vue', 'Svelte'],
    options: [
      { id: 'opt-1-1', text: 'React 19+ / Next.js', votes: 124 },
      { id: 'opt-1-2', text: 'Vue 4 / Nuxt', votes: 48 },
      { id: 'opt-1-3', text: 'Svelte 5 / SvelteKit', votes: 52 },
      { id: 'opt-1-4', text: 'SolidJS / Qwik', votes: 24 }
    ]
  },
  {
    id: 'poll-2',
    question: 'Where should our team go for retreat?',
    description: 'Help us choose the location for our upcoming Q3 engineering & design team gathering.',
    category: 'Feedback',
    allowMultiple: true,
    totalVotes: 96,
    status: 'Active',
    createdAt: Date.now() - 86400000 * 4, // 4 days ago
    tags: ['Team', 'Retreat', 'Travel'],
    options: [
      { id: 'opt-2-1', text: 'Alpine Mountain Lodge & Hiking', votes: 38 },
      { id: 'opt-2-2', text: 'Tropical Beach Resort & Surf', votes: 44 },
      { id: 'opt-2-3', text: 'Cultural City Exploration & Tech Hub', votes: 14 }
    ]
  },
  {
    id: 'poll-3',
    question: 'Favorite Remote Work Setup?',
    description: 'Where do you feel most creative and productive during deep focus blocks?',
    category: 'Fun',
    allowMultiple: false,
    totalVotes: 180,
    status: 'Closed',
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    tags: ['Remote', 'Productivity', 'Setup'],
    options: [
      { id: 'opt-3-1', text: 'Ergonomic Standing Desk & Dual Monitors', votes: 98 },
      { id: 'opt-3-2', text: 'Cozy Neighborhood Specialty Coffee Shop', votes: 28 },
      { id: 'opt-3-3', text: 'Flexible Co-working Space with Community', votes: 54 }
    ]
  }
];
