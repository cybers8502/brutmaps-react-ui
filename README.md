# Brutmaps — Web

React + TypeScript + Vite web client for Brutmaps, an interactive map of
brutalist architecture. Part of a three-repo project:

| Repo | Role |
| --- | --- |
| [`wp-brutmaps`](../wp-brutmaps) | WordPress backend — REST (`/wp-json/v1`) + GraphQL (`/graphql`) API, content/admin |
| **`r-brutmaps`** (this repo) | Web app (React/Vite) — public site, map, shop, account |
| [`expo-brutmaps`](../expo-brutmaps) | Mobile app (Expo/React Native, iOS/Android) |

Both clients talk to the same `wp-brutmaps` backend. Most data (sights,
architects, blog, shop, favorites, profile) is fetched over REST; auth
(`login`, `register`, `googleAuth`, `checkEmail`, token refresh) goes through
GraphQL, provided by WPGraphQL + wp-graphql-jwt-authentication. See
`wp-brutmaps/README.md` for the full API reference.

## Stack

- React 18 + TypeScript, Vite
- `react-router-dom` for routing
- `react-map-gl` / `mapbox-gl` for the map, `@mapbox/mapbox-gl-geocoder` for search
- `swr` for data fetching, `react-hook-form` for forms
- `i18next` / `react-i18next` for localization
- `sass` for styling, `framer-motion` for animation
- WooCommerce REST API for the shop

## Getting started

```bash
yarn install       # or npm install
yarn dev           # vite dev server
```

Other scripts: `build:dev`, `build:prod`, `preview`, `lint`, `format`.

## Environment

Copy `.env.development` / `.env.production` (not committed — see `.gitignore`)
with:

- `VITE_SITE_URI` — `wp-brutmaps` base URL (REST + GraphQL live here)
- `VITE_MAPBOX_ACCESS_TOKEN` — Mapbox GL token
- `VITE_WC_CONSUMER_KEY` / `VITE_WC_CONSUMER_SECRET` — WooCommerce REST API keys
- `VITE_STRIPE_SECRET_KEY` — Stripe (checkout)
- `VITE_GOOGLE_CLIENT_ID` / `VITE_GOOGLE_CLIENT_SECRET` — Google sign-in

## Structure

```
src/
├── pages/          # route-level views (CommonMap, SightPage, ShopPage, MyAccount, ...)
├── components/      # shared UI components
├── layouts/         # page layout wrappers
├── hooks/fetchApi/  # SWR hooks per REST resource
├── services/        # apiService (REST) and mapService
├── util/            # graphql.ts (GraphQL client used for auth) + helpers
├── configs/         # API/map config constants
├── context/         # React context providers
├── routes/          # route definitions
└── styles/          # global SCSS
```
