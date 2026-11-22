# RoyalPrep student

The student React/Vite application, separated from the RoyalPrep monorepo. It uses the RoyalPrep backend; the admin application is a separate project.

## Local development

Use Node 22 or newer.

1. Run `npm ci`.
2. Run the backend on `http://localhost:4000`.
3. Run `npm run dev`. The app listens on `http://127.0.0.1:5173` and proxies `/api` to the local backend.

Run `npm test` for API client tests and `npm run build` to type-check and build to `dist`. The public settings are in `src/shared/config/index.ts`; enable `chapterNotesEnabled` only when the backend's chapter notes feature is enabled.

The source is organized into `app`, page slices in `pages`, reusable `widgets`, domain types in `entities`, and `shared` API, assets, UI and styles. Axios handles API requests; Redux stores transient notifications. API responses are not cached.

## Vercel

Import this repository as a Vite project with the repository root as the project root, `npm ci` as the install command, `npm run build` as the build command, and `dist` as the output directory. Staging and production builds use the hosted API origin in `src/shared/config/index.ts`; no frontend environment variables are required. Change the origin in code and redeploy if the backend URL changes. `vercel.json` provides the SPA fallback. Frontend configuration is public; do not put secrets in it.

Sign-in is development-only until production authentication is implemented. Do not expose the backend's console verification service publicly or use it with real users' data.
