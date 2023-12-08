import { gameGrid, GRID_SIZE, addClickListener } from "./main"; // Adjust the import path as needed
import { Player } from "./player";
import i18n from "./languages";

export let undoStateList: gameStateRecord[] = [];
export let redoStateList: gameStateRecord[] = [];
let curSaveState: saveGame | null = null;
let autoSaveState: saveGame | null = null;
let saveNumber: number = 1;

export class gameStateRecord {
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

export class saveGame {
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

//Source: https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
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

const localAutoSave = localStorage.getItem("autoSave");

setTimeout(() => {
  if (localAutoSave) {
    const help = confirm(i18n.t("autosaveDetected"));
    if (help) {
      const save: saveGame = JSON.parse(localAutoSave) as saveGame;
      const save2 = new saveGame();
      Object.assign(save2, save);
      save2.loadGame();
      gameGrid.renderGrid();
    }
  }
}, 0);

setInterval(function () {
  autoSaveState = new saveGame();
  localStorage.setItem("autoSave", JSON.stringify(autoSaveState));
}, 5 * 1000);

addClickListener("#saveButton1", () => {
  curSaveState = new saveGame();
  addButton(curSaveState);
});

addClickListener("#loadAutoSaveButton", () => {
  if (autoSaveState) {
    autoSaveState.loadGame();
  }
});

addClickListener("#reset", () => {
  const reset = confirm(i18n.t("resetAll"));
  if (reset) {
    localStorage.clear();
    location.reload();
  }
});

export function addToUndoList() {
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
    gameGrid.renderGrid();
  }
});

addClickListener("#redoButton", () => {
  if (redoStateList.length == 0) return;
  undoStateList.push(new gameStateRecord());
  const newState = redoStateList.pop();
  if (newState) {
    newState.loadState();
    gameGrid.renderGrid();
  }
});

function addButton(saveState: saveGame) {
  const loadButton = document.createElement("button") as HTMLElement;
  const buttons: HTMLDivElement = document.querySelector("#loadSaves")!;
  const text: string = "Load Save: " + saveNumber;
  saveNumber++;
  loadButton.innerHTML = text;
  loadButton.setAttribute(
    "style",
    "margin:auto; background-color: #777;color: black;cursor: pointer;padding: 10px;width: auto;border: 2px solid #666;text-align: center;outline: none;font-size: 15px;border-radius: 10px;",
  );
  buttons.append(loadButton);
  loadButton.addEventListener("click", () => {
    saveState.loadGame();
  });
}

export function updateButtonsVisual() {
  const savesDiv = document.getElementById("loadSaves");
  if (savesDiv) {
    const children = savesDiv.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const match = child.innerHTML.match(/\d+$/);
      const num = match ? parseInt(match[0], 10) : null;

      child.innerHTML = i18n.t("loadSave") + num;
    }
  }
}
