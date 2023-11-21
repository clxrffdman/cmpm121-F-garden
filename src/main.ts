import "./style.css";
const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "121 Group 7 Garden Game";
document.title = gameName;
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const gridContainer = document.createElement("div");
// gridContainer.classList.add("grid-container"); //Don't have this yet
app.appendChild(gridContainer);

interface plantCell {
  sunLevel: number;
  waterLevel: number;
  character: string;
}

class GameGrid {
  private gridSize: number;
  private grid: plantCell[][];

  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.grid = [];
  }

  update() {
    gameGrid.updateSunLevels();
    gameGrid.updateWaterLevels();
    gameGrid.renderGrid();
  }

  initializeGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize; j++) {
        row.push({ sunLevel: 0, waterLevel: 0, character: "🌱" });
      }
      this.grid.push(row);
    }
  }

  updateSunLevels() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j].sunLevel = Math.floor(Math.random() * 10);
      }
    }
  }

  updateWaterLevels() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j].waterLevel += Math.floor(Math.random() * 10);
      }
    }
  }

  renderGrid() {
    gridContainer.innerHTML = "";
    for (let i = 0; i < this.gridSize; i++) {
      const row = document.createElement("pre");
      row.setAttribute("style", "display: flex; flex-direction: row;");

      for (let j = 0; j < this.gridSize; j++) {
        const cell = document.createElement("pre");
        cell.textContent = this.grid[i][j].character;
        row.appendChild(cell);
      }

      gridContainer.appendChild(row);
    }
  }
}

const gridSize = 5;
const gameGrid = new GameGrid(gridSize);
gameGrid.initializeGrid();
gameGrid.update();
gameGrid.renderGrid();

const passTimeButton = document.createElement("button");
passTimeButton.textContent = "Pass Time";
passTimeButton.addEventListener("click", () => {
  gameGrid.update();
});

app.appendChild(passTimeButton);
