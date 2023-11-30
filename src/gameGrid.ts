import { Plant } from "./plant";
import { gridContainer } from "./main";
import { Player } from "./player";
import luck from "./luck";

const NUM_NEIGHBORS_PLANT_CANT_GROW = 4;
const WATER_SCALE = 1.5;

export interface plantCell {
  waterLevel: number;
  plant: Plant | undefined;
}

export class GameGrid {
  private gridSize: number;
  private grid: plantCell[];
  public timeIndex = 0;
  public sunLevel = 0;
  public player: Player;
  maxWaterLevel = 10;

  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.grid = [];
    this.player = new Player(2, 2, this);
    this.initializeGrid();
  }

  harvestPlant(x: number, y: number) {
    const currPlant = this.cellAt(x, y)?.plant;
    if (currPlant) {
      this.player.reap(currPlant);
      this.cellAt(x, y)!.plant = undefined;
    }
  }

  isEmptyCell(x: number, y: number) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
      console.log("Out of bounds, ", x, y);
      return false;
    }
    const growthLevel = this.cellAt(x, y)?.plant?.growthLevel;
    if (growthLevel != undefined && growthLevel > 0) {
      return false;
    }
    return true;
  }

  cellAt(x: number, y: number): plantCell | undefined {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize)
      return undefined;
    return this.grid[y * this.gridSize + x];
  }

  update() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.cellAt(i, j);
        if (cell?.plant) {
          const numNeighbors = this.determineNumNeighbors(i, j);
          if (numNeighbors < NUM_NEIGHBORS_PLANT_CANT_GROW)
            if (cell.plant.growthLevel < cell.plant.species.maxGrowthLevel) {
              cell.plant!.grow(cell.waterLevel, this.sunLevel);
            }
        }
      }
    }
    this.updateWaterLevels();
    this.renderGrid();
    this.timeIndex++;
  }

  determineNumNeighbors(i: number, j: number): number {
    let numNeighbors = 0;
    if (this.cellAt(i - 1, j)?.plant) {
      numNeighbors++;
    }
    if (this.cellAt(i, j + 1)?.plant) {
      numNeighbors++;
    }
    if (this.cellAt(i + 1, j)?.plant) {
      numNeighbors++;
    }
    if (this.cellAt(i, j - 1)?.plant) {
      numNeighbors++;
    }
    return numNeighbors;
  }

  initializeGrid() {
    for (let i = 0; i < Math.pow(this.gridSize, 2); i++) {
      this.grid.push({ waterLevel: 0, plant: undefined });
    }
  }

  updateWaterLevels() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        let waterLevel = this.cellAt(i, j)?.waterLevel;
        if (waterLevel == null) throw new Error("Water level is null");
        waterLevel += Math.floor(
          luck(this.timeIndex.toString() + i.toString() + j.toString()) *
            WATER_SCALE,
        );
        if (waterLevel > this.maxWaterLevel) {
          waterLevel = this.maxWaterLevel;
        }
        this.cellAt(i, j)!.waterLevel = waterLevel;
      }
    }
  }

  public renderGrid() {
    gridContainer.innerHTML = "";
    for (let y = 0; y < this.gridSize; y++) {
      const row = document.createElement("div");
      row.setAttribute("style", "display: flex; flex-direction: row;");

      for (let x = 0; x < this.gridSize; x++) {
        const cell = document.createElement("div");
        const waterLevel = this.cellAt(x, y)!.waterLevel;
        const color = `hsl(${30 + waterLevel * 7}, 50%, 50%)`;
        cell.setAttribute(
          "style",
          `background-color: ${color}; width: 30px; height: 30px;`,
        );

        const character = this.cellAt(x, y)?.plant?.curIcon;
        if (character) {
          const characterText = document.createElement("span");
          characterText.setAttribute(
            "style",
            "font-size: 14px; align-self: center;",
          );
          characterText.textContent = character;
          cell.appendChild(characterText);
        }

        if (this.player.x == x && this.player.y == y) {
          const playerText = document.createElement("span");
          playerText.setAttribute(
            "style",
            "font-size: 14px; align-self: center;",
          );
          playerText.textContent = this.player.character;
          cell.appendChild(playerText);
        }

        // Add tooltip
        cell.setAttribute(
          "title",
          `Water Level: ${waterLevel}\nNeighbors:${this.determineNumNeighbors(
            y,
            x,
          )}`,
        );

        row.appendChild(cell);
      }

      gridContainer.appendChild(row);
    }
  }
}
