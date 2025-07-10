<h1 align="center">🍽️ React Native Recipe App 🍽️</h1>

Highlights:

- 🔐 Signup, Login, and 6-Digit Email Verification with **Better Auth**
- 🍳 Browse Featured Recipes & Filter by Categories
- 🔍 Search Recipes and View Detailed Cooking Instructions
- 🎥 Recipe Pages Include YouTube Video Tutorials
- ❤️ Add Recipes to Favorites and Access Them from Favorites Tab
- ⚡ Tech Stack: React Native + Expo / PostgreSQL + Hono + Cloudflare Workers
- 🌈 Includes 8 Color Themes
- 🆓 100% Free Tools — No Paid Services Required

---

## 🗝 .dev.vars Setup

### Backend (`/backend`)

```bash
BETTER_AUTH_SECRET="from better-auth docs"
RESEND_API_KEY="from resend.com"
```

## 🔑 .env Setup

### Mobile App (`/mobile`)

```bash
EXPO_PUBLIC_API_URL="http://your-ip-address:8787"
```

---

## 🔧 Run the Backend

```bash
cd backend
pnpm run dev
```

## 📱 Run the Mobile App

```bash
cd mobile
pnpm install
pnpm dlx expo start
```
