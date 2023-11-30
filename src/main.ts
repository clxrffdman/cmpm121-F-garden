import "./style.css";
import { GameGrid, plantCell } from "./gameGrid";
import { plantSpeciesArray, makePlant } from "./plant";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "121 Group 7 Garden Game - F0";
document.title = gameName;
const header = document.createElement("h1");
header.textContent = gameName;
app.append(header);

const sunLevelText = document.createElement("p");
app.appendChild(sunLevelText);
export const gridContainer = document.createElement("div");
// gridContainer.classList.add("grid-container"); //Don't have this yet
app.appendChild(gridContainer);

function updateSunLevel() {
  gameGrid.sunLevel = Math.floor(Math.random() * 4);
  sunLevelText.textContent = `Sun Level: ${gameGrid.sunLevel}`;
}

const GRID_SIZE = 16;
export const gameGrid = new GameGrid(GRID_SIZE);
updateGame();

const buffer = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);

const passTimeButton = document.createElement("button");
passTimeButton.textContent = "Pass Time";
passTimeButton.addEventListener("click", () => {
  updateGame();
});
app.appendChild(passTimeButton);

const serializeButton = document.createElement("button");
serializeButton.textContent = "serialize";
serializeButton.addEventListener("click", () => {
  serializeGrid(buffer);
});
app.appendChild(serializeButton);

const deserializeButton = document.createElement("button");
deserializeButton.textContent = "deserialize";
deserializeButton.addEventListener("click", () => {
  deserializeGrid(buffer);
  updateGame();
});
app.appendChild(deserializeButton);

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
  const letterToPlantMap: { [key: string]: string } = {
    a: "apple",
    b: "banana",
    c: "carrot",
    d: "daikon",
    e: "eggplant",
    f: "fig",
    g: "grape",
    h: "horse_raddish",
    i: "indonesian_lime",
    j: "jackfruit",
    k: "kiwi",
    l: "lemon",
    m: "maize",
    n: "nectarine",
    o: "orange",
    p: "potato",
    q: "quince",
    r: "raddish",
    s: "squash",
    t: "tomato",
    u: "ugni",
    v: "vanilla",
    w: "watermelon",
    x: "xigua",
    y: "yam",
    z: "zuccini",
  };

  if (arrowKeys.includes(key)) {
    gameGrid.player.directionInput(key);
    updateSunLevel();
    gameGrid.update();
  }

  if (plantKeys.includes(key)) {
    placePlant(letterToPlantMap[key]);
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

function placePlant(plant: string) {
  if (
    gameGrid != null &&
    gameGrid.cellAt(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
    ) &&
    !gameGrid.cellAt(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
    )!.plant
  ) {
    gameGrid.plantSeeds(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
      plant,
    );
    updateGame();
  }
}

function harvest() {
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
  ) {
    if (
      gameGrid.cellAt(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      )?.plant
    ) {
      gameGrid.harvestPlant(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      );
    }
    updateGame();
  }
}

function serializeCell(cell: plantCell, window: Uint8Array) {
  const currCell = cell;
  const waterLevel = currCell?.waterLevel;
  let species: number;
  plantSpeciesArray.indexOf(currCell?.plant?.species?.name!) == -1
    ? (species = 0)
    : (species = plantSpeciesArray.indexOf(currCell?.plant?.species?.name!));
  const growthLevel = currCell?.plant?.growthLevel;
  window[0] = waterLevel!;
  window[1] = species;
  window[2] = growthLevel!;
}

function deserializeCell(cell: plantCell, window: Uint8Array) {
  const currCell = cell;
  currCell.waterLevel = window[0];
  if (window[1] == 0) {
    currCell.plant = undefined;
  } else {
    currCell.plant = makePlant(plantSpeciesArray[window[1]]);
    currCell.plant!.deserialize(window[2]);
  }
}

function serializeGrid(buffer: ArrayBuffer) {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const currCell = gameGrid.cellAt(x, y);
      const window = new Uint8Array(buffer, (y * GRID_SIZE + x) * 3, 3);
      if (currCell?.plant) {
        console.log(currCell.plant);
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
      if (currCell?.plant) {
        console.log("deserialize: ", currCell.plant);
      }
    }
  }
}
