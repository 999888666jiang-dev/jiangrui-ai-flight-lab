import { computed, ref } from 'vue';
import zh from '../i18n/zh.json';
import en from '../i18n/en.json';

export type Language = 'zh' | 'en';

type Messages = typeof zh;

const language = ref<Language>('zh');

function resolveMessage(messages: Messages, key: string) {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value && typeof value === 'object' && part in value) {
      return (value as Record<string, unknown>)[part];
    }

    return undefined;
  }, messages) as string | undefined;
}

export function pickText(text: { zh: string; en: string }, activeLanguage = language.value) {
  return text[activeLanguage];
}

export function useLanguage() {
  const messages = computed(() => (language.value === 'zh' ? zh : en));

  const t = (key: string) => resolveMessage(messages.value, key) ?? key;

  const toggleLanguage = () => {
    language.value = language.value === 'zh' ? 'en' : 'zh';
  };

  return {
    language,
    t,
    toggleLanguage,
  };
}

