# Media Publishing Policy

Large MP4 files in this folder are kept for local development but are ignored by Git.

For GitHub Pages or any public deployment, use one of these options:

1. Run `scripts/upload-release-media.ps1` to upload videos to the `media-current` GitHub Release.
2. Keep `VITE_ENABLE_LOCAL_MEDIA=false` in GitHub Pages builds.
3. The app will use GitHub Releases URLs in production and local `public/media` files in development.
