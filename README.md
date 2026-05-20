# 🎂 BirthdayCircle

A private group birthday countdown and celebration website for your friend group.

## Features

- 🔐 Google Authentication
- 👤 Profile setup (name + birthday)
- 🏠 Dashboard with all your groups
- ➕ Create groups with unique invite codes
- 🔗 Join groups with invite codes
- 🎂 Birthday countdown for every member
- 🎉 Birthday Mode with confetti when it's someone's day
- 💌 Birthday Wish Board for posting messages

---

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication (Google)
- **Database**: Firebase Firestore
- **Deploy**: Vercel

---

## Setup Guide

### 1. Firebase Setup

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create a project"** → Give it a name → Continue
3. Go to **Authentication** → **Sign-in method** → Enable **Google**
4. Go to **Firestore Database** → **Create database** → Start in **test mode** (update rules later)
5. Go to **Project Settings** → **Your apps** → Add a **Web app**
6. Copy the Firebase config object

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

### 3. Firestore Indexes

The app uses a few Firestore queries that need indexes. Firebase will show you an error with a link to create them automatically when you first run the app. Click the link and create them.

Alternatively, create these manually:
- Collection: `birthdayWishes`, Fields: `groupId` (ASC), `birthdayUserId` (ASC), `createdAt` (ASC)

### 4. Firestore Security Rules

Deploy the rules from `firestore.rules` in **Firebase Console → Firestore → Rules**.

### 5. Local Development

```bash
npm install
npm run dev
```

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# Project Settings → Environment Variables
# Add all VITE_FIREBASE_* variables
```

Or connect your GitHub repo to Vercel and it deploys automatically on push.

---

## Project Structure

```
src/
├── components/
│   ├── BirthdayCard.jsx      # Individual birthday countdown card
│   ├── BirthdayMode.jsx      # Full-screen birthday celebration
│   ├── EmptyState.jsx        # Empty state UI
│   ├── GroupCard.jsx         # Group preview card
│   ├── LoadingSpinner.jsx    # Loading indicator
│   ├── Navbar.jsx            # Top navigation
│   └── WishBoard.jsx         # Birthday wish posting board
├── context/
│   └── AuthContext.jsx       # Auth state + Firebase functions
├── pages/
│   ├── LandingPage.jsx       # Home / sign-in page
│   ├── Dashboard.jsx         # User's groups dashboard
│   ├── ProfileSetup.jsx      # First-time profile setup
│   ├── CreateGroup.jsx       # Create a new group
│   ├── JoinGroup.jsx         # Join with invite code
│   └── GroupPage.jsx         # Main group page with countdowns
├── utils/
│   └── birthday.js           # All birthday calculation logic
├── firebase.js               # Firebase initialization
├── App.jsx                   # Router setup
├── main.jsx                  # Entry point
└── index.css                 # Global styles + Tailwind
```

---

## Learning Goals Covered

- ✅ React component architecture
- ✅ React Router for navigation
- ✅ Context API for global state
- ✅ Firebase Authentication
- ✅ Firestore CRUD operations
- ✅ Real-time listeners (onSnapshot)
- ✅ Protected routes
- ✅ Date logic & calculations
- ✅ Responsive CSS with Tailwind
- ✅ Animations & confetti
- ✅ Environment variables
- ✅ Vercel deployment

---

## Version 2 Ideas

- Edit profile / birthday
- Leave / delete group
- Better mobile responsiveness
- Multiple birthday people on same day
- Dark/light mode toggle
- Loading skeletons
