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
.\scripts\setup-github-repo.ps1
```

上传或覆盖 GitHub Releases 视频：

```powershell
.\scripts\upload-release-media.ps1 -Tag media-current
```

后续同步源码：

```powershell
.\scripts\sync-github.ps1 -Message "update site"
```

## 大媒体策略

`public/media/**/*.mp4` 和 `public/videos/**/*.mp4` 默认不进入 Git。当前视频文件有多个超过 GitHub 普通仓库单文件限制，直接提交会导致 push 失败。

发布站点通过 GitHub Releases 显示真实视频。`scripts/generate-release-media-manifest.ps1` 会生成每个 release asset 的版本号，GitHub Actions 会自动注入 `VITE_GITHUB_OWNER` 并把播放地址解析为：

```text
https://github.com/<owner>/jiangrui-ai-flight-lab/releases/download/media-current/<assetName>?v=<fileVersion>
```

开发环境会继续优先使用本地视频；生产环境如果 Release asset 尚未上传，会显示设计占位，不请求缺失 MP4。

## PWA 策略

站点已包含 manifest、安装提示、离线壳和手写 Service Worker。Service Worker 只缓存站点壳与轻量资源，显式跳过 `/media/`、`/videos/` 和视频格式文件。

Service Worker 同样跳过 GitHub Releases `/releases/download/` 视频 URL，避免 MP4 进入 CacheStorage。
