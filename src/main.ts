import "./style.css";
import { GameGrid } from "./gameGrid";
import { Player } from "./player";

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

// const buffer = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);
class gameStateRecord {
  public playerJson: string;
  public gridBuffer: ArrayBuffer;

  constructor() {
    this.playerJson = JSON.stringify(gameGrid.player);
    this.gridBuffer = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);
    gameGrid.serializeGrid(this.gridBuffer);
  }

  public loadGame() {
    gameGrid.deserializeGrid(this.gridBuffer);
    gameGrid.player = Player.loadFromSerialized(this.playerJson);
  }
}

class saveGame {
  public playerJson: string;
  public gridBuffer: ArrayBuffer;
  public undoStateList: gameStateRecord[];
  public redoStateList: gameStateRecord[];

  constructor() {
    this.playerJson = JSON.stringify(gameGrid.player);
    this.gridBuffer = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);
    gameGrid.serializeGrid(this.gridBuffer);
    this.undoStateList = [...undoStateList];
    this.redoStateList = [...redoStateList];
  }

  public loadGame() {
    gameGrid.deserializeGrid(this.gridBuffer);
    gameGrid.player = Player.loadFromSerialized(this.playerJson);
    undoStateList = [...this.undoStateList];
    redoStateList = [...this.redoStateList];
  }
}

let undoStateList: gameStateRecord[] = [];
let redoStateList: gameStateRecord[] = [];
let curSaveState: saveGame | null = null;

const passTimeButton = document.querySelector("#passTimeButton")!;
passTimeButton.addEventListener("click", () => {
  updateGame();
});

const saveButton = document.querySelector("#saveButton")!;
saveButton.addEventListener("click", () => {
  curSaveState = new saveGame();
});

const loadButton = document.querySelector("#loadButton")!;
loadButton.addEventListener("click", () => {
  if (curSaveState) {
    curSaveState.loadGame();
    gameGrid.renderGrid();
  }
});

function addToUndoList() {
  const curState = new gameStateRecord();
  undoStateList.push(curState);
}

const undoButton = document.querySelector("#undoButton")!;
undoButton.addEventListener("click", () => {
  if (undoStateList.length == 0) return;
  redoStateList.push(new gameStateRecord());
  const newState = undoStateList.pop();
  if (newState) {
    newState.loadGame();
    gameGrid.renderGrid();
  }
});

const redoButton = document.querySelector("#redoButton")!;
redoButton.addEventListener("click", () => {
  if (redoStateList.length == 0) return;
  undoStateList.push(new gameStateRecord());
  const newState = redoStateList.pop();
  if (newState) {
    newState.loadGame();
    gameGrid.renderGrid();
  }
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
  addToUndoList();
  redoStateList.length = 0;
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
  redoStateList.length = 0;
  const x = gameGrid.player.highlightedX;
  const y = gameGrid.player.highlightedY;
  if (gameGrid != null) {
    gameGrid.harvestPlant(x, y);
  }
  updateGame();
}
