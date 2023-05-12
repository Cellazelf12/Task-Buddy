import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locale/locale_en.json";
import esTranslation from "./locale/locale_es.json";

i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },

    fallbackLng: "en", // Idioma de respaldo si el idioma del usuario no está disponible
    detection: {
      order: ["querystring", "navigator"],
      caches: ["localStorage", "cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
