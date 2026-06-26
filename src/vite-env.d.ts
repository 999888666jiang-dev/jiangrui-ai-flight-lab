/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_LOCAL_MEDIA?: string;
  readonly VITE_VIDEO_BAY_SRC?: string;
  readonly VITE_GITHUB_OWNER?: string;
  readonly VITE_GITHUB_REPOSITORY_OWNER?: string;
  readonly VITE_GITHUB_REPOSITORY_NAME?: string;
  readonly VITE_GITHUB_MEDIA_TAG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
