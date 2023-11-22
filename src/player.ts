import { GameGrid } from "./gameGrid";
import { gameGrid } from "./main";

export class Player {
  /*TODO:
    - Interaction
    - Inventory (later)
    */
  x: number;
  y: number;
  private gameGrid: GameGrid;
  private highlightedX: number;
  private highlightedY: number;
  public character: string;
  private lastInput: string;

  constructor(x: number, y: number, grid: GameGrid) {
    this.x = x;
    this.y = y;
    this.gameGrid = grid;
    this.highlightedX = 1;
    this.highlightedY = 0;
    this.character = ">";
    this.lastInput = "ArrowRight";
  }

  move(dir: string) {
    let newX = this.x;
    let newY = this.y;
    if (dir == "ArrowUp") newY--;
    else if (dir == "ArrowDown") newY++;
    else if (dir == "ArrowLeft") newX--;
    else if (dir == "ArrowRight") newX++;

    if (this.gameGrid.isValidPosition(newX, newY)) {
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
    const isValid = this.gameGrid.isValidPosition(
      this.highlightedX,
      this.highlightedY,
    );
    console.log(isValid);
    if (isValid) {
      this.move(dir);
    }
  }

  changePlayerOrientation(key: string) {
    this.lastInput = key;
    const dirData: { [k: string]: [string, [number, number]] } = {
      //In the format "key: [Character, [x, y]]"
      ArrowUp: ["^", [0, -1]],
      ArrowDown: ["v", [0, 1]],
      ArrowLeft: ["<", [-1, 0]],
      ArrowRight: [">", [1, 0]],
    };
    this.character = dirData[key][0];
    this.highlightedX = this.x + dirData[key][1][0];
    this.highlightedY = this.y + dirData[key][1][1];
  }

  renderPlayer() {
    gameGrid;
  }
}
