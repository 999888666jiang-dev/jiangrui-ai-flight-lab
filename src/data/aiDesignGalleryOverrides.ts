import type { AiDesignCategory } from './aiDesignGalleryManifest';
import type { LocalizedText } from './siteContent';

export type AiDesignGalleryOverride = {
  title?: LocalizedText;
  category?: AiDesignCategory;
  featured?: boolean;
};

export const aiDesignGalleryOverrides: Record<string, AiDesignGalleryOverride> = {};
