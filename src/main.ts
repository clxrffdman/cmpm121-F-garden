import "./style.css";
import { GameGrid } from "./gameGrid";
import { addToUndoList } from "./saveManagement";

const gameName = "121 Group 7 Garden Game";
document.title = gameName;
document.querySelector("#title")!.textContent = gameName;

export const gridContainer = document.querySelector("#game")!;

const sunMultiplier = 1;

const sunLevelText = document.querySelector("#sunLevelText")!;
function updateSunLevel() {
  gameGrid.sunLevel = Math.floor(Math.random() * sunMultiplier * 4);
  sunLevelText.textContent = `Sun Level: ${gameGrid.sunLevel}`;
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

// Add event listener for keydown event for movement
document.addEventListener("keydown", (event) => {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const key = event.key;
  const plantKeys = Array.from({ length: 26 }, (_, i) =>
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
