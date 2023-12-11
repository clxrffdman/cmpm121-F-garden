import "./style.css";
import { GameGrid } from "./gameGrid";
import { addToUndoList } from "./saveManagement";
import { setLanguage, languageInit } from "./languages";
import i18n from "./languages";

const gameName = "121 Group 7 Garden Game";
document.title = gameName;
document.querySelector("#title")!.textContent = gameName;

languageInit();

export const gridContainer = document.querySelector("#game")!;

const sunMultiplier = 1;
export const scenarioButtons: { [key: string]: HTMLButtonElement } = {};

fetch("scenarios.json")
  .then((resp) => resp.json())
  .then((json) => addScenarios(json));

function addScenarios(scenarioData: any) {
  console.log(scenarioData);
  const scenarioButtonParent = document.querySelector("#scenarioButtons")!;
  for (const scenario of scenarioData.scenarios) {
    const button = document.createElement("button");
    button.addEventListener("click", () => {
      gameGrid.loadScenario(scenario);
      updateGame();
    });
    button.textContent = i18n.t(scenario.name);
    scenarioButtons[scenario.name] = button;
    scenarioButtonParent.appendChild(button);
  }
}

const sunLevelText = document.querySelector("#sunLevelText")!;
function updateSunLevel() {
  gameGrid.sunLevel = Math.floor(Math.random() * sunMultiplier * 4);
  sunLevelText.textContent = i18n.t("sunLevelText") + ` ${gameGrid.sunLevel}`;
}

export const GRID_SIZE = 16;
export const gameGrid = new GameGrid(GRID_SIZE);

updateGame();

export function addClickListener(buttonId: string, handler: () => void) {
  const button = document.querySelector(buttonId);
  button?.addEventListener("click", handler);
}

addClickListener("#passTimeButton", () => {
  updateGame();
});

addClickListener("#appleButton", () => {
  placePlant(0);
});
addClickListener("#bananaButton", () => {
  placePlant(1);
});
addClickListener("#carrotButton", () => {
  placePlant(2);
});

// Add event listener for keydown event for movement
document.addEventListener("keydown", (event) => {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  event.preventDefault();
  const key = event.key;
  const plantKeys = Array.from({ length: 3 }, (_, i) =>
    String.fromCharCode(97 + i),
  );

  if (arrowKeys.includes(key)) {
    gameGrid.player.directionInput(key);
    updateSunLevel();
    gameGrid.update();
  }

  if (plantKeys.includes(key)) {
    const asciiA = "a".charCodeAt(0);
    const lowercaseLetter = key.toLowerCase();
    const letterCode = lowercaseLetter.charCodeAt(0);
    placePlant(letterCode - asciiA);
  }

  if (key == " ") {
    harvest();
  }
});

const languageDropdown = document.getElementById(
  "languageButton",
) as HTMLSelectElement;
languageDropdown.addEventListener("change", function () {
  setLanguage(languageDropdown.value);
});

const localLanguage = localStorage.getItem("language");
if (localLanguage) {
  setLanguage(localLanguage);
  languageDropdown.value = localLanguage;
} else {
  setLanguage("en");
}

function updateGame() {
  updateSunLevel();
  gameGrid.update();
  checkWin();
}

function checkWin() {
  if (gameGrid.player.money >= 100) {
    alert("win");
  }
}

function placePlant(plantSpeciesIndex: number) {
  addToUndoList();
  const x = gameGrid.player.highlightedX;
  const y = gameGrid.player.highlightedY;
  if (gameGrid?.cellAt(x, y) && !gameGrid.cellAt(x, y)!.hasPlant()) {
    const cell = gameGrid.cellAt(x, y);
    if (cell) {
      cell.speciesIndex = plantSpeciesIndex;
      cell.growthLevel = 0;
    }
    updateGame();
  }
}

function harvest() {
  addToUndoList();
  const x = gameGrid.player.highlightedX;
  const y = gameGrid.player.highlightedY;
  gameGrid?.harvestPlant(x, y);
  updateGame();
}
