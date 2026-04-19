# RHNe Admin

Admin dashboard for the **RHNe** (Réseau hospitalier neuchâtelois) hospital network. Manage sites, services, doctors, events, jobs, newborns, patient info, appointment bookings, users, and roles — all in four languages.

Built with React 18, Vite 6, TypeScript, MUI 6 (+ DataGrid), Redux Toolkit (RTK Query), Recharts, and i18next.

## Getting started

```bash
cp .env.production.example .env   # adjust for local dev
npm install
npm run dev                        # http://localhost:5173
```

The API must be running at the URL configured in `VITE_API_URL` (default: `http://localhost:5000/api/v1`).

Login with `superadmin@rhne-clone.ch` / `SuperAdmin123!` for full access.

## Scripts

```
npm run dev             # dev server (port 5173)
npm run build           # production build
npm run preview         # preview build (port 8080)
npm run lint            # ESLint
npm run lint:fix        # auto-fix lint issues
npm run format          # Prettier format
npm run format:check    # Prettier check
npm run type-check      # TypeScript check
npm test                # Vitest
npm run test:ui         # Vitest with UI
npm run test:coverage   # coverage report
```

## Environment

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend API base URL |
| `VITE_APP_NAME` | App name (shown in header) |
| `VITE_DEFAULT_LANGUAGE` | Default language (`fr`) |
| `VITE_ENABLE_DEVTOOLS` | Redux DevTools (`true`/`false`) |

## Roles

| Role | Access |
| --- | --- |
| super_admin | Everything |
| admin | Platform management |
| content_editor | Services, events, patient info |
| hr_manager | Job postings |
| site_manager | Specific hospital site |

## Project layout

```
src/
├── app/           # Store, providers, root component
├── features/      # Feature modules
│   ├── appointments/           # Appointment types (reference data)
│   ├── appointment-bookings/   # Patient booking management
│   ├── auth/                   # Login, password reset
│   ├── dashboard/              # Stats + charts
│   ├── doctors/                # Doctor CRUD
│   ├── events/                 # Event CRUD
│   ├── jobs/                   # Job posting CRUD
│   ├── newborns/               # Birth announcements CRUD
│   ├── patient-info/           # Patient info pages CRUD
│   ├── rbac/                   # Role-permission management
│   ├── services/               # Service CRUD + contacts/links
│   ├── settings/               # User preferences
│   ├── sites/                  # Hospital site CRUD
│   └── users/                  # User management
├── i18n/          # Translations (FR, EN, DE, IT)
├── layouts/       # Admin layout, sidebar, header
├── routes/        # React Router config + guards
├── shared/        # Shared components, hooks, types, API base
└── styles/        # Global styles, theme
```

## Languages

Supports FR, EN, DE, IT. Default is French. Language can be switched in the settings page.

## Docker

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Production URL: https://rhne-admin.swiftapp.ch

## License

Private — All rights reserved.
