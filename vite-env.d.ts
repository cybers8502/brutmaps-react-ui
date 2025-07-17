/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string;
  readonly VITE_SITE_URI: string;
  readonly VITE_WC_CONSUMER_KEY: string;
  readonly VITE_WC_CONSUMER_SECRET: string;
  readonly VITE_STRIPE_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
