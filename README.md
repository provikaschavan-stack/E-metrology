# E-Metrology

Digital legal metrology verification portal built with React, Vite, Express, and PostgreSQL-compatible storage.

## Run locally

Install dependencies:

```powershell
npm install
Push-Location server
npm install
Pop-Location
```

Start the frontend:

```powershell
npm run dev
```

Start the API in a second terminal:

```powershell
npm run dev:server
```

Open `http://localhost:5173`.

## Connect Supabase

1. Create a Supabase project.
2. In Supabase, open **Connect** and copy the PostgreSQL **Session pooler** connection string.
3. Copy `server/.env.example` to `server/.env`.
4. Set `SUPABASE_DB_URL` to the connection string and keep `DATABASE_SSL=true`.
5. Set a strong `JWT_SECRET`.
6. Start the API with `npm run dev:server`.

On startup, the API creates the required tables and loads demo records when they do not already exist. The health endpoint reports `supabase-live` when the hosted database is connected:

`http://localhost:5000/api/health`

Never commit `server/.env` or database credentials.

## Validate

```powershell
npm run build
npm run lint
node server/test_api.js
node server/test_instruments.js
node server/test_applications.js
node server/test_certificates.js
node server/test_verifications.js
```
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
