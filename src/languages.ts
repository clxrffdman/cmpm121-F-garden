import i18n from "i18next";
import { updateButtonsVisual } from "./saveManagement";

const translationHtmls: string[] = [
  "passTimeButton",
  "title",
  "sunLevelText",
  "undoButton",
  "redoButton",
  "saveButton1",
  "loadAutoSaveButton",
  "reset",
  "saveManagement",
  "scenarios",
];

const resources = {
  en: {
    translation: {
      passTimeButton: "[EN] Pass Time",
      title: "[EN] 121 Group 7 Garden Game",
      sunLevelText: "[EN] Sun Level",
      undoButton: "Undo",
      redoButton: "Redo",
      saveButton1: "Save Game",
      loadAutoSaveButton: "Load Auto Save",
      reset: "Clear Data",
      loadSave: "Load Save: ",
      saveManagement: "Save Management",
      scenarios: "Scenarios",
      autosaveDetected:
        "[EN] Autosave detected, do you want to continue from it?",
      resetAll: "Reset All Data",
    },
  },
  es: {
    translation: {
      passTimeButton: "[ES] Passo Tiempo",
      title: "[ES] 121 Group 7 Garden Game",
      sunLevelText: "[ES] Sun Level",
      undoButton: "[ES] Undo",
      redoButton: "[ES] Redo",
      saveButton1: "[ES] Save Game",
      loadAutoSaveButton: "[ES] Load Auto Save",
      reset: "[ES] Clear Data",
      loadSave: "[ES] Load Save: ",
      saveManagement: "[ES] Save Management",
      scenarios: "[ES] Scenarios",
      autosaveDetected:
        "[ES] Autosave detected, do you want to continue from it?",
      resetAll: "[ES] Reset All Data",
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
  updateButtonsVisual();
}

export default i18n;
