import { Plant, makePlant } from "./plant";
import { gridContainer } from "./main";
import { Player } from "./player";

const NUM_NEIGHBORS_PLANT_CANT_GROW = 4;

export interface plantCell {
  waterLevel: number;
  plant: Plant | undefined;
}

export class GameGrid {
  private gridSize: number;
  private grid: plantCell[][];
  public sunLevel = 0;
  public player: Player;
  maxWaterLevel = 10;

  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.grid = [];
    this.player = new Player(0, 0, this);
    this.initializeGrid();
  }

  isValidPosition(x: number, y: number) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
      console.log("Out of bounds, ", x, y);
      return false;
    }
    // if (this.grid[y][x].plant != undefined) {
    //   return false;
    // }
    return true;
  }

  update() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid[i][j];
        if (cell.plant) {
          const numNeighbors = this.determineNumNeighbors(i, j);
          if (numNeighbors < NUM_NEIGHBORS_PLANT_CANT_GROW)
            cell.plant!.grow(cell.waterLevel, this.sunLevel);
        }
      }
    }
    this.updateWaterLevels();
    this.renderGrid();
  }

  determineNumNeighbors(i: number, j: number): number {
    let numNeighbors = 0;
    if (this.grid[i + 1]) {
      if (this.grid[i + 1][j].plant) {
        numNeighbors++;
      }
    }
    if (this.grid[i][j + 1]) {
      if (this.grid[i][j + 1].plant) {
        numNeighbors++;
      }
    }
    if (this.grid[i - 1]) {
      if (this.grid[i - 1][j].plant) {
        numNeighbors++;
      }
    }
    if (this.grid[i][j - 1]) {
      if (this.grid[i][j - 1].plant) {
        numNeighbors++;
      }
    }
    return numNeighbors;
  }

  initializeGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize; j++) {
        row.push({ waterLevel: 0, plant: makePlant("carrot") });
      }
      this.grid.push(row);
    }
  }

  updateWaterLevels() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j].waterLevel += Math.floor(Math.random() * 5);
        if (this.grid[i][j].waterLevel > this.maxWaterLevel) {
          this.grid[i][j].waterLevel = this.maxWaterLevel;
        }
      }
    }
  }

  renderGrid() {
    gridContainer.innerHTML = "";
    for (let i = 0; i < this.gridSize; i++) {
      const row = document.createElement("div");
      row.setAttribute("style", "display: flex; flex-direction: row;");

      for (let j = 0; j < this.gridSize; j++) {
        const cell = document.createElement("div");
        const waterLevel = this.grid[i][j].waterLevel;
        const color = `hsl(${30 + waterLevel * 7}, 50%, 50%)`;
        cell.setAttribute(
          "style",
          `background-color: ${color}; width: 30px; height: 30px;`,
        );

        const character = this.grid[i][j].plant?.icon;
        if (character) {
          const characterText = document.createElement("span");
          characterText.setAttribute("style", "font-size: 14px;");
          characterText.textContent = character;
          cell.appendChild(characterText);
        }

        if (this.player.x == j && this.player.y == i) {
          const playerText = document.createElement("span");
          playerText.setAttribute("style", "font-size: 14px;");
          playerText.textContent = this.player.character;
          cell.appendChild(playerText);
        }

        // Add tooltip
        cell.setAttribute("title", `Water Level: ${waterLevel}`);

        row.appendChild(cell);
      }

      gridContainer.appendChild(row);
    }
  }
}
