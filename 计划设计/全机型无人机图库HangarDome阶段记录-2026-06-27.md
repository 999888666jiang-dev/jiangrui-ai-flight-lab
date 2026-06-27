# 验收结果补充

- `npm run build`：通过。
- Playwright 专项 QA：通过，15 项检查、6 张截图。
- 截图与 QA JSON：`测试截图/uav-hangar-dome-2026-06-27/`。
- 浏览器质量：console error = 0，page error = 0，400+ failed response = 0。
- 禁用资源检查：未请求源 JPG/PNG/HEIC，未请求图库 MP4。
- 资源检查：manifest 45 条；`public/uav-gallery/` 仅包含 135 个 WebP，约 24.34MB。

# 全机型无人机图库 Hangar Dome 阶段记录

日期：2026-06-27

## 实施范围

- 仅改造 `uav-platform-gallery` 展示页。
- 只接入 `个人信息资源包/全机型无人机图库/` 中的图片。
- 源目录中的视频文件不接入、不生成 manifest、不在页面请求。
- 其他五个展示页不改结构、不改资源逻辑。

## 实际资源处理

- 扫描到图片：45 张。
- 扫描到视频：1 个 MP4，已忽略。
- 输出目录：`public/uav-gallery/`。
- 每张图片生成三种 WebP 变体：
  - `thumb.webp`：瀑布流缩略图。
  - `display.webp`：穹顶、精选轨道和入口封面。
  - `full.webp`：灯箱高清查看。
- 数据文件：`src/data/uavGalleryManifest.ts`。
- 覆盖配置：`src/data/uavGalleryOverrides.ts`，用于后续手动改标题、分类和 featured 状态。

## 前端实现

- 新增 `UavHangarDome.vue`：
  - 桌面端使用 CSS 3D dome。
  - Pointer Events 负责拖拽。
  - GSAP 负责惯性和聚焦吸附。
  - 当前聚焦图片显示在右下角 focus panel。
  - 所有图片同时提供底部网格，保证浏览效率。
- 新增 `UavGalleryLightbox.vue`：
  - 点击图片打开高清灯箱。
  - 支持关闭、上一张、下一张。
  - 支持 Escape、ArrowLeft、ArrowRight。
  - 预加载当前、前一张、后一张 full 图。
- `ShowcaseDetailPage.vue`：
  - 对 `uav-platform-gallery` 使用专属 `UavHangarDome` 分支。
  - 不再渲染旧 `Hangar Matrix` 占位。
- `EvidenceVaultPage.vue`：
  - `全机型无人机图库` 入口卡片使用真实 WebP 图片作为封面。
  - 保留原吸入式进入动效。

## 适配与降级

- 桌面高性能环境启用 dome。
- 小于 980px、触摸设备、微信、低性能设备和 reduced-motion 环境不启用 3D dome。
- 降级视图为横向精选轨道 + 瀑布流。
- 移动端灯箱使用 `100dvh` 安全高度，避免导航和浏览器工具栏造成裁切。

## 测试用例

1. 构建测试：运行 `npm run build`，要求 Vue/TS/Vite 无错误。
2. 资源测试：图库脚本生成 45 条 manifest 记录，且每条包含 `thumbSrc`、`displaySrc`、`fullSrc`。
3. 视频排除测试：源目录 MP4 不出现在 manifest、页面 DOM、网络请求中。
4. 证据库入口测试：打开 `/#/evidence-vault`，确认 `全机型无人机图库` 卡片显示真实图片封面。
5. 桌面穹顶测试：打开 `/#/evidence-vault/uav-platform-gallery`，确认 dome 出现、可拖拽、可聚焦、可点击打开灯箱。
6. 灯箱测试：点击图片打开灯箱，左右键可切换，Escape 可关闭，图片 `naturalWidth > 0`。
7. 移动端测试：390x844 下显示轻量轨道和瀑布流，无横向溢出，灯箱可打开和关闭。
8. 网络质量测试：console error = 0，page error = 0，400+ failed response = 0。

## 风险与解决方案

- 图片体积过大：公开页只加载 WebP 变体；源图不进入页面。
- Dome 在移动端卡顿：触摸端直接禁用 dome，使用轻量图片流。
- 中文文件名请求失败：公开路径使用 `uav-img-xxx` ASCII 文件夹；原文件名只保存在 manifest 中展示。
- 后续素材增加：只运行 `scripts/prepare-uav-gallery.ps1` 并重新测试，不需要改组件结构。
