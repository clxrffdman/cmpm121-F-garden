import { Player } from "./player";
import {
  gameStateRecord,
  gameGrid,
  GRID_SIZE,
  undoStateList,
  redoStateList,
} from "./main";

export class saveGame {
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
