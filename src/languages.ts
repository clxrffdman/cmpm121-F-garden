import i18n from "i18next";
import { updateButtonsVisual } from "./saveManagement";
import { gameGrid, scenarioButtons } from "./main";

const translationHtmls: string[] = [
  "appleButton",
  "bananaButton",
  "carrotButton",
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
      appleButton: "Plant Apple",
      bananaButton: "Plant Banana",
      carrotButton: "Plant Carrot",
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
      scenarioA: "Scenario A",
      scenarioB: "Scenario B",
    },
  },
  kr: {
    translation: {
        appleButton: "사과 심기",
        bananaButton: "바나나 심기",
        carrotButton: "당근 심기",
        passTimeButton: "시간 흐름",
        title: "121 Group 7 정원 게임",
        sunLevelText: "태양 농도",
        undoButton: "되돌리기",
        redoButton: "다시 실행",
        saveButton1: "게임 저장",
        loadAutoSaveButton: "자동 저장 불러오기",
        reset: "데이터 초기화",
        loadSave: "저장 불러오기: ",
        saveManagement: "저장 관리",
        scenarios: "시나리오",
        autosaveDetected: "자동 저장 발견, 계속하시겠습니까?",
        resetAll: "모든 데이터 초기화",
        waterLevel: "물 농도: ",
        neighbors: "이웃: ",
        scenarioA: "시나리오 A",
        scenarioB: "시나리오 B",
    },
  },
  pr: {
    translation: {
        appleButton: "کاشت سیب",
        bananaButton: "کاشت موز",
        carrotButton: "کاشت هویج",
        passTimeButton: "گذر زمان",
        title: "بازی باغ گروه 7 121",
        sunLevelText: "میزان نور آفتاب",
        undoButton: "لغو",
        redoButton: "انجام مجدد",
        saveButton1: "ذخیره بازی",
        loadAutoSaveButton: "بارگذاری خودکار ذخیره",
        reset: "پاکسازی داده‌ها",
        loadSave: "بارگذاری ذخیره: ",
        saveManagement: "مدیریت ذخیره",
        scenarios: "سناریوها",
        autosaveDetected: "ذخیره خودکار شناسایی شد، آیا می‌خواهید از آن ادامه دهید؟",
        resetAll: "پاکسازی همه داده‌ها",
        waterLevel: "میزان آب: ",
        neighbors: "همسایگان: ",
        scenarioA: "سناریو A",
        scenarioB: "سناریو B",
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
  updateScenarioButtons();
  gameGrid.renderGrid();
}

function updateScenarioButtons() {
  for (const key in scenarioButtons) {
    scenarioButtons[key].textContent = i18n.t(key);
  }
}

export default i18n;
