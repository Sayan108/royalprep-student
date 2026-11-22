# RoyalPrep student

The student React/Vite application, separated from the RoyalPrep monorepo. It uses the RoyalPrep backend; the admin application is a separate project.

## Local development

Use Node 22 or newer.

1. Run `npm ci`.
2. Copy `.env.example` to `.env`. Leave `VITE_API_URL` empty for the local Vite proxy to `http://localhost:4000`, or set it to the backend origin without `/api` or a trailing slash.
3. Run `npm run dev`. The app listens on `http://127.0.0.1:5173`.

Run `npm run build` to type-check and build to `dist`. Set `VITE_CHAPTER_NOTES_ENABLED=true` only when the backend's chapter notes feature is enabled.

## Vercel

Import this repository as a Vite project with the repository root as the project root, `npm ci` as the install command, `npm run build` as the build command, and `dist` as the output directory. Set `VITE_API_URL` to the HTTPS backend origin and redeploy after changing environment variables. `vercel.json` provides the SPA fallback. Variables prefixed `VITE_` are public in the browser bundle; do not put secrets in them.

Sign-in is development-only until production authentication is implemented. Do not expose the backend's console verification service publicly or use it with real users' data.
