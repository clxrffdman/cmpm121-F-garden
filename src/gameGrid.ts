import { PlantCell } from "./plant";
import { gridContainer } from "./main";
import { Player } from "./player";
import i18n from "./languages";
import luck from "./luck";

const NUM_NEIGHBORS_PLANT_CANT_GROW = 4;
const WATER_SCALE = 1.5;
const MAX_WATER_LEVEL = 10;

interface Event {
  time: number;
  type: string;
}

export class GameGrid {
  private gridSize: number;
  private grid: PlantCell[];
  private gridBuffer: ArrayBuffer;
  public timeIndex = 0;
  public sunLevel = 0;
  public player: Player;
  private randomSeed: string = "";
  private events: Event[] = [];

  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.randomSeed = "";
    this.grid = [];
    this.gridBuffer = new ArrayBuffer(
      Math.pow(gridSize, 2) * PlantCell.numBytes,
    );
    this.player = new Player(2, 2);
    this.events = [];
    this.initializeGrid();
  }

  harvestPlant(x: number, y: number) {
    const currPlant = this.cellAt(x, y);
    if (currPlant) {
      this.player.reap(currPlant);
    }
  }

  isEmptyCell(x: number, y: number) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
      return false;
    }
    const growthLevel = this.cellAt(x, y)?.growthLevel;
    if (growthLevel != undefined && growthLevel > 0) {
      return false;
    }
    return true;
  }

  cellAt(x: number, y: number): PlantCell | undefined {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize)
      return undefined;
    return this.grid[y * this.gridSize + x];
  }

  update() {
    this.timeIndex++;

    for (const event in this.events) {
      console.log(event);
      // if(event.time == this.timeIndex){
      //   if(event.type == "harvest"){
      //     this.harvestPlant(this.player.x, this.player.y);
      //   }
      // }
    }

    this.updateWaterLevels();
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.updatePlants(this.cellAt(i, j)!, this.determineNumNeighbors(i, j));
      }
    }
    this.renderGrid();
  }

  updatePlants(cell: PlantCell, numNeighbors: number) {
    if (cell != undefined && cell.hasPlant()) {
      if (numNeighbors < NUM_NEIGHBORS_PLANT_CANT_GROW) {
        if (cell.growthLevel < cell.species!.maxGrowthLevel) {
          cell!.grow(cell.waterLevel, this.sunLevel);
        }
      }
    }
  }

  determineNumNeighbors(i: number, j: number): number {
    const DIRECTIONS = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];
    let numNeighbors = 0;
    for (const { dx, dy } of DIRECTIONS) {
      if (this.cellAt(i + dx, j + dy)?.hasPlant()) {
        numNeighbors++;
      }
    }
    return numNeighbors;
  }

  initializeGrid() {
    for (let i = 0; i < Math.pow(this.gridSize, 2); i++) {
      this.grid.push(
        new PlantCell(new DataView(this.gridBuffer, i * PlantCell.numBytes)),
      );
    }
  }

  updateWaterLevels() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        let waterLevel = this.cellAt(i, j)?.waterLevel;
        if (waterLevel == null) throw new Error("Water level is null");
        waterLevel += Math.floor(
          luck(
            this.timeIndex.toString() +
              i.toString() +
              j.toString() +
              this.randomSeed,
          ) * WATER_SCALE,
        );
        waterLevel =
          waterLevel > MAX_WATER_LEVEL ? MAX_WATER_LEVEL : waterLevel;
        this.cellAt(i, j)!.waterLevel = waterLevel;
      }
    }
  }


  cellClicked(x:number, y:number){
    console.log("clicked",x, y);
    console.log("player", this.player.x, this.player.y);
    if(x > this.player.x){
      if(x-this.player.x > 1){
        this.player.directionInput("ArrowRight");
      } else {
        if(this.cellAt(x,y)?.hasPlant()){
          this.harvestPlant(x, y);
        } else {
          this.plantPopUp(x,y);
        }
      }
    } else if (x < this.player.x){
      if(this.player.x - x > 1){
        this.player.directionInput("ArrowLeft");
      } else {
        if(this.cellAt(x,y)?.hasPlant()){
          this.harvestPlant(x, y);
        } else {
          this.plantPopUp(x,y);
        }
      }
    }
    if(y > this.player.y){
      if(y - this.player.y > 1){
        this.player.directionInput("ArrowDown");
      } else {
        if(this.cellAt(x,y)?.hasPlant()){
          this.harvestPlant(x, y);
        } else {
          this.plantPopUp(x,y);
        }
      }
    } else if (y < this.player.y){
      if(this.player.y - y > 1){
        this.player.directionInput("ArrowUp");
      } else {
        if(this.cellAt(x,y)?.hasPlant()){
          this.harvestPlant(x, y);
        } else {
          this.plantPopUp(x,y);
        }
      }
    }

    this.update();
  }

  plantPopUp(x:number, y:number){
    console.log("plant at:", x, y);
  }

  public renderGrid() {
    gridContainer.innerHTML = "";
    for (let y = 0; y < this.gridSize; y++) {
      const row = document.createElement("div");
      row.classList.add("row");

      for (let x = 0; x < this.gridSize; x++) {
        const cell = document.createElement("div");
        cell!.addEventListener('click', ()=> {
          this.cellClicked(x, y);
        });

        cell.classList.add("cell");
        const waterLevel = this.cellAt(x, y)!.waterLevel;
        const color = `hsl(${30 + waterLevel * 7}, 50%, 50%)`;
        cell.style.backgroundColor = color;

        const character = this.cellAt(x, y)?.curIcon;
        if (character) {
          const characterText = document.createElement("span");
          characterText.classList.add("character");
          characterText.textContent = character;
          cell.appendChild(characterText);
        }

        if (this.player.x == x && this.player.y == y) {
          const playerText = document.createElement("span");
          playerText.classList.add("character");
          playerText.textContent = this.player.character;
          cell.appendChild(playerText);
        }

        // Add tooltip
        cell.setAttribute(
          "title",
          `${i18n.t("waterLevel")} ${waterLevel}\n${i18n.t(
            "neighbors",
          )}${this.determineNumNeighbors(y, x)}`,
        );

        row.appendChild(cell);
      }

      gridContainer.appendChild(row);
    }
  }


  public loadScenario(scenario: any) {
    console.log("Loading scenario: " + scenario);
    this.player.x = scenario.startingConditions.playerPosition[0];
    this.player.y = scenario.startingConditions.playerPosition[1];
    this.sunLevel = scenario.startingConditions.sunLevel;
    this.randomSeed = scenario.randomSeed;

    this.timeIndex = 0;
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].waterLevel = 0;
    }
    this.updateWaterLevels();

    this.renderGrid();
  }

  private serializeCell(cell: PlantCell, window: Int8Array) {
    window[0] = cell?.waterLevel!;
    window[1] = cell?.speciesIndex!;
    window[2] = cell?.growthLevel!;
  }

  private deserializeCell(cell: PlantCell, window: Int8Array) {
    cell.waterLevel = window[0];
    if (window[1] == 0) {
      cell.speciesIndex = -1;
    } else {
      cell.speciesIndex = window[1];
      cell.growthLevel = window[2];
    }
  }

  public serializeGrid(buffer: ArrayBuffer) {
    const gridBuffer = new Int8Array(this.gridBuffer);
    const windowSize = 3;
    for (let i = 0; i < gridBuffer.length; i += windowSize) {
      const currCell = this.grid[Math.floor(i / windowSize)];
      const window = new Int8Array(buffer, i, windowSize);
      this.serializeCell(currCell, window);
    }
  }

  public deserializeGrid(buffer: ArrayBuffer) {
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const currCell = this.cellAt(x, y);
        const window = new Int8Array(buffer, (y * this.gridSize + x) * 3, 3);
        this.deserializeCell(currCell!, window);
      }
    }
  }
}
