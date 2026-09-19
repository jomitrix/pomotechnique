import { en } from './en.js';
import { it } from './it.js';

export const locales = {
  en,
  it,
};

export const DEFAULT_LANGUAGE = 'en';

export const getTranslation = (lang = DEFAULT_LANGUAGE) => {
  return locales[lang] || locales[DEFAULT_LANGUAGE];
};
