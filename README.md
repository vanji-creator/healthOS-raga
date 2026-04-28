# HealthOS — B2B Healthcare SaaS Platform

A production-quality frontend application built as part of the Raga AI Frontend Developer Assignment.
https://health-os-raga.vercel.app/ 

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — click **"Try Demo Account"** to log in instantly.

**Demo credentials:** `test@demo.com` / `demo1234`

No Firebase setup needed to test — the app uses a built-in mock auth fallback.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Strict typing, component composition |
| Build | Vite | Fast HMR, optimized bundles |
| State | Zustand | Low boilerplate, fine-grained subscriptions |
| Styling | Tailwind CSS v4 | Responsive-first, no CSS files to maintain |
| Charts | Recharts | Composable, accessible charting |
| Auth | Firebase + mock fallback | Real auth ready; mock for instant review |
| Icons | Lucide React | Consistent, tree-shakeable |

---

## Features

### Authentication
- Firebase Email/Password auth (configurable via `.env`)
- Mock login fallback — no Firebase project needed for reviewers
- Client-side validation with real-time error feedback
- Session persistence via Zustand `persist` middleware

### Dashboard
- 4 live KPI stat cards with trend indicators
- Patient admissions line chart (last 7 days)
- Status distribution progress bars
- Recent patients table with click-through

### Analytics
- Date range filter toggle (7/30/90 days)
- Conditions breakdown bar chart with color-coded bars
- Status distribution donut chart
- Weekly admissions vs discharges area chart

### Patient Management
- 20 realistic mock patients across diverse conditions and wards
- **Grid View** — card-based layout with avatar, status badge, quick actions
- **List View** — full-width table with responsive column hiding
- Search by name, condition, doctor, or patient ID
- Filter by status (All / Stable / Recovering / Critical / Discharged)
- Click any patient → full detail modal with "Send Alert" action

### Notifications (Service Worker)
- SW registered on load with cache-first offline strategy
- Browser push notifications on login and critical patient events
- In-app notification center with unread badge count
- Mark individual / all notifications as read

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Card, StatCard, Badge, Input, Toggle, Modal
│   └── layout/      # Sidebar, Header, Layout (protected route wrapper)
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Analytics/
│   └── Patients/    # PatientsPage, PatientCard, PatientRow, PatientModal
├── store/           # authStore, patientStore, uiStore (Zustand)
├── firebase/        # Firebase config with env var guards
├── hooks/           # useNotifications
├── types/           # Shared TypeScript interfaces
├── data/            # mockPatients.ts + chart datasets
└── utils/           # SW registration, notification helpers
```

---

## Firebase Setup (Optional)

The app works without Firebase using mock credentials. To enable real Firebase auth:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** authentication
3. Copy `.env.example` → `.env` and fill in your config values

---

## Deploy

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir=dist
```

Set `VITE_FIREBASE_*` environment variables in your hosting dashboard if using real Firebase auth.

---

## Performance

- Page-level code splitting via `React.lazy` + `Suspense`
- `useMemo` on filtered patient list
- Zustand `persist` only stores minimal state (viewMode, user session)
- Production bundle: ~215KB gzipped
