import i18n from "i18next";
import { updateButtonsVisual } from "./saveManagement";
import { gameGrid } from "./main";

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
      passTimeButton: "Pass Time",
      title: "121 Group 7 Garden Game",
      sunLevelText: "Sun Level",
      undoButton: "Undo",
      redoButton: "Redo",
      saveButton1: "Save Game",
      loadAutoSaveButton: "Load Auto Save",
      reset: "Clear Data",
      loadSave: "Load Save: ",
      saveManagement: "Save Management",
      scenarios: "Scenarios",
      autosaveDetected: "Autosave detected, do you want to continue from it?",
      resetAll: "Reset All Data",
      waterLevel: "Water Level: ",
      neighbors: "Neighbors: ",
    },
  },
  kr: {
    translation: {
      passTimeButton: "시간을 보내다",
      title: "121 그룹 7 정원 게임",
      sunLevelText: "태양 수준",
      undoButton: "실행 취소",
      redoButton: "다시 하다",
      saveButton1: "게임을 저장",
      loadAutoSaveButton: "자동 저장 불러오기",
      reset: "초기화",
      loadSave: "로드 저장: ",
      saveManagement: "저장 관리",
      scenarios: "대본",
      autosaveDetected: "자동 저장이 감지되었습니다. 계속하시겠습니까?",
      resetAll: "모든 데이터 재설정",
      waterLevel: "수위: ",
      neighbors: "이웃: ",
    },
  },
  pr: {
    translation: {
      passTimeButton: "گذشت زمان",
      title: "گروه 7 بازی باغ",
      sunLevelText: "سطح خورشید",
      undoButton: "واگرد",
      redoButton: "دوباره انجام دهید",
      saveButton1: "ذخیره بازی",
      loadAutoSaveButton: "بارگذاری ذخیره خودکار",
      reset: "بازنشانی داده ها",
      loadSave: "ذخیره بار:",
      saveManagement: "ذخیره مدیریت",
      scenarios: "سناریو",
      autosaveDetected:
        "ذخیره خودکار شناسایی شد، آیا می خواهید از آن ادامه دهید؟",
      resetAll: "بازنشانی همه داده ها",
      waterLevel: "سطح آب: ",
      neighbors: "همسایه ها: ",
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
    localStorage.setItem("language", newLang);
  });
}

function updateTranslations() {
  translationHtmls.forEach((element) => {
    const contentContainer = document.getElementById(element);
    contentContainer!.innerHTML = i18n.t(element);
  });
  updateButtonsVisual();
  gameGrid.renderGrid();
}

export default i18n;
