# Fire Incident Management System — Frontend

A stable **Vite + React + TypeScript** application for fire safety operational teams. It provides a public product overview followed by protected views for dashboard metrics, asset records, work orders, and response coordination.

## Application flow

`/` is the public Fire System landing page. `/login` and `/register` provide the authentication entry points. Dashboard and operational routes (`/home`, `/assets`, `/work-orders`, and related detail pages) are protected and redirect unauthenticated visitors to login.

The current repository has no backend authentication endpoint. For local/UAT use, the app stores only a minimal local session profile in browser storage after a successful form submission; passwords are never stored. Replace `src/auth/authService.ts` with the approved backend integration before connecting to production identity services.

---

## 🚀 Prerequisites

- **Node.js**: `^20.0.0` or higher
- **npm**: `^10.0.0` or higher

---

## 🛠️ Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd fire-incident-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Modify `.env.local` as needed for local/UAT endpoints:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_ENV=development
   VITE_APP_NAME=Fire Incident Management System
   ```

---

## 💻 Available Scripts

| Command                | Description                                                                    |
| :--------------------- | :----------------------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server                                             |
| `npm run build`        | Performs TypeScript compilation (`tsc -b`) and builds production bundle        |
| `npm run preview`      | Previews the local production build output                                     |
| `npm run typecheck`    | Validates TypeScript static types without emitting code                        |
| `npm run lint`         | Runs ESLint across all `.ts` and `.tsx` files                                  |
| `npm run lint:fix`     | Automatically fixes ESLint warnings and errors                                 |
| `npm run format`       | Formats all code files with Prettier                                           |
| `npm run format:check` | Checks formatting compliance with Prettier                                     |
| `npm run test`         | Executes Vitest unit and integration tests                                     |
| `npm run check`        | Runs full validation pipeline (`typecheck` + `lint` + `format:check` + `test`) |
| `npm run prepare`      | Initializes Husky Git pre-commit hooks                                         |

---

## 🐶 Husky & Git Hygiene

This repository enforces Git hygiene using **Husky** and **lint-staged**.
Upon committing changes, staged `.ts` and `.tsx` files automatically run through ESLint and Prettier formatting checks.

---

## 📂 Architecture & Directory Structure

```text
fire-incident-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   └── pre-commit
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── authService.ts
│   │   └── types.ts
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/
│   │   │   ├── BottomNavigation.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/
│   │       ├── AssetCard.tsx
│   │       ├── DashboardCard.tsx
│   │       └── ProgressCard.tsx
│   ├── config/
│   │   └── env.ts
│   ├── pages/
│   │   ├── AssetDetails.tsx
│   │   ├── Assets.tsx
│   │   ├── Chat.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Register.tsx
│   │   ├── NotFound.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   ├── Timer.tsx
│   │   ├── WorkOrderDetails.tsx
│   │   └── WorkOrders.tsx
│   ├── services/
│   │   └── incidentService.ts
│   ├── routes/
│   │   └── ProtectedRoute.tsx
│   ├── styles/
│   ├── test/
│   │   └── setup.ts
│   ├── types/
│   │   └── index.ts
│   ├── __tests__/
│   │   ├── App.test.tsx
│   │   ├── Header.test.tsx
│   │   └── incidentService.test.ts
│   ├── App.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .env.local
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 🧪 UAT & CI Validation

To ensure UAT readiness before deployment, run:

```bash
npm run check
npm run build
```

Both commands must complete with exit code `0`.
