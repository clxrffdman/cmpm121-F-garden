import "./style.css";
import { GameGrid } from "./gameGrid";
import { PlantCell } from "./plant";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "121 Group 7 Garden Game";
document.title = gameName;
document.querySelector("#title")!.textContent = gameName;

const sunLevelText = document.createElement("p");
app.appendChild(sunLevelText);
export const gridContainer = document.createElement("div");
app.appendChild(gridContainer);

function updateSunLevel() {
  gameGrid.sunLevel = Math.floor(Math.random() * 4);
  sunLevelText.textContent = `Sun Level: ${gameGrid.sunLevel}`;
}

const GRID_SIZE = 16;
export const gameGrid = new GameGrid(GRID_SIZE);
updateGame();

const buffer = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);

const passTimeButton = document.querySelector("#passTimeButton")!;
passTimeButton.addEventListener("click", () => {
  updateGame();
});

const serializeButton = document.querySelector("#serializeButton")!;
serializeButton.addEventListener("click", () => {
  serializeGrid(buffer);
});

const deserializeButton = document.querySelector("#deserializeButton")!;
deserializeButton.addEventListener("click", () => {
  deserializeGrid(buffer);
  gameGrid.renderGrid();
});

// Add event listener for keydown event for movement
document.addEventListener("keydown", (event) => {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const key = event.key;
  const plantKeys = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

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
  const x = gameGrid.player.highlightedX;
  const y = gameGrid.player.highlightedY;
  if (gameGrid != null) {
    gameGrid.harvestPlant(x, y);
  }
  updateGame();
}

function serializeCell(cell: PlantCell, window: Uint8Array) {
  window[0] = cell?.waterLevel!;
  window[1] = cell?.speciesIndex!;
  window[2] = cell?.growthLevel!;
}

function deserializeCell(cell: PlantCell, window: Uint8Array) {
  cell.waterLevel = window[0];
  if (window[1] == 0) {
    cell.speciesIndex = -1;
  } else {
    cell.speciesIndex = window[1];
    cell.growthLevel = window[2];
  }
}

function serializeGrid(buffer: ArrayBuffer) {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const currCell = gameGrid.cellAt(x, y);
      const window = new Uint8Array(buffer, (y * GRID_SIZE + x) * 3, 3);
      if (currCell?.hasPlant()) {
        console.log(currCell.hasPlant());
      }
      serializeCell(currCell!, window);
    }
  }
}

function deserializeGrid(buffer: ArrayBuffer) {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const currCell = gameGrid.cellAt(x, y);
      const window = new Uint8Array(buffer, (y * GRID_SIZE + x) * 3, 3);
      deserializeCell(currCell!, window);
    }
  }
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const currCell = gameGrid.cellAt(x, y);
      if (currCell?.hasPlant()) {
        console.log("deserialize: ", currCell.speciesIndex);
      }
    }
  }
}
