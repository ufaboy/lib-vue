declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  PROD: boolean;
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface BaseQuery {
  [key: string]: string | number | undefined;
  name?: string;
  sort?: string;
  perPage?: number;
  page?: number;
}