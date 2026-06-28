---
name: multi-system-responsive-adaptation
description: Use when adapting a premium animated website across desktop, tablet, mobile, WeChat, Baidu, iOS Safari, Android Chrome, reduced-motion, and low-performance devices.
---

# Multi-System Responsive Adaptation

## Core Principle

Do not treat mobile as a smaller desktop. Define a runtime profile and let every heavy feature read that profile before deciding whether to run full motion, simplified motion, or static presentation.

## Adaptation Profile

Track these inputs in one place:

- Viewport width and height.
- Pointer type and hover capability.
- Runtime shell: desktop browser, mobile browser, WeChat, Baidu, PWA, native wrapper.
- Device tier: high, medium, low, minimal.
- Motion preference: normal or reduced.
- Video policy: autoplay allowed, muted required, gesture required, preload level.
- Safe-area insets.
- Network hints when available.

## Design Rules

1. Desktop:
   - Full visual system allowed: Three.js, canvas particles, hover previews, scroll stacks, richer transitions.
   - Still keep readability and route performance measurable.

2. Tablet:
   - Keep signature effects, but reduce density and avoid interactions that fight scroll.
   - Test landscape and portrait separately.

3. Mobile:
   - Prefer static or low-frequency motion.
   - Use poster-first media.
   - Avoid hover-only affordances.
   - Touch targets should stay at least 44px.

4. WeChat/Baidu:
   - Assume autoplay and WebGL can be unreliable.
   - Prefer poster, tap-to-play overlays, CSS/SVG fallbacks, and released video sources on route leave.

5. Reduced Motion:
   - Disable continuous rotations, forced scroll animations, strong scans, and long transitions.
   - Keep layout, hierarchy, and visual identity intact.

## Media Rules

- Cards load posters first.
- Hover previews are desktop-only and use tiny teaser clips.
- Detail players load preview first.
- Full video loads only after explicit user action.
- Service Worker must not cache MP4/MOV/WEBM.

## QA Matrix

Minimum viewport set:

- Desktop: 1920, 1440, 1366.
- Tablet: 1024x768, 834x1194.
- Mobile: 430x932, 390x844, 375x812, 360x740, 320x568.

Minimum runtime set:

- Desktop Chrome.
- iOS Safari UA.
- WeChat UA.
- Baidu UA.
- Android Chrome UA.
- reduced-motion.

Checks:

- `npm run build` passes.
- Console error = 0.
- Page error = 0.
- 400+ failed response = 0.
- Horizontal overflow = 0.
- No full-size video is requested before explicit action on mobile.
- Core visual signatures still exist after fallback.

## Risk Handling

- If a high-end effect harms mobile reading, disable the effect before shrinking text.
- If a browser blocks video, show a designed tap-to-play state instead of a native black box.
- If WebGL fails, provide CSS/SVG fallback for the signature visual.
- If a refactor risks existing visuals, record it as P2 and leave it for a dedicated pass.
