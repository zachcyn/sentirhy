import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${import.meta.env.VITE_TRANSLATION_API_KEY}`;

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    ns: ["default"],
    defaultNS: "default",

    supportedLngs: ["en","zh","ja","ms","ko"],
    
    backend: {
      loadPath
    }
  })

export default i18next;