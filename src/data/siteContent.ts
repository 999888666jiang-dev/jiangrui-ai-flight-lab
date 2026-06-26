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

export const heroContent = {
  name: { zh: '姜睿', en: 'Jiang Rui' },
  title: {
    zh: 'AI 设计工程师 / FPV 飞手 / 全机型无人机飞手 / 程序员',
    en: 'AI Design Engineer / FPV Pilot / UAV Pilot / Programmer',
  },
  summary: {
    zh: '用代码构建智能体工作流，用飞行经验理解真实场景，用测试记录把无人机系统跑得更稳、更可复盘。',
    en: 'I connect AI workflows, flight operation, and test documentation to make UAV systems more reliable, measurable, and repeatable.',
  },
  traits: [
    { zh: 'CAAC 多旋翼教员', en: 'CAAC Multi-Rotor Instructor' },
    { zh: '中型超视距多旋翼机长', en: 'Medium BVLOS Multi-Rotor PIC' },
    { zh: '中型超视距直升机机长', en: 'Medium BVLOS Helicopter PIC' },
    { zh: 'Python / 嵌入式 / 前端工程', en: 'Python / Embedded / Front-End' },
  ],
  telemetry: [
    { label: 'ALT', value: '120M' },
    { label: 'SPD', value: '23.6M/S' },
    { label: 'HDG', value: '268°' },
  ],
};

export const missionCopy = [
  {
    zh: '我的页面不再按普通简历模板铺开，而是把无人机测试、FPV 操控、AI 工作流和程序开发整理成一个可持续补充证据的技术实验室。',
    en: 'This page is structured as a technical lab rather than a generic resume: UAV testing, FPV operation, AI workflows, and software engineering are connected through evidence.',
  },
  {
    zh: '简历中已确认的基础包括：软件工程本科、测试开发实习、Python 数据收集、智能体工作流搭建、CAAC 多旋翼教员、中型超视距多旋翼机长和中型超视距直升机机长。',
    en: 'Verified resume signals include software engineering study, test development internship, Python data collection, agent workflow building, and multiple CAAC UAV credentials.',
  },
];

export const facts = [
  { label: { zh: '当前方向', en: 'Direction' }, value: { zh: '无人机测试 / AI 设计工程', en: 'UAV Testing / AI Design Engineering' } },
  { label: { zh: '教育背景', en: 'Education' }, value: { zh: '广州新华学院 软件工程 本科 2023-2027', en: 'Software Engineering, Guangzhou Xinhua University, 2023-2027' } },
  { label: { zh: '资源策略', en: 'Resource strategy' }, value: { zh: '本地资源包持续补齐，不再依赖过期临时链接', en: 'Local resource package first; expired temporary links are not used' } },
];

export const systemNodes = [
  { label: { zh: 'AI 设计工程师', en: 'AI Design Engineer' }, value: 'Agent / Prototype' },
  { label: { zh: 'FPV 飞手', en: 'FPV Pilot' }, value: 'Manual / Image' },
  { label: { zh: '全机型无人机飞手', en: 'UAV Pilot' }, value: 'Multi-rotor / Helicopter' },
  { label: { zh: '程序员', en: 'Programmer' }, value: 'Python / Embedded / Web' },
];

export const skills = [
  {
    name: { zh: '无人机测试与场地执行', en: 'UAV Testing & Field Execution' },
    description: {
      zh: '围绕起降检查、风险识别、现场记录、稳定性观察和问题复盘建立测试流程。',
      en: 'Builds test flow around pre-flight checks, risk awareness, field notes, stability observation, and issue review.',
    },
    level: 88,
  },
  {
    name: { zh: 'FPV / 穿越机操控', en: 'FPV Operation' },
    description: {
      zh: '具备穿越机操控经验，可把画面、速度、姿态变化转化为可说明的飞行证据。',
      en: 'FPV control experience that turns image, speed, and attitude changes into explainable flight evidence.',
    },
    level: 86,
  },
  {
    name: { zh: 'AI 工作流与数据采集', en: 'AI Workflow & Data Collection' },
    description: {
      zh: '简历中包含智能体工作流搭建和 Python 收集 200+ 用户反馈数据的经历。',
      en: 'Resume-backed experience in agent workflow building and Python collection of 200+ user feedback entries.',
    },
    level: 82,
  },
  {
    name: { zh: '程序开发与嵌入式基础', en: 'Programming & Embedded Basics' },
    description: {
      zh: '软件工程背景，覆盖 Python、嵌入式、前端工程、地面站和测试文档能力。',
      en: 'Software engineering background covering Python, embedded basics, front-end engineering, ground stations, and test documentation.',
    },
    level: 80,
  },
];

export const certificate = {
  title: { zh: '民用无人驾驶航空器操控员执照', en: 'Civil Remote Pilot License' },
  meta: { zh: '签发日期 2025-12-16 / 有效期至 2032-05-06', en: 'Issued 2025-12-16 / Valid until 2032-05-06' },
  note: {
    zh: '公开页面使用脱敏预览图。更多证书和原件可在面试或正式核验时提供。',
    en: 'The public page uses a redacted preview. More certificates and originals can be provided for formal verification.',
  },
  image: publicAsset('images/caac-license-preview.png'),
};

export const experienceItems = [
  {
    period: '2026',
    title: { zh: '个人网站升级为 AI Flight Lab', en: 'AI Flight Lab Portfolio Upgrade' },
    role: { zh: '个人技术品牌 / 前端实现', en: 'Personal technical brand / Front-end implementation' },
    description: {
      zh: '围绕无人机测试、AI 工作流、FPV 和代码能力重构页面，把后续资源统一接入证据库。',
      en: 'Rebuilt the page around UAV testing, AI workflow, FPV operation, and code, with future resources routed into the evidence archive.',
    },
    tags: ['Vue3', 'TypeScript', 'Three.js', 'GSAP'],
  },
  {
    period: '2025 - 2032',
    title: { zh: 'CAAC 无人机资质有效期', en: 'CAAC UAV Credential Validity' },
    role: { zh: '多旋翼教员 / 中型超视距机长', en: 'Multi-rotor instructor / Medium BVLOS PIC' },
    description: {
      zh: '简历与执照资源显示：CAAC 多旋翼教员、中型超视距多旋翼机长、中型超视距直升机机长。',
      en: 'Resume and license resources show CAAC multi-rotor instructor, medium BVLOS multi-rotor PIC, and medium BVLOS helicopter PIC credentials.',
    },
    tags: ['CAAC', 'BVLOS', 'Multi-Rotor', 'Helicopter'],
  },
  {
    period: '2024.07 - 2024.09',
    title: { zh: '酣睡博士（深圳）科技有限公司', en: 'Hanshui Doctor Shenzhen Technology' },
    role: { zh: '测试开发工程师实习', en: 'Test Development Engineer Intern' },
    description: {
      zh: '参与智能止鼾新产品设计、竞品分析、Python 用户反馈采集、需求文档和原型机测试，发现并解决关键性能问题。',
      en: 'Worked on product design, competitor analysis, Python feedback collection, requirements documentation, and prototype testing for a smart anti-snoring product.',
    },
    tags: ['Testing', 'Python', 'Product', 'Prototype'],
  },
  {
    period: '2023 - 2027',
    title: { zh: '广州新华学院 软件工程本科', en: 'Software Engineering Undergraduate' },
    role: { zh: '专业班长 / 创业协会会长 / 创赛项目设计人', en: 'Class lead / entrepreneurship association lead / competition designer' },
    description: {
      zh: '组织班级与创业活动，主导创新创业竞赛项目设计；挑战杯项目获得省级银奖。',
      en: 'Organized class and entrepreneurship activities, led innovation competition design, and contributed to a provincial silver award Challenge Cup project.',
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
      zh: '用于展示操控稳定性、速度感、画面判断和现场执行。已接入 FPV 飞行视频文件夹资源。',
      en: 'Shows control stability, speed sense, image judgement, and field execution with connected local FPV folder footage.',
    },
    status: { zh: '已接入本地视频', en: 'Local videos connected' },
    theme: 'velocity',
    detailLayout: 'cinema',
    world: { zh: 'Velocity Cinema', en: 'Velocity Cinema' },
    detailHeadline: {
      zh: '把速度、姿态和画面判断放进一个可复盘的视频舱。',
      en: 'A replay bay for speed, attitude, and image judgement.',
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
        status: { zh: '待补充说明', en: 'Notes pending' },
        hint: { zh: '补充速度、姿态、风险点和操作判断。', en: 'Add speed, attitude, risk points, and control decisions.' },
      },
    ],
  },
  {
    slug: 'ai-design-works',
    index: '02',
    title: { zh: 'AI 设计作品', en: 'AI Design Works' },
    description: {
      zh: '用于展示 AI 原型、智能体工作流、交互设计和视觉方案。可接图片、短视频或项目链接。',
      en: 'Reserved for AI prototypes, agent workflows, interaction design, and visual systems. Images, clips, or project links can be attached.',
    },
    status: { zh: '待补充作品', en: 'Works pending' },
    theme: 'neural',
    detailLayout: 'atelier',
    world: { zh: 'Neural Atelier', en: 'Neural Atelier' },
    detailHeadline: {
      zh: '把 AI 方案做成可解释、可演示、可继续迭代的设计工坊。',
      en: 'An atelier for explainable, demo-ready, and extensible AI design work.',
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
      zh: '用于归档多旋翼、直升机、地面站、穿越机和现场设备照片。',
      en: 'Reserved for multi-rotor, helicopter, ground station, FPV, and field equipment images.',
    },
    status: { zh: '待补充照片', en: 'Images pending' },
    theme: 'hangar',
    detailLayout: 'hangar',
    world: { zh: 'Hangar Matrix', en: 'Hangar Matrix' },
    detailHeadline: {
      zh: '把不同平台、地面站和现场装备整理成一座数字机库。',
      en: 'A digital hangar for platforms, ground stations, and field equipment.',
    },
    detailIntro: {
      zh: '后续照片会按平台类型、现场环境和设备用途归档，避免只做普通相册。',
      en: 'Future photos will be grouped by platform, environment, and equipment role rather than shown as a generic gallery.',
    },
    metrics: [
      { label: { zh: '平台分类', en: 'Platforms' }, value: { zh: '多旋翼 / 直升机 / FPV', en: 'Multi-rotor / helicopter / FPV' } },
      { label: { zh: '资料类型', en: 'Media' }, value: { zh: '照片优先', en: 'Photos first' } },
      { label: { zh: '展示方式', en: 'Display' }, value: { zh: '机库矩阵', en: 'Hangar matrix' } },
    ],
    assetSlots: [
      {
        label: { zh: '多旋翼平台', en: 'Multi-rotor bay' },
        status: { zh: '待补充照片', en: 'Photos pending' },
        hint: { zh: '放机体、任务载荷、地面检查和现场环境。', en: 'Use for aircraft, payloads, checks, and field context.' },
      },
      {
        label: { zh: '直升机平台', en: 'Helicopter bay' },
        status: { zh: '待补充照片', en: 'Photos pending' },
        hint: { zh: '放机型识别、起降准备和操控场景。', en: 'Use for platform ID, launch prep, and control scenes.' },
      },
      {
        label: { zh: '地面站与设备', en: 'Ground station & gear' },
        status: { zh: '待补充照片', en: 'Photos pending' },
        hint: { zh: '放遥控器、地面站、现场设备和维护记录。', en: 'Use for controllers, stations, field gear, and maintenance notes.' },
      },
    ],
  },
  {
    slug: 'deal-results-showcase',
    index: '04',
    title: { zh: '成交成果展示', en: 'Deal Results Showcase' },
    description: {
      zh: '用于集中展示成交成果、交付画面、客户沟通成果和后续可补充的视频图片素材。',
      en: 'A media archive for deal outcomes, delivery scenes, communication proof, and future video or image evidence.',
    },
    status: { zh: '已接入成交视频', en: 'Deal videos connected' },
    theme: 'outcome',
    detailLayout: 'outcome',
    world: { zh: 'Outcome Prism Stage', en: 'Outcome Prism Stage' },
    detailHeadline: {
      zh: '把成交成果做成一座会流动、会聚焦、可继续扩展的成果展柜。',
      en: 'A flowing, focusable showcase wall for deal outcomes and future proof assets.',
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
        hint: { zh: '后续可按时间、类型或成果阶段补充说明，避免只堆素材。', en: 'Future notes can group assets by date, type, or result stage so the archive stays readable.' },
      },
    ],
  },
  {
    slug: 'flight-logs-test-reports',
    index: '05',
    title: { zh: '飞行日志与测试报告', en: 'Flight Logs & Test Reports' },
    description: {
      zh: '用于沉淀任务目标、环境条件、问题现象、复盘结论和测试截图。',
      en: 'Reserved for mission goals, conditions, observations, conclusions, and test screenshots.',
    },
    status: { zh: '待补充文档', en: 'Docs pending' },
    theme: 'blackbox',
    detailLayout: 'recorder',
    world: { zh: 'Black Box Recorder', en: 'Black Box Recorder' },
    detailHeadline: {
      zh: '把飞行和测试从“经历”变成可复盘的黑匣子记录。',
      en: 'A black-box recorder that turns flight and test work into reviewable evidence.',
    },
    detailIntro: {
      zh: '这里后续放任务目标、环境条件、异常现象、测试截图、结论和改进建议，体现无人机测试的严谨度。',
      en: 'Future records will hold goals, conditions, anomalies, screenshots, conclusions, and improvement notes for rigorous UAV testing evidence.',
    },
    metrics: [
      { label: { zh: '文档类型', en: 'Doc types' }, value: { zh: 'PDF / 截图 / 复盘', en: 'PDF / screenshots / reviews' } },
      { label: { zh: '记录维度', en: 'Dimensions' }, value: { zh: '目标 / 环境 / 现象 / 结论', en: 'Goal / condition / issue / conclusion' } },
      { label: { zh: '状态', en: 'Status' }, value: { zh: '等待真实报告', en: 'Reports pending' } },
    ],
    assetSlots: [
      {
        label: { zh: '任务记录', en: 'Mission log' },
        status: { zh: '待补充文档', en: 'Doc pending' },
        hint: { zh: '适合放任务目标、环境、人员和设备状态。', en: 'Use for goals, environment, team, and equipment state.' },
      },
      {
        label: { zh: '问题复盘', en: 'Issue review' },
        status: { zh: '待补充记录', en: 'Record pending' },
        hint: { zh: '记录异常现象、定位过程和修复建议。', en: 'Record anomalies, diagnosis, and fix recommendations.' },
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
      zh: '用于补充挑战杯、省级银奖、电子商务大赛、大创等证据材料。',
      en: 'Reserved for Challenge Cup, provincial silver award, e-commerce competition, and innovation project evidence.',
    },
    status: { zh: '待补充材料', en: 'Evidence pending' },
    theme: 'verify',
    detailLayout: 'vault',
    world: { zh: 'Verification Vault', en: 'Verification Vault' },
    detailHeadline: {
      zh: '把证书、奖项和可核验材料放进一个严谨的验证库。',
      en: 'A verification vault for certificates, awards, and checkable proof.',
    },
    detailIntro: {
      zh: '这里后续补充挑战杯、省级银奖、电子商务大赛、大创等证据材料。公开页优先使用脱敏预览，正式核验时再提供原件。',
      en: 'This vault will store Challenge Cup, provincial awards, e-commerce competition, and innovation proof. Public pages use redacted previews first.',
    },
    metrics: [
      { label: { zh: '公开策略', en: 'Public rule' }, value: { zh: '脱敏预览', en: 'Redacted preview' } },
      { label: { zh: '核验方式', en: 'Verification' }, value: { zh: '正式场景提供原件', en: 'Originals on request' } },
      { label: { zh: '状态', en: 'Status' }, value: { zh: '等待补充材料', en: 'Evidence pending' } },
    ],
    assetSlots: [
      {
        label: { zh: '挑战杯 / 创赛', en: 'Challenge Cup / contests' },
        status: { zh: '待补充材料', en: 'Evidence pending' },
        hint: { zh: '可放奖项证明、项目说明和团队角色。', en: 'Use for award proof, project notes, and role evidence.' },
      },
      {
        label: { zh: '资格证书', en: 'Credentials' },
        status: { zh: '待补充证书', en: 'Credential pending' },
        hint: { zh: '补充无人机、软件、竞赛或培训类证书。', en: 'Add UAV, software, contest, or training credentials.' },
      },
      {
        label: { zh: '荣誉材料', en: 'Honor evidence' },
        status: { zh: '待补充图片', en: 'Images pending' },
        hint: { zh: '公开页使用脱敏图，避免泄露敏感编号。', en: 'Use redacted images publicly to protect sensitive IDs.' },
      },
    ],
  },
];

export const contactItems = [
  { label: { zh: '微信', en: 'WeChat' }, value: { zh: '扫码添加好友', en: 'Scan the QR code' } },
  { label: { zh: '求职方向', en: 'Target role' }, value: { zh: '无人机测试 / AI 设计工程 / 无人机应用', en: 'UAV Testing / AI Design Engineering / UAV Applications' } },
  { label: { zh: '简历状态', en: 'Resume' }, value: { zh: 'PDF 已接入，可下载查看完整经历', en: 'PDF connected and ready to download' } },
];
