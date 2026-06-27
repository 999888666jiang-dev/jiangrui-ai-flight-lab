import type { UavGalleryCategory } from './uavGalleryManifest';

export type UavGalleryOverride = {
  title?: {
    zh: string;
    en: string;
  };
  category?: UavGalleryCategory;
  featured?: boolean;
};

export const uavGalleryOverrides: Record<string, UavGalleryOverride> = {};
