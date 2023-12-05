import "./style.css";
import { GameGrid } from "./gameGrid";
import { Player } from "./player";

const gameName = "121 Group 7 Garden Game";
document.title = gameName;
document.querySelector("#title")!.textContent = gameName;

export const gridContainer = document.querySelector("#game")!;

const sunLevelText = document.querySelector("#sunLevelText")!;
function updateSunLevel() {
  gameGrid.sunLevel = Math.floor(Math.random() * 4);
  sunLevelText.textContent = `Sun Level: ${gameGrid.sunLevel}`;
}

const GRID_SIZE = 16;
export const gameGrid = new GameGrid(GRID_SIZE);
updateGame();

class gameStateRecord {
  public playerJson: string;
  public gridBuffer: string;

  constructor() {
    this.playerJson = JSON.stringify(gameGrid.player);
    const newBuff = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);
    gameGrid.serializeGrid(newBuff);

    this.gridBuffer = _arrayBufferToBase64(newBuff);
  }

  public loadState() {
    const newBuff = _base64ToArrayBuffer(this.gridBuffer);

    gameGrid.deserializeGrid(newBuff);
    gameGrid.player = Player.loadFromSerialized(this.playerJson);
  }
}

class saveGame {
  public playerJson: string;
  public gridBuffer: string;
  public undoStateList: gameStateRecord[];
  public redoStateList: gameStateRecord[];

  constructor() {
    this.playerJson = JSON.stringify(gameGrid.player);
    const newBuff = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);
    gameGrid.serializeGrid(newBuff);

    this.gridBuffer = _arrayBufferToBase64(newBuff);

    console.log("Saving");
    this.undoStateList = [...undoStateList];
    this.redoStateList = [...redoStateList];
  }

  public loadGame() {
    console.log("Loading");
    gameGrid.deserializeGrid(_base64ToArrayBuffer(this.gridBuffer));
    gameGrid.player = Player.loadFromSerialized(this.playerJson);
    undoStateList = [...this.undoStateList];
    redoStateList = [...this.redoStateList];
    gameGrid.renderGrid();
  }
}

function _arrayBufferToBase64(buffer: ArrayBuffer) {
  const base64 = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    ),
  );
  return base64;
}

function _base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

let undoStateList: gameStateRecord[] = [];
let redoStateList: gameStateRecord[] = [];
let curSaveState1: saveGame | null = null;
let curSaveState2: saveGame | null = null;
let autoSaveState: saveGame | null = null;

function addClickListener(buttonId: string, handler: () => void) {
  const button = document.querySelector(buttonId);
  button?.addEventListener("click", handler);
}

setInterval(function () {
  autoSaveState = new saveGame();
  localStorage.setItem("autoSave", JSON.stringify(autoSaveState));
}, 5 * 1000);

const localAutoSave = localStorage.getItem("autoSave");

if (localAutoSave) {
  const help = confirm("Autosave detected, do you want to continue from it?");
  if (help) {
    const save: saveGame = JSON.parse(localAutoSave) as saveGame;
    const save2 = new saveGame();
    Object.assign(save2, save);
    save2.loadGame();
    gameGrid.renderGrid();
  }
}

addClickListener("#passTimeButton", () => {
  updateGame();
});

addClickListener("#reset", () => {
  const reset = confirm("Reset All Data?");
  if (reset) {
    localStorage.clear();
    location.reload();
  }
});

addClickListener("#saveButton1", () => {
  curSaveState1 = new saveGame();
});

addClickListener("#loadButton1", () => {
  if (curSaveState1) {
    curSaveState1.loadGame();
  }
});

addClickListener("#saveButton2", () => {
  curSaveState2 = new saveGame();
});

addClickListener("#loadButton2", () => {
  if (curSaveState2) {
    curSaveState2.loadGame();
  }
});

addClickListener("#loadAutoSaveButton", () => {
  if (autoSaveState) {
    autoSaveState.loadGame();
  }
});

function addToUndoList() {
  const curState = new gameStateRecord();
  undoStateList.push(curState);
  redoStateList.length = 0;
}

addClickListener("#undoButton", () => {
  if (undoStateList.length == 0) return;
  redoStateList.push(new gameStateRecord());
  const newState = undoStateList.pop();
  if (newState) {
    newState.loadState();
  }
});

addClickListener("#redoButton", () => {
  if (redoStateList.length == 0) return;
  undoStateList.push(new gameStateRecord());
  const newState = redoStateList.pop();
  if (newState) {
    newState.loadState();
  }
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
