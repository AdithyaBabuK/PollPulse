# PollPulse — Real-Time Interactive Polling Application

**PollPulse** is a modern, high-performance, interactive real-time polling platform built with React 19, TypeScript, Vite, and Tailwind CSS. Featuring a dark glassmorphic design system, dynamic canvas animations, multi-user authentication simulation, real-time analytics breakdown, and automated poll expiration, PollPulse provides an intuitive experience for creating, voting on, and analyzing community polls.

---

## 🎓 CODETECH INTERNSHIP DETAILS

- **Internship ID**: CITS4857
- **Task Name**: Real-Time Polling Application
- **Domain**: Full-Stack Web Development

---

## 🌟 Key Features

### 🗳️ Interactive Polling & Voting
- **Single & Multiple Choice Support**: Create polls allowing single-option selection or multi-option checkboxes.
- **Dynamic Options**: Add up to 6 custom options per poll with real-time validation.
- **Instant Percentage & Bar Calculation**: Interactive voting updates vote totals, percentages, and visual progress bars instantly.
- **Vote Revision & Revocation**: Users can modify or revoke their cast votes at any time.
- **Pre-Designed Templates**: Quick-start poll creation using built-in templates (*Team Meeting Time*, *Tech Stack Choice*, *Design Critique*).

### 👥 Multi-User Management & Authentication
- **Account Switching & Demo Profiles**: Switch between built-in demo profiles (*Lead Designer*, *Senior Frontend Dev*, *Product Manager*) or register custom user accounts.
- **Independent Vote Isolation**: Tracks individual user votes separately per account.
- **User Ownership & "My Polls" View**: Dedicated dashboard for users to review, manually close, or delete polls they authored.

### 📊 Real-Time Analytics & Data Export
- **Platform Key Metrics**: High-level KPIs showcasing total platform votes, active polls, closed polls, and top-performing options.
- **Category Engagement Breakdown**: Visual breakdown of votes and poll distribution across categories (*Tech*, *Fun*, *Feedback*, *General*, *Design*, *Product*).
- **JSON Data Export**: Export complete platform poll analytics and engagement metrics to a `.json` summary file with one click.

### 🔍 Advanced Filtering & Search
- **Full-Text Search**: Live keyword search matching poll questions, descriptions, and custom tags.
- **Category Filter Pills**: Filter active feed by specific categories.
- **Status Filter**: Toggle between *Active*, *Closed*, or *All* polls.
- **Smart Sorting**: Order polls by *Newest First*, *Most Popular* (total votes), or *Expiring Soon*.

### ⏱️ Lifecycle Management & Automated Expiry
- **Flexible Expiry Options**: Set poll lifespans to *1 Hour*, *24 Hours*, *3 Days*, *7 Days*, *Custom Datetime*, or *No Expiration*.
- **Automated Background Closing**: A 15-second background daemon monitors active polls and automatically transitions expired polls to *Closed* status with toast notifications.

### 🎨 Premium Aesthetics & UX
- **Glassmorphic UI**: Sleek dark-mode aesthetic with translucent panels, backdrop blurs, subtle borders, and smooth transitions.
- **Animated Petal Canvas**: Custom HTML5 Canvas wallpaper rendering ambient floating, glowing particles.
- **Toast Notifications**: Non-intrusive notification toasts for actions like voting, creating polls, copying share links, and status updates.

---

## 🏗️ Project Architecture & Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Type Safety**: [TypeScript 5.8](https://www.typescriptlang.org/)
- **Build Tool & Bundler**: [Vite 6.2](https://vitejs.dev/)
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Animation Utilities**: [Motion](https://motion.dev/)
- **State Persistence**: Browser `localStorage` API (`pollpulse_polls_v2`, `pollpulse_multi_user_votes_v2`, `pollpulse_current_user`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/PollPulse.git
   cd PollPulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 💾 Local Storage Schema

PollPulse seamlessly persists application state in the browser's `localStorage`:

| Key | Description |
|---|---|
| `pollpulse_polls_v2` | Stores the array of all active and closed polls. |
| `pollpulse_multi_user_votes_v2` | Nested record mapping `userId -> pollId -> optionIds[]`. |
| `pollpulse_current_user` | Currently authenticated user object. |
| `pollpulse_all_users` | Registered users list including custom accounts and demo users. |

---

## 📄 License

Distributed under the MIT License. Demo project developed for CodeTech Solutions Internship.
