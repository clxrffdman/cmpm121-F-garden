import { gameGrid } from "./main";
import { PlantCell } from "./plant";

export interface SavedPlayer {
  x: number;
  y: number;
  money: number;
  lastInput: string;
}

export class Player {
  /*TODO:
    - Interaction
    - Inventory (later)
    */
  public money: number;
  public x: number;
  public y: number;
  public highlightedX: number;
  public highlightedY: number;
  public lastInput: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.highlightedX = x + 1;
    this.highlightedY = y;
    this.directionInput("ArrowRight");
    this.lastInput = "ArrowRight";
    this.money = 0;
  }

  public get character(): string {
    return dirData[this.lastInput][0];
  }

  move(dir: string) {
    let newX = this.x;
    let newY = this.y;
    if (dir == "ArrowUp") newY--;
    else if (dir == "ArrowDown") newY++;
    else if (dir == "ArrowLeft") newX--;
    else if (dir == "ArrowRight") newX++;

    if (gameGrid.isEmptyCell(newX, newY)) {
      this.x = newX;
      this.y = newY;
      this.changePlayerOrientation(dir);
      this.renderPlayer();
    }
  }

  directionInput(dir: string) {
    if (this.lastInput != dir) {
      this.changePlayerOrientation(dir);
      return;
    }
    const isValid = gameGrid.isEmptyCell(this.highlightedX, this.highlightedY);
    if (isValid) {
      this.move(dir);
    }
  }

  changePlayerOrientation(key: string) {
    this.lastInput = key;
    this.highlightedX = this.x + dirData[key][1][0];
    this.highlightedY = this.y + dirData[key][1][1];
  }

  renderPlayer() {
    gameGrid;
  }

  reap(plant: PlantCell) {
    const crop = plant.harvest();
    if (crop) {
      this.money += crop.value;
    }
    console.log("player money: ", this.money);
  }

  setPosition(newX: number, newY: number) {
    if (gameGrid.isEmptyCell(newX, newY)) {
      this.x = newX;
      this.y = newY;
      this.renderPlayer();
    }
  }

  serialize() {
    const serializedPlayerState: SavedPlayer = {
      x: this.x,
      y: this.y,
      money: this.money,
      lastInput: this.lastInput,
    };
    const serializedPlayerString = JSON.stringify(serializedPlayerState);
    console.log(serializedPlayerString);
    return serializedPlayerString;
  }

  static loadFromSerialized(json: string) {
    const p: SavedPlayer = JSON.parse(json);

    const player = new Player(p.x, p.y);
    player.lastInput = p.lastInput;
    player.highlightedX = player.x + dirData[player.lastInput][1][0];
    player.highlightedY = player.y + dirData[player.lastInput][1][1];
    player.money = p.money;
    return player;
  }
}

const dirData: { [k: string]: [string, [number, number]] } = {
  //In the format "key: [Character, [x, y]]"
  ArrowUp: ["^", [0, -1]],
  ArrowDown: ["v", [0, 1]],
  ArrowLeft: ["<", [-1, 0]],
  ArrowRight: [">", [1, 0]],
};
