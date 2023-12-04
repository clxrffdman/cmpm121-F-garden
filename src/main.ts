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

const GRID_SIZE = 4;
export const gameGrid = new GameGrid(GRID_SIZE);
updateGame();

class gameStateRecord {
  public playerJson: string;
  public gridBuffer: string;

  constructor() {
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    this.playerJson = JSON.stringify(gameGrid.player);
    const newBuff = new ArrayBuffer(GRID_SIZE * GRID_SIZE * 3);
    gameGrid.serializeGrid(newBuff);
    const dec = new TextDecoder("utf-8");

    this.gridBuffer = dec.decode(newBuff);
    console.log("Decoding Buffer in gameStateRecord");
    console.log(this.gridBuffer);
    console.log(this.playerJson);
  }

  public loadGame() {
    const enc = new TextEncoder();
    const newBuff = enc.encode(this.gridBuffer).buffer;

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

    // const enc = new TextDecoder("utf-8");
    // const window = new Uint8Array(newBuff, 0, newBuff.byteLength);
    // this.gridBuffer = enc.decode(window);

    const bytes = new Int8Array(newBuff);
    this.gridBuffer = bytes.reduce(
      (str, byte) => str + String.fromCharCode(byte),
      "",
    );

    console.log("Decoding Buffer in SaveGame");
    console.log(this.gridBuffer);
    console.log(this.playerJson);
    this.undoStateList = [...undoStateList];
    this.redoStateList = [...redoStateList];
  }

  public loadGame() {
    console.log("loading");
    // const enc = new TextEncoder();

    console.log(gameGrid);
    // gameGrid.deserializeGrid(enc.encode(this.gridBuffer).buffer);
    gameGrid.deserializeGrid(
      Int8Array.from(Array(this.gridBuffer.length), (_, i) =>
        this.gridBuffer.charCodeAt(i),
      ),
    );
    gameGrid.player = Player.loadFromSerialized(this.playerJson);
    undoStateList = [...this.undoStateList];
    redoStateList = [...this.redoStateList];
  }
}

let undoStateList: gameStateRecord[] = [];
let redoStateList: gameStateRecord[] = [];
let curSaveState1: saveGame | null = null;
let curSaveState2: saveGame | null = null;
let autoSaveState: saveGame | null = null;

const passTimeButton = document.querySelector("#passTimeButton")!;
passTimeButton.addEventListener("click", () => {
  updateGame();
});

setInterval(function () {
  autoSaveState = new saveGame();
  localStorage.setItem("autoSave", JSON.stringify(autoSaveState));
}, 5 * 1000);

const localAutoSave = localStorage.getItem("autoSave");

if (localAutoSave) {
  const help = confirm(
    "It looks like you have previous save data, do you want to continue from it?",
  );
  if (help) {
    const dude: saveGame = JSON.parse(localAutoSave) as saveGame;
    const dude2 = new saveGame();
    dude2.playerJson = dude.playerJson;
    dude2.gridBuffer = dude.gridBuffer;
    dude2.redoStateList = dude.redoStateList;
    dude2.undoStateList = dude.undoStateList;
    dude2.loadGame();
    gameGrid.renderGrid();
  }
}

const resetButton = document.querySelector("#reset")!;
resetButton.addEventListener("click", () => {
  const reset = confirm("Reset All Data?");
  if (reset) {
    localStorage.clear();
    location.reload();
  }
});

const saveButton1 = document.querySelector("#saveButton1")!;
saveButton1.addEventListener("click", () => {
  curSaveState1 = new saveGame();
});

const loadButton1 = document.querySelector("#loadButton1")!;
loadButton1.addEventListener("click", () => {
  if (curSaveState1) {
    curSaveState1.loadGame();
    gameGrid.renderGrid();
  }
});

const saveButton2 = document.querySelector("#saveButton2")!;
saveButton2.addEventListener("click", () => {
  curSaveState2 = new saveGame();
});

const loadButton2 = document.querySelector("#loadButton2")!;
loadButton2.addEventListener("click", () => {
  if (curSaveState2) {
    curSaveState2.loadGame();
    gameGrid.renderGrid();
  }
});

const loadAutoSaveButton = document.querySelector("#loadAutoSaveButton")!;
loadAutoSaveButton.addEventListener("click", () => {
  if (autoSaveState) {
    autoSaveState.loadGame();
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
