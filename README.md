# AI Flight Lab

姜睿个人网站，当前技术栈为 Vite + Vue 3 + TypeScript + Vue Router，包含沉浸式首页、Video Bay、Evidence Vault、六个展示详情页，以及 FPV/成交成果媒体集合页。

## 本地开发

```powershell
npm install
npm run dev
```

## 构建与预览

```powershell
npm run build
npm run preview
```

## GitHub Pages 发布

项目已准备 `.github/workflows/deploy-pages.yml`。远端仓库创建并推送 `main` 后，GitHub Actions 会自动构建 `dist` 并部署到 GitHub Pages。

仓库首次连接：

```powershell
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

后续同步：

```powershell
.\scripts\sync-github.ps1 -Message "update site"
```

## 大媒体策略

`public/media/**/*.mp4` 和 `public/videos/**/*.mp4` 默认不进入 Git。当前视频文件有多个超过 GitHub 普通仓库单文件限制，直接提交会导致 push 失败。

发布站点默认不请求未发布的本地大视频，避免 GitHub Pages 产生 404。开发环境会继续使用本地视频；生产环境需要视频时，优先使用 CDN/HLS，并在媒体 manifest 中补充 `streamUrl`，或设置：

```env
VITE_ENABLE_LOCAL_MEDIA=true
VITE_VIDEO_BAY_SRC=https://example.com/video.mp4
```

## PWA 策略

站点已包含 manifest、安装提示、离线壳和手写 Service Worker。Service Worker 只缓存站点壳与轻量资源，显式跳过 `/media/`、`/videos/` 和视频格式文件。
