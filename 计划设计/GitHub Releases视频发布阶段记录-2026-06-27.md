# GitHub Releases 视频发布阶段记录 - 2026-06-27

## 本阶段目标

- 保持 GitHub Pages 发布网站源码。
- 使用 GitHub Releases 托管全部大视频，避免普通 Git 仓库 100MiB 文件限制。
- 让 Video Bay、FPV 飞行视频、成交成果展示在生产环境优先播放 Release URL。

## 已完成

- 新增 `src/data/releaseMedia.ts`，统一生成 GitHub Releases 视频 URL。
- 新增 `src/data/releaseMediaManifest.ts`，记录 29 个视频资产的 size+mtime 版本号。
- 新增 `scripts/generate-release-media-manifest.ps1`，用于重新生成视频版本 manifest。
- 新增 `scripts/upload-release-media.ps1`，用于创建/复用 `media-current` release 并覆盖上传视频资产。
- 新增 `scripts/setup-github-repo.ps1`，用于通过 GitHub CLI 创建并推送公开仓库 `jiangrui-ai-flight-lab`。
- GitHub Actions 增加 `VITE_GITHUB_OWNER`、`VITE_GITHUB_REPOSITORY_NAME`、`VITE_GITHUB_MEDIA_TAG`，Pages 构建时自动解析真实 Release URL。
- Service Worker 升级为 `ai-flight-lab-release-media-v1`，并明确跳过 `/releases/download/` 视频资源。

## 验证结果

- `npm run build` 通过。
- `VITE_GITHUB_OWNER=test-owner` 构建通过，验证生产环境会生成 GitHub Releases 视频 URL。
- Playwright Core + 本机 Chrome QA 通过：
  - Video Bay 视频源指向 Release URL。
  - FPV 详情页、成交成果详情页和 FPV reel 灯箱视频源指向 Release URL。
  - PWA 注册成功。
  - CacheStorage 中没有 release/media/videos 视频条目。
  - console error = 0，page error = 0，400+ failed response = 0。
- QA 记录：`测试截图/github-release-media-2026-06-27/qa-result.json`。

## 当前阻塞

- 本机尚未安装 GitHub CLI：`gh` 不可用。
- 因此远端仓库创建、Release asset 上传和 push 还不能在本机自动执行。

## 后续执行命令

```powershell
gh auth login
.\scripts\setup-github-repo.ps1
.\scripts\upload-release-media.ps1 -Tag media-current
.\scripts\sync-github.ps1 -Message "connect github release media"
```
