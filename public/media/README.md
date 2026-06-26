# Media Publishing Policy

Large MP4 files in this folder are kept for local development but are ignored by Git.

For GitHub Pages or any public deployment, use one of these options:

1. Upload videos to CDN/object storage and add `streamUrl` in `src/data/showcaseMedia.ts`.
2. Build with `VITE_ENABLE_LOCAL_MEDIA=true` only if the deployment target can serve the files.
3. Keep media disabled in production; the site will show designed placeholders without requesting missing files.
