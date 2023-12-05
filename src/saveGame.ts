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

    this.gridBuffer = _arrayBufferToBase64(newBuff);

    console.log("Decoding Buffer in SaveGame");
    console.log(this.gridBuffer);
    console.log(this.playerJson);
    this.undoStateList = [...undoStateList];
    this.redoStateList = [...redoStateList];
  }

  public loadGame() {
    console.log("loading");

    console.log(gameGrid);
    gameGrid.deserializeGrid(_base64ToArrayBuffer(this.gridBuffer));
    gameGrid.player = Player.loadFromSerialized(this.playerJson);
    undoStateList = [...this.undoStateList];
    redoStateList = [...this.redoStateList];
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
