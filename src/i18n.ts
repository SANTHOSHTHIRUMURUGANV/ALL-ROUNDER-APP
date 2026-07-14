import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation JSON files
import en from './locales/en.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  hi: { translation: hi },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  ar: { translation: ar },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  zh: { translation: zh },
  ja: { translation: ja }
};

// Auto detect browser language, default to 'en'
const getInitialLanguage = (): string => {
  const cached = localStorage.getItem('i18nextLng');
  if (cached && resources[cached as keyof typeof resources]) {
    return cached;
  }
  const browserLang = navigator.language.split('-')[0];
  if (resources[browserLang as keyof typeof resources]) {
    return browserLang;
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  const isRtl = lng === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial RTL state
const initialLang = i18n.language;
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export default i18n;
