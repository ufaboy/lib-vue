declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  PROD: boolean;
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
