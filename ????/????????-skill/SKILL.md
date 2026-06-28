---
name: high-end-motion-website-builder
description: Use when designing, critiquing, testing, or implementing high-end animated websites, creative portfolios, immersive brand pages, cinematic landing pages, scroll-driven UI, WebGL/Canvas scenes, kinetic typography, cursor interactions, and premium visual systems from reference-site research.
---

# High-End Motion Website Builder

这是项目内 skill 雏形，用于沉淀“制作高级动效美感网站”的方法。它目前服务于姜睿个人网站项目，后续每次从参考站、测试结果和真实实现中学到可行经验，都应追加到本文件。项目彻底完工时，本 skill 应整理为稳定版本。

## 适用场景

当任务涉及以下内容时使用：

- 创意个人网站、作品集、品牌站、互动简历、沉浸式首屏。
- 需要摆脱模板感、提升高级感、建立强视觉记忆点。
- 需要设计滚动叙事、鼠标交互、窗口交互、全屏切换、动效系统。
- 需要把 AI、无人机、FPV、程序能力转译成可视化界面。
- 需要分析参考网站但不能照搬品牌素材、文案或专属布局。

## 工作流程

1. 先建立证据

- 用真实浏览器打开参考网站。
- 每个重点参考站至少保存首屏、滚动节点、交互点击、移动端截图。
- 保存 contact sheet、metadata、控制台错误和网络失败。
- 不只看风格，也要点击菜单、项目、按钮、滑块、弹窗和移动端菜单。

2. 提炼世界观

- 用一句话定义页面世界观，例如“飞行实验室”“桌面系统”“字体舞台”“媒体舞台”。
- 先确定主视觉和交互隐喻，再设计卡片、按钮、菜单。
- 所有组件必须服从世界观，避免通用模板味。

3. 设计动效层级

- 首屏入场：建立主视觉和品牌状态。
- 滚动推进：让章节像镜头分段，而不是普通列表。
- 悬停反馈：暴露可交互对象的下一层信息。
- 点击反馈：改变空间层级，例如展开窗口、切换舞台、显示任务面板。
- 状态反馈：筛选、导航、媒体加载、表单、弹窗都要有可理解状态。
- 降级反馈：低性能、媒体失败、reduced motion 下仍能阅读。

4. 实现和测试

- 优先使用 transform、opacity、clip-path、filter 等适合动画的属性。
- 复杂 3D/透明材质可用 Three.js / React Three Fiber / Canvas。
- 滚动叙事可用 GSAP ScrollTrigger 或框架内 scroll progress。
- 每次大改后运行构建和 Playwright 视觉测试。
- 截图覆盖桌面、移动端、首屏、中段、底部、交互状态。

## 从参考站沉淀的模式

### Alche Studio 模式：暗场光学实验室

可学习：

- 单一强主视觉建立高级感。
- 暗色背景需要光、透明材质、空间深度支撑。
- 滚动像镜头推进，每一段都有场景状态变化。

迁移到姜睿网站：

- 透明科技感桨叶作为首屏核心装置。
- 背景使用飞行网格、光轨、坐标、HUD，而不是通用蓝紫光晕。
- 滚动时桨叶状态从待机到巡航再到降落。

风险：

- WebGL/视频过重导致首屏卡顿。
- 自动播放音视频可能被浏览器阻止。
- 暗色信息如果对比不足会影响阅读。

### byChudy 模式：可操作个人桌面

可学习：

- 个人网站可以是可探索系统，而不是简历长页。
- 点击窗口比普通跳转更有记忆。
- 移动端要重新设计为手机式交互。

迁移到姜睿网站：

- 把能力和项目做成飞行任务窗口。
- 点击 AI、FPV、无人机、程序开发时展开不同面板。
- 证书、二维码、照片可作为资源舱，而不是普通图片卡。

风险：

- 窗口太多会像玩具，降低专业感。
- z-index、焦点、关闭逻辑容易混乱。

### TWICE JYPE 模式：媒体舞台

可学习：

- 强媒体素材可以减少文字解释。
- 全屏视频/图片适合制造情绪。
- 导航必须直接，尤其是移动菜单。

迁移到姜睿网站：

- FPV 视频和无人机影像作为“飞行画面”章节。
- 当前素材不足时预留清晰占位和封面，不硬撑空视频。

风险：

- 没有高质量媒体时会显空。
- 视频过大影响性能，需要海报图和懒加载。

### JOSEPH 模式：奢侈品式克制展示

可学习：

- 留白、真实素材、清晰图像能建立信任。
- 资源区应少动效、强可读。
- 弹窗会破坏沉浸感。

迁移到姜睿网站：

- 执照、微信二维码、个人照片、PDF 简历使用清晰资源面板。
- 联系入口不做强打断弹窗。

风险：

- 过度极简会削弱科技感。
- 第三方脚本过多会带来失败响应和体验不稳定。

### Cappen 模式：高压字体剧场

可学习：

- 字体可以成为主视觉和动效对象。
- 项目编号能让作品集更专业。
- 黑白反转比普通渐变更有力量。

迁移到姜睿网站：

- 项目区采用 MISSION 编号。
- 能力标题使用技术字体和参数排布。
- 侧边 CTA 可做成飞行状态条。

风险：

- 大字过多会影响正文信息。
- 高对比动画需要注意视觉疲劳和可读性。

### Lisovskiy 模式：编辑式作品档案

可学习：

- 年份、项目名、外链、角色信息增强真实感。
- 固定菜单适合长页作品集。
- 留白和小字号能制造专业感。

迁移到姜睿网站：

- 用飞行日志/项目档案记录经历。
- 第三方视频地址只作为补充参考，失效后不能作为关键证据。

风险：

- 外部视频可能 401/403，需要封面和失败兜底。
- 过度冷静会削弱个人记忆点。

### Thingy & Thingy 模式：强人格全屏海报

可学习：

- 网站必须有态度，不能只有模块。
- 全屏分段适合展示强视觉项目。
- 项目卡可以像海报，而不是普通卡片。

迁移到姜睿网站：

- FPV/无人机章节可更大胆，表现速度、航线、画面冲击。
- 文案可以更有个人辨识度，但保持专业可信。

风险：

- 过度夸张会影响简历可信度。
- 色彩太多会破坏科技实验室的统一性。

## 姜睿网站推荐结构

1. 起飞首屏

- 透明科技感桨叶。
- 飞行 HUD、坐标、AI/FPV/UAV/Code 身份标签。
- 简短主文案和两个 CTA：查看任务、联系/下载简历。

2. 能力导航

- AI 设计工程师、FPV 飞手、无人机全机型飞手、程序员。
- 每项能力用参数卡表达：工具、经验、输出、证据资源。

3. 任务案例

- 用 MISSION 编号组织项目。
- hover 显示预览，click 展开任务窗口。
- 支持后续补充视频、图片、代码链接。

4. 资源证据

- 执照、微信二维码、个人照片、简历 PDF、后续视频资源。
- 资源位必须真实、清楚、可替换。

5. 联系降落

- 保持简洁。
- 微信二维码和联系方式清晰出现。
- 不做复杂弹窗遮挡内容。

## 技术守则

- 所有动效必须有目的：导航、状态、叙事、反馈。
- 不用动效掩盖内容不足。
- 大图和视频必须有加载态、失败态、占位图。
- 移动端不是缩小桌面，而是重排交互。
- 支持 `prefers-reduced-motion`。
- 首屏资源控制体积，必要时延迟加载非关键动效。
- 截图 QA 至少覆盖首屏、交互打开态、滚动中段、底部、移动端。

## 设计禁区

- 不复制参考站品牌图形、文案、专属素材和案例布局。
- 不堆叠无意义玻璃卡、粒子、蓝紫渐变、旋转装饰。
- 不把证书和联系方式藏在过度动画里。
- 不依赖过期临时链接作为核心内容。
- 不让弹窗遮挡主体验。

## 后续维护

每完成一次网站改版或新增参考研究，更新以下内容：

- 新增参考站或实现案例。
- 已验证可行的动效/组件方案。
- 已发现的性能、兼容性、移动端问题。
- 对姜睿网站下一轮改进的具体迁移方案。

## 2026-06-25 implementation note

The AI Flight Lab upgrade verified these reusable patterns:

- A fixed mission rail can turn a long portfolio into a navigable command surface.
- Capability nodes should be clickable and update a readout, not remain static cards.
- Mission history is stronger as a command window plus timeline than as a plain list.
- A future video-background section should render a designed placeholder until real footage exists; do not request missing video files and create 404 noise.
- Hash-link fallback is required for single-page immersive sites with dynamic height, especially on mobile.
- Browser QA must include desktop hero, interaction state, video section, contact/evidence section, and mobile direct-link behavior.

## 2026-06-25 Vue3 migration note

The React-to-Vue migration verified these additional patterns:

- Preserve the immersive homepage, then add focused route pages for heavyweight moments such as video backgrounds and evidence archives.
- Use Vue Router hash history when local preview and static deployment compatibility are more important than clean server paths.
- Native Three.js works well in Vue when scene creation, resize handling, animation frames, and disposal are owned by component lifecycle hooks.
- A route-level particle field with presets is more maintainable than one-off particle implementations in every page.
- Missing video assets should not be fetched. Render a designed HUD placeholder until real footage is available.
- Mobile navigation must remain operational; convert desktop navigation into horizontally scrollable task pills instead of hiding it.
- QA should explicitly assert zero console warnings, zero runtime page errors, and zero 400+ network responses after visual-heavy migrations.

## 2026-06-25 scroll-energy side particles note

The side-scroll particle upgrade verified this reusable pattern:

- Edge-only particle systems can add premium motion without lowering content readability when they are constrained to side lanes.
- Scroll delta and wheel burst should be smoothed into a velocity value, then decayed each frame; direct wheel-to-position mapping feels harsh.
- Route presets help one global effect match different page moods: flight trail for home, speed lines for video, and amber scan dust for evidence.
- Canvas is preferable to DOM particles for dense edge effects because it avoids layout work and keeps pointer interaction free.
- `pointer-events: none`, low z-index, mobile opacity reduction, and `prefers-reduced-motion` behavior are mandatory for ambient visual layers.
- Visual QA must include content-heavy midsections, not only the hero; otherwise side particles can accidentally reduce form, QR, or certificate readability.

## 2026-06-25 content-aware core particles note

The core-motion particle upgrade verified this reusable pattern:

- Mid-screen ambient motion should not be a full-page particle spray. Treat it as a sparse flight-control core with micro nodes, orbit arcs, short trails, and low-frequency scans.
- Content-aware protection is required when particles live near the reading area. Cache bounding boxes for headings, text, buttons, images, cards, QR codes, and mission panels; update them on route, resize, and scroll instead of every frame.
- Particle tails and links must be tested as line segments, not just endpoints. A line can cross protected content even when both particles sit outside the content box.
- Route presets keep the same component coherent across different moods: teal flight map for home, speed-line scan for video, amber verification dust for evidence.
- Evidence assets need stricter rules than decorative sections. QR codes and certificates should never receive line scans or bright overlays, including hover states.
- Reduced-motion should disable attraction, scroll tails, and scans while preserving a faint static dust layer so the page still feels designed.

## 2026-06-25 asset-vault portal showcase note

The six-page evidence showcase upgrade verified this reusable pattern:

- Static resource cards become more memorable when they behave like portals into focused detail worlds instead of plain links.
- Use one data-driven detail component for maintainability, but vary each slug with distinct visual language, motion layer, metrics, stage layout, and interaction rhythm.
- Portal transitions should use the clicked card geometry as the origin. The user should feel that the page is absorbing the selected object, not performing a generic fade.
- `prefers-reduced-motion` must skip strong portal motion and route directly, while preserving a light page transition.
- Missing covers, videos, PDFs, and project links must stay as designed placeholders. Do not render tags that request nonexistent files.
- Mobile QA must include long localized titles. High-impact typography on desktop can clip Chinese titles on narrow screens if `keep-all` rules are reused unchanged.
- Regression QA for portal showcases should cover card clicks, direct routes, back navigation, mobile direct links, reduced-motion behavior, console errors, page errors, and 400+ network responses.

## 2026-06-26 real-media showcase note

The FPV and deal-results upgrade verified this reusable pattern:

- Browser pages cannot enumerate private local folders. Copy approved public assets into `public/media` and drive the UI from a static manifest.
- Keep request paths ASCII even when original filenames are Chinese; preserve original names in data for display.
- Large video archives need lazy interaction architecture. The detail page should load one hero video, while gallery cards should load the actual video only after the user opens the player.
- Media-heavy showcases need distinct interaction metaphors. FPV works as a memory film roll; outcome/deal media works better as a prism gallery or spotlight wall.
- Autoplay video should be muted by default, `playsinline`, and include a local sound toggle. Do not make one sound toggle affect unrelated players.
- When replacing a portfolio category, update visible copy, route data, resource plan, tests, and legacy redirects together so old labels do not leak through.
- QA for real-media pages must include direct media 200 checks, no 400+ responses, mobile lightbox layout, sound toggle state, random switching, and screenshot evidence.

## 2026-06-27 system adaptation note

- High-end motion sites need a central adaptation profile before adding more effects. Detect runtime shell, device tier, reduced motion, touch input, safe area, network hints, and video autoplay constraints once, then let every page and effect consume that profile.
- Keep desktop motion expressive, but make mobile and WeChat modes intentional rather than broken: lower canvas DPR, particle counts, scan lines, hover response, and Three.js cost through shared budgets.
- Media-heavy portfolios should fail visibly and elegantly. If autoplay is blocked, show a branded tap-to-play gate; do not silently leave a dark or frozen video panel.
- Safe-area support belongs in a dedicated style layer loaded after the main design CSS, so fixed nav, rails, HUDs, lightboxes, and media controls remain correct without rewriting the whole visual system.
- QA for system adaptation must include route smoke, no horizontal overflow, console/page/network health, reduced-motion checks, video playback gates, and real-device validation for iOS Safari and WeChat.

## Pattern: GitHub Pages + 大媒体生产降级

- 对含大量 MP4 的作品站，源码仓库和媒体分发必须解耦：GitHub 保存源码、轻量图像、PDF 和 manifest；大视频走 CDN/对象存储/HLS。
- 开发环境可以默认读取 `public/media` 和 `public/videos`，但生产环境必须通过 `VITE_ENABLE_LOCAL_MEDIA` 或 `streamUrl` 显式开启，否则展示高级占位并避免请求缺失资源。
- Service Worker 只缓存站点壳、JS/CSS、轻量图像和 PDF 元数据；永不缓存 MP4/MOV/WEBM 和 `/media/`、`/videos/`。
- GitHub Pages 项目站点优先使用相对 `base: './'` 与统一 public asset helper，避免 `/repo/` 子路径下资源失效。
## Pattern: GitHub Pages + Releases 大视频展示

- 对个人作品站，大视频不要进入普通 Git 仓库；GitHub Pages 发布源码，GitHub Releases 发布视频资产。
- 生产播放源通过 `VITE_GITHUB_OWNER`、仓库名、release tag 和 asset name 静态生成，开发环境继续使用本地 `public/media`。
- Release URL 必须带版本 query，版本可用文件 size + mtime 生成，避免替换同名资产后浏览器继续用旧缓存。
- Service Worker 必须跳过 `/releases/download/` 和所有视频格式，避免 CacheStorage 爆配额。

## Pattern: 多版本媒体分发与移动端视频降级

- 视频型高级作品站不能让手机和微信默认加载原始大 MP4。每个公开视频应拆成 `poster.webp`、`preview.mp4`、`full.mp4` 三层。
- `poster` 负责首屏、列表卡片、弱网兜底；`preview` 负责默认自动播放；`full` 只在用户主动选择高清完整版本后加载。
- 播放源解析应集中在一个 adaptive media 层：生产优先 CDN，缺失时回退 GitHub Releases，本地开发再使用 `public` 源。
- 移动端、微信、弱网、`saveData` 不允许自动请求 full。preview 缺失时显示设计占位，不要“为了能播”直接拉 100MB+ 原片。
- Reel/图库类页面的卡片首屏只加载 poster，点击后才创建或赋值 video source；灯箱关闭和路由离开时释放移动端 video src。
- CDN 媒体使用 hash 文件名配长期缓存；Release 兜底使用稳定 asset 名 + `?v=<hash>` 刷新缓存。
- QA 必须断言请求行为：移动首屏不请求 full、列表首屏不请求 MP4、高清按钮点击后才请求 full，而不仅是截图看起来正常。
## Pattern: Vue 药丸导航

- 适用场景：沉浸式作品集、技术展示站、需要高级但轻量导航反馈的页面。
- 实现原则：不要直接把 React Bits 的 React 组件塞进 Vue 项目；抽取交互原则，用 Vue Router + GSAP 原生实现。
- 关键体验：active 胶囊明确当前页面；hover 圆形扩散提供液态反馈；双层文字上下切换增加精致感。
- 响应式：桌面单行药丸组，平板横向滚动，小屏使用当前页胶囊 + 弹层菜单。
- 降级：`prefers-reduced-motion`、微信、低性能设备只保留 active 和 hover 色彩，不执行强 GSAP 动效。

## Pattern: PDF 证书转图书本展厅

- 适用场景：证书、奖项、录用通知、荣誉材料等只需要公开展示、不希望提供源 PDF 下载的内容。
- 资源管线：源 PDF 留在私有资源包；构建前用 Poppler 渲染 PNG/WebP；页面只读取图片 manifest。
- 数据策略：一份 PDF 对应一个展示卡；多页 PDF 在打开态内部翻页，不拆成多个入口。
- 视觉策略：用书脊、纸张底板、压印、细光边和轻微翻页替代重 HUD，降低“AI 模块感”。
- 交互策略：卡片 hover 轻微开合；点击后书本打开；支持 Escape 关闭和方向键翻页。
- 风险处理：中文路径用 ASCII 临时工作目录或安全构造；公开页面不暴露 PDF href/download；图片路径必须相对 public 根目录。
## Pattern: Hangar Dome 图片展厅

- 适用场景：无人机图库、作品摄影、空间装置、产品图集等需要“高端浏览感 + 大量图片管理”的展示页。
- 技术选择：在 Vue 项目中不要直接引入 React Bits 的 React DomeGallery；抽取“球面环绕、拖拽、惯性、点击放大”的交互原则，用 Vue + CSS 3D + Pointer Events + GSAP 实现。
- 资源管线：源图片保留在私有资源目录；公开页面只使用生成后的 `thumb.webp`、`display.webp`、`full.webp`，并由 TypeScript manifest 驱动。
- 文件策略：公开路径使用 ASCII 稳定命名，例如 `uav-img-001/full.webp`；原始中文或设备文件名只保存在 manifest 中用于展示。
- 动效策略：桌面端可以使用 3D dome 做记忆点，但必须保留底部网格或列表作为高效率浏览入口，避免炫技替代可用性。
- 降级策略：移动端、微信、触摸设备、低性能设备和 `prefers-reduced-motion` 不启用重 3D 与惯性，改用横向精选轨道 + 瀑布流。
- 灯箱策略：点击图片打开沉浸灯箱，支持上一张、下一张、Escape 关闭，并预加载当前图片前后邻近资源。
- QA 策略：必须断言页面不请求源 JPG/PNG/HEIC 和任何被排除的视频；图片变体 `naturalWidth > 0`；桌面拖拽、移动降级、灯箱键盘、网络 400+ 和横向溢出都要覆盖。

## Pattern: 单链条可移开证件挂件

- 适用场景：首页头像、通行证、现场证据卡、作品封面等需要“真实物件感 + 可互动”的主视觉组件。
- 视觉策略：比双股挂绳更克制；使用棚顶细轨、单根金属链、小挂钩和磨砂证件套，避免厚重挂绳带来的突兀感。
- 运动策略：页面进入时从上方下坠，落点有过冲和弹性回摆；静止后保留极轻微呼吸，不让它持续抢正文。
- 拖拽策略：桌面端允许大幅移开，方便用户查看后方内容；链条、挂钩和卡片必须同步跟随，避免视觉断裂；松手后弹性归位。
- 稳定策略：动画只改 `transform`、`opacity` 和 CSS 变量；不引入物理引擎、glb 模型或额外第三方依赖。
- 降级策略：触摸端、微信、低性能设备和 `prefers-reduced-motion` 禁用自由拖拽和强下坠，只保留静态质感和基础点击态。
- QA 策略：断言旧挂绳结构已移除、链条/挂钩存在、拖拽位移足够、挂钩与卡片保持连接、松手回原点、移动端无横向溢出、console 和 400+ 为 0。

## Pattern: 黑色织带证件卡与背后科技桨叶

- 适用场景：首页人物照片、FPV 通行证、无人机现场证据卡等需要“真实挂件 + 主题机械感”的主视觉。
- 视觉策略：优先用黑色织带、金属圆环、短连接绳和卡片固定孔建立真实物件关系；织带可加暗纹、缝线和自定义小图标，但不要复制参考站品牌图形。
- 主题强化：在证件卡背后放置半透明五寸桨叶，使用青绿色边线、内部骨线、虚线电机环和中心 hub，形成前景照片、背后桨叶、页面大场景三层深度。
- 层级策略：桨叶只能从卡片边缘露出，不遮挡照片主体、身份条和 CTA；透明度和旋转速度要克制，避免和正文抢注意力。
- 交互策略：桌面端允许拖拽移开卡片，织带和固定点跟随倾斜；桨叶跟随卡片空间运动并可慢速旋转。松手后弹性归位。
- 降级策略：移动端、微信、低性能和 `prefers-reduced-motion` 下关闭自由拖拽和持续旋转，只保留静态织带、卡片和桨叶质感。
- QA 策略：断言织带/圆环/连接绳/固定点存在，旧链条 DOM 不存在，三叶桨存在，拖拽和回弹变量正常，移动端无横向溢出，console 和 400+ 为 0。
## Pattern: viewport-tethered lanyard card

- Use this when a hero portrait, pass card, or physical object should feel suspended from the top of the page instead of merely decorated inside a card.
- The strap/rope length should be computed from viewport geometry, not hard-coded inside the component. On mount, resize, and scroll, update CSS variables such as `--strap-top-offset` and `--strap-length` from the card root `getBoundingClientRect()`.
- If a long tether must extend outside its section, audit parent `overflow`. Prefer letting the section expose vertical overflow while relying on a global `overflow-x: clip` guard for horizontal safety.
- For desktop narrow windows, do not rely only on a broad runtime shell such as `desktop` vs `mobile-browser`. Use `(hover: hover) and (pointer: fine)` to decide whether drag interaction is safe.
- Keep touch/mobile drag disabled by default when the same gesture conflicts with document scroll. If mobile movement is required later, design an explicit move-away or collapse affordance instead of free dragging.
- QA should assert top-tether geometry, no horizontal overflow, fine-pointer drag variables changing during drag, elastic return to zero after release, and a static reduced-motion fallback.
