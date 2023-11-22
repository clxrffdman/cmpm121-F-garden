import { GameGrid } from "./gameGrid";
import { gameGrid } from "./main";

export class Player {
  /*reqs

    - Movement
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
    switch (key) {
      case "ArrowUp":
        this.character = "^";
        this.highlightedX = this.x;
        this.highlightedY = this.y - 1;
        break;
      case "ArrowDown":
        this.character = "v";
        this.highlightedX = this.x;
        this.highlightedY = this.y + 1;
        break;
      case "ArrowLeft":
        this.character = "<";
        this.highlightedX = this.x - 1;
        this.highlightedY = this.y;
        break;
      case "ArrowRight":
        this.character = ">";
        this.highlightedX = this.x + 1;
        this.highlightedY = this.y;
        break;
      default:
        return;
    }
  }

  renderPlayer() {
    gameGrid;
  }
}
