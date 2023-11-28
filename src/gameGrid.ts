import { Plant, makePlant } from "./plant";
import { gridContainer } from "./main";
import { Player } from "./player";
import luck from "./luck";

const NUM_NEIGHBORS_PLANT_CANT_GROW = 4;
const WATER_SCALE = 1.1;

export interface plantCell {
  waterLevel: number;
  plant: Plant | undefined;
}

export class GameGrid {
  private gridSize: number;
  private grid: plantCell[][];
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

  plantSeeds(x: number, y: number, plant: string) {
    this.grid[y][x].plant = makePlant(plant);
  }

  harvestPlant(y: number, x: number) {
    console.log("harvest plant");
    if (this.grid[x][y].plant) {
      const currPlant = this.grid[x][y].plant;
      this.player.reap(currPlant!);
      this.grid[x][y].plant = undefined;
    }
  }

  isValidPosition(x: number, y: number) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
      console.log("Out of bounds, ", x, y);
      return false;
    }
    if (
      this.grid[y][x].plant?.growthLevel == 1 ||
      this.grid[y][x].plant?.growthLevel == 2 ||
      this.grid[y][x].plant?.growthLevel == 3
    ) {
      return false;
    }
    return true;
  }

  cellAt(x: number, y: number): plantCell | undefined {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize)
      return undefined;
    return this.grid[y]?.at(x);
  }

  update() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid[i][j];
        if (cell.plant) {
          console.log(cell.plant);
          const numNeighbors = this.determineNumNeighbors(i, j);
          if (numNeighbors < NUM_NEIGHBORS_PLANT_CANT_GROW)
            console.log("neighbors");
          if (cell.plant.growthLevel < cell.plant.species.maxGrowthLevel) {
            console.log("can grow");
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
    if (this.cellAt(j, i - 1)?.plant) {
      numNeighbors++;
    }
    if (this.cellAt(j + 1, i)?.plant) {
      numNeighbors++;
    }
    if (this.cellAt(j, i + 1)?.plant) {
      numNeighbors++;
    }
    if (this.cellAt(j - 1, i)?.plant) {
      numNeighbors++;
    }
    return numNeighbors;
  }

  initializeGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize; j++) {
        row.push({ waterLevel: 0, plant: undefined });
      }
      this.grid.push(row);
    }
  }

  updateWaterLevels() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        let waterLevel = this.grid[i][j].waterLevel;
        waterLevel += Math.floor(
          luck(this.timeIndex.toString() + i.toString() + j.toString()) *
            WATER_SCALE,
        );
        if (waterLevel > this.maxWaterLevel) {
          waterLevel = this.maxWaterLevel;
        }
        this.grid[i][j].waterLevel = waterLevel;
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

        const character = this.grid[i][j].plant?.curIcon;
        if (character) {
          const characterText = document.createElement("span");
          characterText.setAttribute(
            "style",
            "font-size: 14px; align-self: center;",
          );
          characterText.textContent = character;
          cell.appendChild(characterText);
        }

        if (this.player.x == j && this.player.y == i) {
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
            i,
            j,
          )}`,
        );

        row.appendChild(cell);
      }

      gridContainer.appendChild(row);
    }
  }
}
