import i18n from "i18next";

const translationHtmls: string[] = ["passTimeButton"];

const resources = {
  en: {
    translation: {
      passTimeButton: "[EN] Pass Time",
    },
  },
  es: {
    translation: {
      passTimeButton: "[ES] Passo Tiempo",
    },
  },
};

export function languageInit() {
  i18n.init(
    {
      lng: "en",
      debug: true,
      resources,
    },
    function () {
      console.log("Ready to go!");
    },
  );
}

export function setLanguage(newLang: string) {
  i18n.changeLanguage(newLang, (err) => {
    if (err) return console.log("Error: loading new language:", err);
    updateTranslations();
  });
}

function updateTranslations() {
  translationHtmls.forEach((element) => {
    const contentContainer = document.getElementById(element);
    contentContainer!.innerHTML = i18n.t(element);
  });
}

export default i18n;
