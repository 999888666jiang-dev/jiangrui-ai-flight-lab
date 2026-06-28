import { publicAsset } from '../utils/publicAsset';
import { aiDesignGalleryOverrides } from './aiDesignGalleryOverrides';

export type AiDesignCategory = 'prototype' | 'visual' | 'workflow' | 'archive';

export type AiDesignWork = {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  sourceName: string;
  sizeMB: number;
  category: AiDesignCategory;
  thumbSrc: string;
  displaySrc: string;
  fullSrc: string;
  width?: number;
  height?: number;
  featured?: boolean;
  sourceTitle?: string;
};

const rawAiDesignWorks = [
    {
        "id":  "ai-work-001",
        "title":  {
                      "zh":  "AI 设计作品 01",
                      "en":  "AI design work 01"
                  },
        "sourceName":  "2a84b12545ebd72ae233c07505a41d74.png",
        "sizeMB":  1.89,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-001/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-001/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-001/full.webp",
        "width":  1672,
        "height":  941,
        "featured":  true,
        "sourceTitle":  "2a84b12545ebd72ae233c07505a41d74"
    },
    {
        "id":  "ai-work-002",
        "title":  {
                      "zh":  "AI 设计作品 02",
                      "en":  "AI design work 02"
                  },
        "sourceName":  "IMG_6692.PNG",
        "sizeMB":  0.27,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-002/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-002/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-002/full.webp",
        "width":  1320,
        "height":  2868,
        "featured":  true,
        "sourceTitle":  "IMG 6692"
    },
    {
        "id":  "ai-work-003",
        "title":  {
                      "zh":  "AI 设计作品 03",
                      "en":  "AI design work 03"
                  },
        "sourceName":  "IMG_6792.JPG",
        "sizeMB":  0.3,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-003/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-003/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-003/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  true,
        "sourceTitle":  "IMG 6792"
    },
    {
        "id":  "ai-work-004",
        "title":  {
                      "zh":  "AI 设计作品 04",
                      "en":  "AI design work 04"
                  },
        "sourceName":  "IMG_6793.JPG",
        "sizeMB":  0.85,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-004/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-004/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-004/full.webp",
        "width":  2880,
        "height":  2160,
        "featured":  true,
        "sourceTitle":  "IMG 6793"
    },
    {
        "id":  "ai-work-005",
        "title":  {
                      "zh":  "AI 设计作品 05",
                      "en":  "AI design work 05"
                  },
        "sourceName":  "IMG_6840.JPG",
        "sizeMB":  3.75,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-005/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-005/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-005/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  true,
        "sourceTitle":  "IMG 6840"
    },
    {
        "id":  "ai-work-006",
        "title":  {
                      "zh":  "AI 设计作品 06",
                      "en":  "AI design work 06"
                  },
        "sourceName":  "IMG_6844.JPG",
        "sizeMB":  3.08,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-006/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-006/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-006/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  true,
        "sourceTitle":  "IMG 6844"
    },
    {
        "id":  "ai-work-007",
        "title":  {
                      "zh":  "AI 设计作品 07",
                      "en":  "AI design work 07"
                  },
        "sourceName":  "IMG_6852.JPG",
        "sizeMB":  0.69,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-007/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-007/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-007/full.webp",
        "width":  4032,
        "height":  3024,
        "featured":  true,
        "sourceTitle":  "IMG 6852"
    },
    {
        "id":  "ai-work-008",
        "title":  {
                      "zh":  "AI 设计作品 08",
                      "en":  "AI design work 08"
                  },
        "sourceName":  "IMG_6856.JPG",
        "sizeMB":  3.44,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-008/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-008/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-008/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  true,
        "sourceTitle":  "IMG 6856"
    },
    {
        "id":  "ai-work-009",
        "title":  {
                      "zh":  "AI 设计作品 09",
                      "en":  "AI design work 09"
                  },
        "sourceName":  "IMG_6857.JPG",
        "sizeMB":  0.99,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-009/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-009/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-009/full.webp",
        "width":  3024,
        "height":  4032,
        "featured":  false,
        "sourceTitle":  "IMG 6857"
    },
    {
        "id":  "ai-work-010",
        "title":  {
                      "zh":  "AI 设计作品 10",
                      "en":  "AI design work 10"
                  },
        "sourceName":  "IMG_6861.JPG",
        "sizeMB":  1.19,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-010/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-010/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-010/full.webp",
        "width":  4032,
        "height":  3024,
        "featured":  false,
        "sourceTitle":  "IMG 6861"
    },
    {
        "id":  "ai-work-011",
        "title":  {
                      "zh":  "AI 设计作品 11",
                      "en":  "AI design work 11"
                  },
        "sourceName":  "IMG_6864.JPG",
        "sizeMB":  3.69,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-011/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-011/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-011/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 6864"
    },
    {
        "id":  "ai-work-012",
        "title":  {
                      "zh":  "AI 设计作品 12",
                      "en":  "AI design work 12"
                  },
        "sourceName":  "IMG_6865.JPG",
        "sizeMB":  3.97,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-012/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-012/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-012/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 6865"
    },
    {
        "id":  "ai-work-013",
        "title":  {
                      "zh":  "AI 设计作品 13",
                      "en":  "AI design work 13"
                  },
        "sourceName":  "IMG_6866.JPG",
        "sizeMB":  3.35,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-013/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-013/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-013/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 6866"
    },
    {
        "id":  "ai-work-014",
        "title":  {
                      "zh":  "AI 设计作品 14",
                      "en":  "AI design work 14"
                  },
        "sourceName":  "IMG_6871.JPG",
        "sizeMB":  2.91,
        "category":  "archive",
        "thumbSrc":  "ai-design-gallery/ai-work-014/thumb.webp",
        "displaySrc":  "ai-design-gallery/ai-work-014/display.webp",
        "fullSrc":  "ai-design-gallery/ai-work-014/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  false,
        "sourceTitle":  "IMG 6871"
    }
] as const;

export const aiDesignWorks: AiDesignWork[] = rawAiDesignWorks.map((item) => {
  const override = aiDesignGalleryOverrides[item.id];

  return {
    ...item,
    ...override,
    title: override?.title ?? item.title,
    category: override?.category ?? item.category,
    featured: override?.featured ?? item.featured,
    thumbSrc: publicAsset(item.thumbSrc),
    displaySrc: publicAsset(item.displaySrc),
    fullSrc: publicAsset(item.fullSrc),
  };
});

export function getAiDesignWorkById(id: string) {
  return aiDesignWorks.find((item) => item.id === id);
}