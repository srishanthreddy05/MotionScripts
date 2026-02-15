# TypoMotion - Typography Video Validation MVP

A minimal validation MVP for creating typography-based videos. This is a **validation tool only** - no authentication, no payments, no downloads.

## Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Remotion** (preview only)
- **Firebase Realtime Database** (validation data)

## Features

✅ Script Input - Paste your script, see it come to life  
✅ Live Preview - Vertical format (1080x1920), minimal aesthetic  
✅ Like/Dislike - Quick validation feedback  
✅ Feedback Collection - Understand what users need  
✅ Email Capture - Build waitlist for launch  
✅ Analytics - Track all user interactions  

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database**
3. Copy your Firebase config from Project Settings
4. Create `.env.local` file:

```bash
cp .env.example .env.local
```

5. Fill in your Firebase credentials in `.env.local`

### 3. Firebase Database Rules

Set these rules in Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "validation": {
      ".read": false,
      ".write": true,
      "events": {
        ".indexOn": ["type", "timestamp"]
      },
      "feedback": {
        ".indexOn": ["timestamp"]
      },
      "emails": {
        ".indexOn": ["timestamp"]
      }
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  page.tsx           # Main validation page
lib/
  firebase.ts        # Firebase initialization
  validation.ts      # Helper functions for analytics
remotion/
  video.tsx          # Typography video component
  Root.tsx           # Remotion root
```

## Analytics Events

The app tracks these events in Firebase:

- `visit` - Page load
- `script_paste` - User types in script
- `like` - User likes the tool
- `dislike` - User dislikes the tool
- `feedback_submit` - Feedback submitted
- `email_submit` - Email captured

## Database Structure

```
validation/
  events/
    {eventId}
      type: string
      timestamp: number
      metadata?: object
  
  feedback/
    {feedbackId}
      message: string
      timestamp: number
  
  emails/
    {emailId}
      email: string
      timestamp: number
```

## What This Is NOT

❌ Full SaaS product  
❌ Authentication system  
❌ Payment integration  
❌ Video download feature  

This is purely for **validation** - to test if people find this useful before building the full product.

## Next Steps

After validation:
1. Analyze Firebase data
2. Review feedback
3. Decide if there's demand
4. Build full product if validated

## Deploy on Vercel

```bash
vercel
```

Add your environment variables in Vercel dashboard.

---

Built with ❤️ for validation
