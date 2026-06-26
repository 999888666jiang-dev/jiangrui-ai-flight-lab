# Video Assets

GitHub Pages production builds play this video from GitHub Releases after `scripts/upload-release-media.ps1` uploads it as `video-bay__fpv-lab-background.mp4`.

Local development keeps using `public/videos/fpv-lab-background.mp4`.

Place the real Video Bay background at:

`public/videos/fpv-lab-background.mp4`

Current site behavior: `展示.mp4` has been copied to this path and the Vue page uses it as the real Video Bay background, muted by default with a local sound toggle.

GitHub publishing behavior: MP4 files in `public/videos/` are ignored by Git by default. Production builds will not request this local file unless `VITE_ENABLE_LOCAL_MEDIA=true` or `VITE_VIDEO_BAY_SRC` is configured.
