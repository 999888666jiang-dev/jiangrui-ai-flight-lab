---
name: advanced-website-production-workflow
description: Use when building or upgrading a premium animated website that needs strong art direction, interaction design, real assets, QA screenshots, and maintainable implementation.
---

# Advanced Website Production Workflow

## When To Use

Use this skill for high-end portfolio sites, immersive product pages, animated evidence libraries, media-heavy landing pages, and any web project where visual quality and interaction quality matter as much as code correctness.

## Workflow

1. Define the visual world before writing components.
   - State the subject, mood, material language, motion hierarchy, and what must remain readable.
   - Translate references into principles instead of copying their layout, text, or assets.

2. Separate content, structure, and effects.
   - Keep user-facing copy in data files or composables.
   - Keep reusable visual systems in focused components.
   - Keep particles, background motion, media players, and page transitions independent.

3. Design with real asset states.
   - Use real images, PDFs, videos, and manifests when available.
   - If assets are missing, render designed placeholders that do not request nonexistent files.
   - Avoid temporary stock media or unstable external links unless explicitly approved.

4. Build progressive interaction.
   - Desktop can use richer scroll, hover, 3D, canvas, and GSAP motion.
   - Touch, WeChat, low-power, and reduced-motion modes need deliberate lower-cost alternatives.
   - Motion should support the content, not hide weak content.

5. Verify in a browser.
   - Capture desktop hero, key interaction states, media pages, evidence/contact sections, and mobile direct links.
   - Track console errors, page errors, failed responses, and horizontal overflow.
   - Save screenshots and QA JSON with the feature or date in the folder name.

6. Preserve maintainability.
   - Prefer one data manifest per resource family.
   - Prefer one adaptive media layer for video and poster selection.
   - Do not add a new animation system when CSS or existing GSAP patterns are enough.

## Quality Bar

- No runtime errors.
- No 400+ failed resources from missing assets.
- No horizontal overflow on 320px to desktop widths.
- No unreadable text caused by effects.
- No unbounded media preloading on mobile.
- Every high-motion feature has a reduced-motion fallback.

## Deliverables

- Implementation.
- Test plan and actual test result.
- Screenshot folder.
- Risk list with P0/P1/P2 classification.
- Updated project plan or learning note.
