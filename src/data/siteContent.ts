import { publicAsset } from '../utils/publicAsset';

export type LocalizedText = {
  zh: string;
  en: string;
};

export type EvidenceTheme = 'velocity' | 'neural' | 'hangar' | 'outcome' | 'blackbox' | 'verify';
export type EvidenceDetailLayout = 'cinema' | 'atelier' | 'hangar' | 'outcome' | 'recorder' | 'vault';

export type EvidenceItem = {
  slug: string;
  index: string;
  title: LocalizedText;
  description: LocalizedText;
  status: LocalizedText;
  theme: EvidenceTheme;
  detailLayout: EvidenceDetailLayout;
  world: LocalizedText;
  detailHeadline: LocalizedText;
  detailIntro: LocalizedText;
  metrics: Array<{
    label: LocalizedText;
    value: LocalizedText;
  }>;
  assetSlots: Array<{
    label: LocalizedText;
    status: LocalizedText;
    hint: LocalizedText;
  }>;
};

export const resumeProfile = {
  targetRole: {
    zh: 'Vibe Coding / Vue3 前端开发师',
    en: 'Vibe Coding / Vue3 Front-End Developer',
  },
  city: { zh: '深圳', en: 'Shenzhen' },
  email: '3164175833@qq.com',
  resumePdf: publicAsset('documents/jiangrui-vibe-coding-front-end-resume.pdf'),
  resumeDownloadName: 'jiangrui-vibe-coding-front-end-resume.pdf',
  privacyNote: {
    zh: '公开网页展示邮箱与微信二维码，更多私人信息保留在简历 PDF 内。',
    en: 'The public site shows email and WeChat. More private details stay inside the resume PDF.',
  },
};

export const pageCopy = {
  home: {
    heroStatus: [
      { zh: 'VIBE CODING FRONT-END', en: 'VIBE CODING FRONT-END' },
      { zh: 'VUE3 / TS / GSAP / THREE', en: 'VUE3 / TS / GSAP / THREE' },
      { zh: 'UAV-FPV FIELD EVIDENCE', en: 'UAV-FPV FIELD EVIDENCE' },
    ],
    sectorMap: [
      { zh: 'VUE3 前端', en: 'VUE3 FRONT-END' },
      { zh: '产品测试', en: 'PRODUCT TESTING' },
      { zh: '无人机现场', en: 'UAV FIELD' },
      { zh: '创业转化', en: 'VENTURE OPS' },
    ],
    portraitCaption: {
      title: { zh: 'FPV', en: 'FPV' },
      body: { zh: '现场操控 / 画面判断 / 速度感', en: 'Field control / image judgement / speed sense' },
    },
    about: {
      title: { zh: '把简历变成可交互的能力证明', en: 'A Resume Turned Into Interactive Proof' },
      body: {
        zh: '这个网站不再只陈列经历，而是用 Vue3、动效、媒体和真实资料，把前端实现、产品测试、无人机场景与创业转化串成一套可验证的个人作品。',
        en: 'This site does more than list experience: Vue3, motion, media, and real evidence connect front-end implementation, product testing, UAV field work, and venture outcomes into one verifiable portfolio.',
      },
    },
    skills: {
      title: { zh: '四条证据链，把想法落成作品', en: 'Four Proof Tracks, Built Into Work' },
      body: {
        zh: '能力不按关键词堆叠，而按“开发、测试、现场、转化”组织。点击节点查看当前能力读数。',
        en: 'The capability system is organized by building, testing, field execution, and conversion rather than keyword stacking. Click a node to inspect the active readout.',
      },
      readout: {
        zh: '当前节点对应一条简历事实链。后续可继续挂接真实项目、视频、日志、证书和代码链接，让能力从一句话变成可查看的证据。',
        en: 'Each node maps to a resume-backed evidence track. Projects, videos, logs, certificates, and code links can keep turning each claim into viewable proof.',
      },
    },
    timeline: {
      title: { zh: '从前端作品，走向真实场景', en: 'From Front-End Work to Real-World Systems' },
      body: {
        zh: '时间线只保留可追溯事实：个人网站开发、产品测试实习、极飞无人机实验、软件工程学习、竞赛与组织经历。',
        en: 'The timeline keeps traceable facts only: portfolio development, product testing, XAG UAV experimentation, software engineering study, contests, and leadership.',
      },
    },
    contact: {
      title: { zh: '联系与资料', en: 'Contact & Materials' },
      body: {
        zh: '当前公开展示邮箱、微信二维码和新版简历 PDF。更完整的私人信息放在简历内，正式沟通时再展开。',
        en: 'The public page shows email, WeChat, and the updated resume PDF. More private details stay inside the resume for formal conversations.',
      },
    },
  },
  evidenceVault: {
    title: { zh: '资料库：作品、证书与真实能力档案', en: 'Resource Library for Work, Credentials, and Field Proof' },
    intro: {
      zh: '这里集中放置简历、证书、视频、图库、成交成果和后续作品。每个入口都对应简历中的一条能力线，不靠空泛形容词堆砌。',
      en: 'This library holds the resume, credentials, videos, galleries, deal outcomes, and future work. Each entry maps to a resume-backed capability track, not generic adjectives.',
    },
  },
  videoBay: {
    title: { zh: '视频舱：真实素材驱动的前端动效场景', en: 'Video Bay for Real-Media Front-End Motion' },
    intro: {
      zh: '展示.mp4 已接入视频舱，作为全屏真实背景自动播放。它既展示媒体处理能力，也展示移动端视频策略、HUD 叠层和前端动效控制。',
      en: 'The showcase video is connected as the full-screen background. It demonstrates media handling, mobile video policy, HUD layering, and front-end motion control.',
    },
    qualityPreview: {
      zh: '生产环境优先使用 CDN 或轻量预览源；高清完整版本只在手动点击后加载。',
      en: 'Production prefers CDN or lightweight preview sources. The full version loads only after a manual unlock.',
    },
    qualityFull: {
      zh: '当前播放高清完整版本。移动端离开页面或进入后台时仍会释放资源。',
      en: 'Full quality is active. Mobile devices still release media when hidden or leaving the route.',
    },
    briefTitle: { zh: '视频设计原则', en: 'Video design rule' },
    briefBody: {
      zh: '素材以稳定、速度感、现场感和少干扰为优先，方便叠加 HUD、粒子和文字信息，同时保持移动端可播放。',
      en: 'Footage prioritizes stability, speed, field presence, and low visual clutter so HUD, particles, and text can layer cleanly while staying mobile-playable.',
    },
  },
  footer: {
    zh: '姜睿个人网站。以 Vibe Coding 前端开发为主线，用真实资源、动效系统和统一适配层展示作品、证书、视频与现场能力。',
    en: 'Jiang Rui portfolio. A Vibe Coding front-end narrative backed by real assets, motion systems, and an adaptive layer across work, certificates, videos, and field capability.',
  },
};

export const heroContent = {
  name: { zh: '姜睿', en: 'Jiang Rui' },
  title: {
    zh: 'Vibe Coding 前端开发者 / Vue3 动效网站制作者 / UAV-FPV 跨域执行者',
    en: 'Vibe Coding Front-End Developer / Vue3 Motion Website Builder / UAV-FPV Field Operator',
  },
  summary: {
    zh: '我把需求分析、产品测试、无人机场景、智能体工作流和前端实现串成可交互作品：能写代码，也能理解真实场景里的问题。',
    en: 'I turn requirement analysis, product testing, UAV field context, agent workflows, and front-end implementation into interactive work that stays grounded in real problems.',
  },
  traits: [
    { zh: 'Vue3 / TypeScript / Vite', en: 'Vue3 / TypeScript / Vite' },
    { zh: 'GSAP / Three.js 动效实现', en: 'GSAP / Three.js motion implementation' },
    { zh: 'CAAC 多旋翼教员', en: 'CAAC Multi-Rotor Instructor' },
    { zh: '测试开发 / Python 数据采集', en: 'Test development / Python data collection' },
  ],
  telemetry: [
    { label: 'ALT', value: '120M' },
    { label: 'SPD', value: '23.6M/S' },
    { label: 'HDG', value: '268°' },
  ],
};

export const missionCopy = [
  {
    zh: '我正在求职 Vibe Coding / Vue3 前端开发方向。这个网站本身就是核心作品：用 Vite、Vue Router、TypeScript、GSAP、Three.js 和响应式适配构建，并把真实素材持续接入。',
    en: 'I am targeting Vibe Coding and Vue3 front-end roles. This site is the core work sample: built with Vite, Vue Router, TypeScript, GSAP, Three.js, responsive adaptation, and continuously connected real assets.',
  },
  {
    zh: '我的差异化不只在前端：酣睡博士测试开发实习让我接触竞品分析、Python 采集 200+ 用户反馈、需求文档和原型测试；极飞无人机实验经历让我熟悉质量测试、飞行日志分析、固件烧录和临时测试方案。',
    en: 'The differentiator is wider than front-end work: Hanshui Doctor gave me competitor analysis, Python collection of 200+ feedback records, requirement docs, and prototype testing; XAG UAV experimentation gave me quality testing, flight-log analysis, firmware flashing, and temporary test-plan design.',
  },
];

export const facts = [
  { label: { zh: '当前方向', en: 'Direction' }, value: resumeProfile.targetRole },
  { label: { zh: '教育背景', en: 'Education' }, value: { zh: '广州新华学院 软件工程 本科 2023-2027', en: 'Software Engineering, Guangzhou Xinhua University, 2023-2027' } },
  { label: { zh: '求职城市', en: 'Target city' }, value: resumeProfile.city },
  { label: { zh: '公开联系', en: 'Public contact' }, value: { zh: '邮箱 + 微信二维码', en: 'Email + WeChat QR' } },
];

export const systemNodes = [
  { label: { zh: 'Vibe Coding 前端开发', en: 'Vibe Coding Front-End' }, value: 'Vue3 / TS / Vite' },
  { label: { zh: '产品研究与测试开发', en: 'Product Research & Testing' }, value: 'Python / PRD / Prototype' },
  { label: { zh: '无人机与 FPV 场景能力', en: 'UAV & FPV Field Capability' }, value: 'CAAC / Logs / Firmware' },
  { label: { zh: '创新创业与成交转化', en: 'Venture & Conversion Ops' }, value: 'Contest / Live / Market' },
];

export const skills = [
  {
    name: { zh: 'Vibe Coding 前端开发', en: 'Vibe Coding Front-End Development' },
    description: {
      zh: '以 Vue3、TypeScript、Vite、Vue Router、Tailwind、GSAP 和 Three.js 构建个人网站，兼顾动效、媒体、路由和多端适配。',
      en: 'Builds this portfolio with Vue3, TypeScript, Vite, Vue Router, Tailwind, GSAP, and Three.js across motion, media, routing, and responsive adaptation.',
    },
    level: 90,
  },
  {
    name: { zh: '产品研究与测试开发', en: 'Product Research & Test Development' },
    description: {
      zh: '完成 5 款竞品功能分析，Python 收集 200+ 用户反馈，形成需求文档并参与原型测试与关键性能问题定位。',
      en: 'Produced 5 competitor analyses, collected 200+ feedback records with Python, shaped requirement docs, and joined prototype testing and key performance issue diagnosis.',
    },
    level: 88,
  },
  {
    name: { zh: '无人机与 FPV 场景能力', en: 'UAV & FPV Field Capability' },
    description: {
      zh: '持有 CAAC 多旋翼教员、中型超视距多旋翼机长、中型超视距直升机机长资质，具备飞行日志分析、固件烧录、维修和临时测试方案能力。',
      en: 'Holds CAAC multi-rotor instructor, medium BVLOS multi-rotor PIC, and medium BVLOS helicopter PIC credentials, with flight-log analysis, firmware flashing, repair, and temporary test-plan experience.',
    },
    level: 87,
  },
  {
    name: { zh: '创新创业与成交转化', en: 'Venture, Market & Conversion' },
    description: {
      zh: '参与挑战杯省级银奖、她轻创电商赛省级银奖和创新创业项目，覆盖直播选品、脚本、数据优化、合作洽谈与活动组织。',
      en: 'Contributed to Challenge Cup and She-Light Entrepreneurship provincial silver awards plus innovation projects, covering live-stream selection, scripts, data optimization, partnership talks, and event organization.',
    },
    level: 85,
  },
];

export const certificate = {
  title: { zh: 'CAAC 无人机资质与证书书册', en: 'CAAC UAV Credentials and Certificate Book' },
  meta: {
    zh: '多旋翼教员 / 中型超视距多旋翼机长 / 中型超视距直升机机长',
    en: 'Multi-rotor instructor / Medium BVLOS multi-rotor PIC / Medium BVLOS helicopter PIC',
  },
  note: {
    zh: '公开页面展示证书图片与脱敏预览，正式核验时可提供原件。',
    en: 'The public page shows certificate images and redacted previews. Originals can be provided for formal verification.',
  },
  image: publicAsset('images/caac-license-preview.png'),
};

export const experienceItems = [
  {
    period: '2026.05 - 2026.07',
    title: { zh: 'Vibe Coding 个人网站', en: 'Vibe Coding Personal Website' },
    role: { zh: '制作者 / Vue3 前端开发', en: 'Creator / Vue3 Front-End Developer' },
    description: {
      zh: '主导以 Vue3、Vite、TypeScript 为核心的个人网站开发，接入 Vue Router、Tailwind、GSAP、Three.js、媒体资源和全尺寸适配，形成技术展示、作品集与动态效果一体化页面。',
      en: 'Led a Vue3, Vite, and TypeScript portfolio build with Vue Router, Tailwind, GSAP, Three.js, media assets, and full-size responsive adaptation into one technical showcase.',
    },
    tags: ['Vue3', 'TypeScript', 'Vite', 'GSAP', 'Three.js'],
  },
  {
    period: '2026.06 - 至今',
    title: { zh: '广州极飞科技股份有限公司', en: 'XAG Guangzhou Technology Co., Ltd.' },
    role: { zh: '无人机实验员', en: 'UAV Experimentation Intern' },
    description: {
      zh: '参与无人机、智能农用无人车、智能灌溉相关部件质量测试，分析飞行日志判断飞机状态或炸机原因，负责固件更新烧录、维修和临时测试方案设计。',
      en: 'Tests UAV, smart agricultural vehicle, and irrigation components, analyzes flight logs for aircraft state or crash causes, handles firmware flashing, repair, and temporary test-plan design.',
    },
    tags: ['XAG', 'UAV Testing', 'Flight Logs', 'Firmware'],
  },
  {
    period: '2024.07 - 2024.09',
    title: { zh: '酣睡博士（深圳）科技有限公司', en: 'Hanshui Doctor Shenzhen Technology' },
    role: { zh: '测试开发工程师实习', en: 'Test Development Engineer Intern' },
    description: {
      zh: '参与智能止鼾新产品设计流程，完成 5 款竞品分析，Python 收集 200+ 份用户反馈并形成需求文档，参与原型机测试并定位 2 个关键性能问题。',
      en: 'Joined the smart anti-snoring product design flow, completed 5 competitor analyses, collected 200+ feedback records with Python, shaped requirement docs, and diagnosed 2 key prototype issues.',
    },
    tags: ['Testing', 'Python', 'Requirement Docs', 'Prototype'],
  },
  {
    period: '2023.11 - 2025.01',
    title: { zh: '创新创业与竞赛项目', en: 'Innovation and Entrepreneurship Projects' },
    role: { zh: '团队核心成员 / 负责人 / 项目设计人', en: 'Core member / lead / project designer' },
    description: {
      zh: '参与挑战杯、省级“她轻创”电商赛、东宝杯和创新大赛，负责项目设计、商业可行性评估、直播选品与脚本、数据优化、资源协调和合作洽谈。',
      en: 'Worked across Challenge Cup, She-Light e-commerce, Dongbao Cup, and innovation contests, covering project design, business feasibility, live-stream selection and scripts, data optimization, coordination, and partnership talks.',
    },
    tags: ['Challenge Cup', 'E-commerce', 'Market Analysis', 'Leadership'],
  },
  {
    period: '2023 - 2027',
    title: { zh: '广州新华学院 软件工程本科', en: 'Software Engineering Undergraduate' },
    role: { zh: '专业班长 / 创业协会会长 / 创赛项目设计人', en: 'Class lead / entrepreneurship association lead / competition designer' },
    description: {
      zh: '担任专业班长、创业协会会长和创业团队队长，组织教学事务、创业讲座与项目推进，持续训练沟通、组织、项目管理和团队协作能力。',
      en: 'Serves as class lead, entrepreneurship association president, and venture team lead, coordinating academic affairs, startup events, project delivery, communication, organization, and teamwork.',
    },
    tags: ['Software Engineering', 'Leadership', 'Competition'],
  },
];

export const evidenceItems: EvidenceItem[] = [
  {
    slug: 'fpv-flight-video',
    index: '01',
    title: { zh: 'FPV 飞行视频', en: 'FPV Flight Video' },
    description: {
      zh: '以第一视角视频展示画面判断、速度感和现场操控经验，是前端媒体播放与无人机场景能力的共同证据。',
      en: 'First-person footage showing image judgement, speed sense, and field control, supporting both media playback work and UAV field capability.',
    },
    status: { zh: '已接入本地视频', en: 'Local videos connected' },
    theme: 'velocity',
    detailLayout: 'cinema',
    world: { zh: 'Velocity Cinema', en: 'Velocity Cinema' },
    detailHeadline: {
      zh: '把速度、姿态和画面判断做成可点击、可播放、可复盘的视频舱。',
      en: 'A playable replay bay for speed, attitude, and image judgement.',
    },
    detailIntro: {
      zh: '这里接入资源包中的 FPV 飞行视频文件夹。主舞台自动播放文件夹内素材，完整素材进入胶卷式集合页查看。',
      en: 'This bay connects the FPV folder footage. The hero stage auto-plays folder clips, and the full archive opens as a film-roll reel.',
    },
    metrics: [
      { label: { zh: '素材状态', en: 'Asset status' }, value: { zh: '11 条 FPV 视频', en: '11 FPV clips' } },
      { label: { zh: '播放策略', en: 'Playback' }, value: { zh: '静音自动 / 可开声', en: 'Muted auto / sound toggle' } },
      { label: { zh: '展示焦点', en: 'Focus' }, value: { zh: '速度 / 姿态 / 判断', en: 'Speed / attitude / judgement' } },
    ],
    assetSlots: [
      {
        label: { zh: '穿越机第一视角', en: 'FPV first-person view' },
        status: { zh: '已接入视频', en: 'Videos connected' },
        hint: { zh: '主舞台默认播放 FPV 文件夹素材，随机切片可切换到同组其他片段。', en: 'The hero stage plays FPV folder clips; random slice switches to another clip in the same group.' },
      },
      {
        label: { zh: '现场操控记录', en: 'Field operation record' },
        status: { zh: '已接入素材', en: 'Assets connected' },
        hint: { zh: '查看更多页以胶卷方式呈现所有 FPV 片段，点击后进入沉浸播放器。', en: 'The reel page presents all FPV clips as film cards with an immersive player.' },
      },
      {
        label: { zh: '复盘备注', en: 'Review notes' },
        status: { zh: '待补充复盘', en: 'Review notes pending' },
        hint: { zh: '后续补充速度、姿态、风险点和操作判断，让视频不只是素材，而是训练记录。', en: 'Future notes will add speed, attitude, risk points, and control decisions so clips become training evidence.' },
      },
    ],
  },
  {
    slug: 'ai-design-works',
    index: '02',
    title: { zh: 'AI 设计作品', en: 'AI Design Works' },
    description: {
      zh: '用于沉淀智能体工作流、AI 辅助设计、交互原型和前端落地过程，重点展示从想法到界面的转换能力。',
      en: 'For agent workflows, AI-assisted design, interaction prototypes, and front-end delivery, focused on turning ideas into interfaces.',
    },
    status: { zh: '待补充作品', en: 'Works pending' },
    theme: 'neural',
    detailLayout: 'atelier',
    world: { zh: 'Neural Atelier', en: 'Neural Atelier' },
    detailHeadline: {
      zh: '把智能体工作流和 AI 设计思路做成可解释、可演示、可继续迭代的设计工坊。',
      en: 'An atelier for explainable, demo-ready, and extensible agent workflows and AI design thinking.',
    },
    detailIntro: {
      zh: '后续 AI 原型、智能体流程、交互稿和视觉方案会集中在这里，按“输入、推理、界面、输出”展示过程。',
      en: 'Future AI prototypes, agent flows, interaction drafts, and visual systems will be organized by input, reasoning, interface, and output.',
    },
    metrics: [
      { label: { zh: '接入类型', en: 'Asset types' }, value: { zh: '图片 / 短视频 / 链接', en: 'Images / clips / links' } },
      { label: { zh: '展示结构', en: 'Structure' }, value: { zh: '输入到输出', en: 'Input to output' } },
      { label: { zh: '资料原则', en: 'Rule' }, value: { zh: '只放真实作品', en: 'Real work only' } },
    ],
    assetSlots: [
      {
        label: { zh: 'AI 原型画面', en: 'AI prototype screen' },
        status: { zh: '待补充作品', en: 'Work pending' },
        hint: { zh: '适合放智能体、原型、流程节点或最终界面。', en: 'Use for agent screens, prototypes, flow nodes, or final UI.' },
      },
      {
        label: { zh: '工作流拆解', en: 'Workflow breakdown' },
        status: { zh: '待补充流程', en: 'Flow pending' },
        hint: { zh: '展示任务输入、工具调用、人工判断和输出结果。', en: 'Show inputs, tool calls, human decisions, and outputs.' },
      },
      {
        label: { zh: '视觉方案对比', en: 'Visual variant review' },
        status: { zh: '待补充图片', en: 'Images pending' },
        hint: { zh: '可接多版方案、风格板和迭代说明。', en: 'Can hold variants, moodboards, and iteration notes.' },
      },
    ],
  },
  {
    slug: 'uav-platform-gallery',
    index: '03',
    title: { zh: '全机型无人机图库', en: 'UAV Platform Gallery' },
    description: {
      zh: '归档多旋翼、直升机、地面站、穿越机和现场设备图片，证明我对无人机平台与现场环境的真实接触。',
      en: 'Archives multi-rotor, helicopter, ground station, FPV, and field equipment images as proof of real platform and field exposure.',
    },
    status: { zh: '已接入图库', en: 'Gallery connected' },
    theme: 'hangar',
    detailLayout: 'hangar',
    world: { zh: 'Hangar Matrix', en: 'Hangar Matrix' },
    detailHeadline: {
      zh: '把不同平台、地面站和现场装备整理成一座可拖拽的数字机库。',
      en: 'A draggable digital hangar for platforms, ground stations, and field equipment.',
    },
    detailIntro: {
      zh: '图库已接入资源包图片，页面以机库穹顶和移动端瀑布流展示。后续可继续按平台、场景和设备用途精细分类。',
      en: 'The gallery now uses connected resource-package images through a hangar dome and mobile waterfall view. Future updates can refine platform, scenario, and equipment categories.',
    },
    metrics: [
      { label: { zh: '平台分类', en: 'Platforms' }, value: { zh: '多旋翼 / 直升机 / FPV', en: 'Multi-rotor / helicopter / FPV' } },
      { label: { zh: '资料类型', en: 'Media' }, value: { zh: '图片变体已生成', en: 'Image variants generated' } },
      { label: { zh: '展示方式', en: 'Display' }, value: { zh: '机库穹顶', en: 'Hangar dome' } },
    ],
    assetSlots: [
      {
        label: { zh: '多旋翼平台', en: 'Multi-rotor bay' },
        status: { zh: '图片已接入', en: 'Images connected' },
        hint: { zh: '展示机体、任务载荷、地面检查和现场环境，作为无人机实验经历的视觉证据。', en: 'Shows aircraft, payloads, checks, and field context as visual evidence for UAV experimentation.' },
      },
      {
        label: { zh: '直升机平台', en: 'Helicopter bay' },
        status: { zh: '图片已接入', en: 'Images connected' },
        hint: { zh: '放机型识别、起降准备和操控场景。', en: 'Use for platform ID, launch prep, and control scenes.' },
      },
      {
        label: { zh: '地面站与设备', en: 'Ground station & gear' },
        status: { zh: '图片已接入', en: 'Images connected' },
        hint: { zh: '放遥控器、地面站、现场设备和维护记录。', en: 'Use for controllers, stations, field gear, and maintenance notes.' },
      },
    ],
  },
  {
    slug: 'deal-results-showcase',
    index: '04',
    title: { zh: '成交成果展示', en: 'Deal Results Showcase' },
    description: {
      zh: '集中展示成交、交付、直播运营或转化相关素材，承接简历中的市场分析、直播选品、脚本和数据优化经历。',
      en: 'A showcase for deal, delivery, live-commerce, or conversion assets, tied to market analysis, live-stream selection, scripts, and data optimization in the resume.',
    },
    status: { zh: '已接入成交视频', en: 'Deal videos connected' },
    theme: 'outcome',
    detailLayout: 'outcome',
    world: { zh: 'Outcome Prism Stage', en: 'Outcome Prism Stage' },
    detailHeadline: {
      zh: '把成交和转化结果做成一座会流动、会聚焦、可继续扩展的成果展柜。',
      en: 'A flowing, focusable showcase wall for deal and conversion outcomes.',
    },
    detailIntro: {
      zh: '这里对应资源包中的“成交成果展示”文件夹。主舞台会随机抽取成果视频静音自动播放，更多素材进入独立展柜页查看。',
      en: 'This page maps to the Deal Results Showcase folder. The hero stage randomly samples silent videos, while the full archive opens as a dedicated media gallery.',
    },
    metrics: [
      { label: { zh: '素材状态', en: 'Asset status' }, value: { zh: '17 条视频已接入', en: '17 videos connected' } },
      { label: { zh: '展示形态', en: 'Display mode' }, value: { zh: '流光展柜 / 聚光播放', en: 'Prism wall / spotlight player' } },
      { label: { zh: '素材来源', en: 'Source' }, value: { zh: '成交成果展示文件夹', en: 'Deal results folder' } },
    ],
    assetSlots: [
      {
        label: { zh: '成果视频流', en: 'Outcome video stream' },
        status: { zh: '已接入视频', en: 'Videos connected' },
        hint: { zh: '用于展示成交后的可视化成果和过程记录。', en: 'Used for visible outcome proof and process records.' },
      },
      {
        label: { zh: '后续图片位', en: 'Future image slots' },
        status: { zh: '待补充图片', en: 'Images pending' },
        hint: { zh: '后续可补充成交截图、交付图、现场图片或说明图。', en: 'Future screenshots, delivery images, field photos, or explanation images can be added here.' },
      },
      {
        label: { zh: '展柜复盘说明', en: 'Showcase review notes' },
        status: { zh: '待补充说明', en: 'Notes pending' },
        hint: { zh: '后续可按选品、脚本、数据、成交结果或交付阶段补充说明，避免只堆素材。', en: 'Future notes can group assets by selection, scripts, data, deal result, or delivery stage so the archive stays readable.' },
      },
    ],
  },
  {
    slug: 'flight-logs-test-reports',
    index: '05',
    title: { zh: '飞行日志与测试报告', en: 'Flight Logs & Test Reports' },
    description: {
      zh: '承接极飞无人机实验经历：部件质量测试、飞行日志分析、固件烧录、维修记录和临时测试方案。',
      en: 'Tied to XAG UAV experimentation: component quality testing, flight-log analysis, firmware flashing, repair notes, and temporary test plans.',
    },
    status: { zh: '测试档案待补充', en: 'Test archive pending' },
    theme: 'blackbox',
    detailLayout: 'recorder',
    world: { zh: 'Black Box Recorder', en: 'Black Box Recorder' },
    detailHeadline: {
      zh: '把质量测试、日志分析和现场问题从“经历”变成可复盘的黑匣子记录。',
      en: 'A black-box recorder that turns quality tests, log analysis, and field issues into reviewable evidence.',
    },
    detailIntro: {
      zh: '这里后续放质量测试目标、设备状态、飞行日志摘要、炸机原因分析、固件烧录记录、维修结论和改进建议，体现无人机实验员的严谨度。',
      en: 'Future records will hold quality-test goals, equipment state, flight-log summaries, crash-cause analysis, firmware flashing records, repair conclusions, and improvement notes.',
    },
    metrics: [
      { label: { zh: '记录类型', en: 'Record types' }, value: { zh: '日志 / 固件 / 维修 / 报告', en: 'Logs / firmware / repair / reports' } },
      { label: { zh: '记录维度', en: 'Dimensions' }, value: { zh: '目标 / 状态 / 原因 / 结论', en: 'Goal / state / cause / conclusion' } },
      { label: { zh: '来源', en: 'Source' }, value: { zh: '极飞无人机实验经历', en: 'XAG UAV experimentation' } },
    ],
    assetSlots: [
      {
        label: { zh: '任务记录', en: 'Mission log' },
        status: { zh: '待补充文档', en: 'Doc pending' },
        hint: { zh: '适合放测试目标、设备状态、固件版本和执行步骤。', en: 'Use for test goals, equipment state, firmware version, and execution steps.' },
      },
      {
        label: { zh: '问题复盘', en: 'Issue review' },
        status: { zh: '待补充记录', en: 'Record pending' },
        hint: { zh: '记录异常现象、飞行日志判断、炸机原因、定位过程和修复建议。', en: 'Record anomalies, flight-log judgement, crash causes, diagnosis, and fix recommendations.' },
      },
      {
        label: { zh: '测试截图 / 报告', en: 'Screenshots / report' },
        status: { zh: '待接入 PDF', en: 'PDF pending' },
        hint: { zh: '可放测试截图、曲线、报告 PDF 或摘要。', en: 'Can hold test screenshots, charts, reports, or summaries.' },
      },
    ],
  },
  {
    slug: 'certificates-awards',
    index: '06',
    title: { zh: '证书与荣誉', en: 'Certificates & Awards' },
    description: {
      zh: '展示 CAAC 三项无人机资质、挑战杯省级银奖、她轻创电商赛省级银奖和创新创业奖项。',
      en: 'Shows CAAC UAV credentials, Challenge Cup provincial silver, She-Light e-commerce provincial silver, and innovation awards.',
    },
    status: { zh: '证书图片已接入', en: 'Certificate images connected' },
    theme: 'verify',
    detailLayout: 'vault',
    world: { zh: 'Verification Vault', en: 'Verification Vault' },
    detailHeadline: {
      zh: '把 CAAC 资质、竞赛奖项和组织经历装订成可翻阅的验证书册。',
      en: 'A book-style verification gallery for CAAC credentials, awards, and leadership evidence.',
    },
    detailIntro: {
      zh: '这里展示已转图的证书与荣誉材料，包括 CAAC 资质、挑战杯、“她轻创”电商赛和创新创业奖项。公开页只展示图片，不提供 PDF 下载。',
      en: 'This gallery displays rendered certificate and honor images, including CAAC credentials, Challenge Cup, She-Light e-commerce, and innovation awards. Public pages show images only, without PDF downloads.',
    },
    metrics: [
      { label: { zh: '公开策略', en: 'Public rule' }, value: { zh: '图片展示', en: 'Image display only' } },
      { label: { zh: '核验方式', en: 'Verification' }, value: { zh: '正式场景提供原件', en: 'Originals on request' } },
      { label: { zh: '状态', en: 'Status' }, value: { zh: '证书书册已接入', en: 'Book gallery connected' } },
    ],
    assetSlots: [
      {
        label: { zh: '挑战杯 / 创赛', en: 'Challenge Cup / contests' },
        status: { zh: '荣誉已接入', en: 'Honors connected' },
        hint: { zh: '展示挑战杯省级银奖、创新创业竞赛和项目设计经历。', en: 'Shows Challenge Cup provincial silver, innovation contests, and project design experience.' },
      },
      {
        label: { zh: '资格证书', en: 'Credentials' },
        status: { zh: 'CAAC 资质已接入', en: 'CAAC credentials connected' },
        hint: { zh: '覆盖多旋翼教员、中型超视距多旋翼机长和中型超视距直升机机长。', en: 'Covers multi-rotor instructor, medium BVLOS multi-rotor PIC, and medium BVLOS helicopter PIC.' },
      },
      {
        label: { zh: '荣誉材料', en: 'Honor evidence' },
        status: { zh: '图片已接入', en: 'Images connected' },
        hint: { zh: '公开页使用图片书册展示，不暴露源 PDF 下载入口。', en: 'The public page uses a book-style image gallery without exposing source PDF downloads.' },
      },
    ],
  },
];

export const contactItems = [
  { label: { zh: '微信', en: 'WeChat' }, value: { zh: '扫码添加好友', en: 'Scan the QR code' } },
  { label: { zh: '邮箱', en: 'Email' }, value: { zh: resumeProfile.email, en: resumeProfile.email } },
  { label: { zh: '求职方向', en: 'Target role' }, value: resumeProfile.targetRole },
  { label: { zh: '目标城市', en: 'Target city' }, value: resumeProfile.city },
  { label: { zh: '简历状态', en: 'Resume' }, value: { zh: '新版 PDF 已接入，可下载查看完整经历', en: 'Updated PDF connected and ready to download' } },
];
