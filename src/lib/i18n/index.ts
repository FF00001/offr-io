import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from './translations';

export function useTranslation() {
  const { language } = useLanguage();
  return translations[language];
}

export { translations };
export type { Translations, TranslationKey } from './translations';
