# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Firebase

1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Enter project name (e.g., "typomotion-validation")
4. Disable Google Analytics (not needed for validation)
5. Click "Create project"

### Step 3: Enable Realtime Database

1. In Firebase Console, click "Build" → "Realtime Database"
2. Click "Create Database"
3. Select location (choose closest to your users)
4. Start in **test mode** (we'll update rules next)
5. Click "Enable"

### Step 4: Get Firebase Config

1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app (nickname: "typomotion")
5. Copy the `firebaseConfig` object

### Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in values from your Firebase config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 6: Update Database Rules

1. In Firebase Console → Realtime Database → Rules tab
2. Replace with these rules:

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

3. Click "Publish"

### Step 7: Run the App

```bash
npm run dev
```

Open http://localhost:3000

## ✅ Verify Setup

Test these features:
- [ ] Script input updates preview
- [ ] Like/Dislike buttons work
- [ ] Feedback can be submitted
- [ ] Email can be captured
- [ ] Check Firebase Console → Realtime Database to see data appearing

## 📊 View Validation Data

Go to Firebase Console → Realtime Database → Data tab

You'll see:
```
validation/
  ├── events/
  ├── feedback/
  └── emails/
```

Click on each to see real-time validation data!

## 🚨 Troubleshooting

**"Module not found" error?**
- Run `npm install` again

**"Firebase: Error (auth/invalid-api-key)"?**
- Check your `.env.local` file
- Make sure all values are correct and no extra spaces

**Data not appearing in Firebase?**
- Check browser console for errors
- Verify database rules are published
- Make sure DATABASE_URL ends with `.firebaseio.com` or `.firebasedatabase.app`

**Preview not showing?**
- This is normal if Remotion hasn't loaded yet
- Try refreshing the page

## 🎯 Next Steps

1. Share the app with potential users
2. Monitor Firebase for validation data
3. Analyze feedback and email signups
4. Decide if there's enough interest to build the full product

---

Need help? Check the main README.md for more details.
