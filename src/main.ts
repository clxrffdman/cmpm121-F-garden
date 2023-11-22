import "./style.css";
import { GameGrid } from "./gameGrid";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "121 Group 7 Garden Game - F0";
document.title = gameName;
const header = document.createElement("h1");
header.textContent = gameName;
app.append(header);

const sunLevelText = document.createElement("p");
app.appendChild(sunLevelText);
export const gridContainer = document.createElement("div");
// gridContainer.classList.add("grid-container"); //Don't have this yet
app.appendChild(gridContainer);

function updateSunLevel() {
  gameGrid.sunLevel = Math.floor(Math.random() * 3);
  sunLevelText.textContent = `Sun Level: ${gameGrid.sunLevel}`;
}

const gridSize = 5;
export const gameGrid = new GameGrid(gridSize);
gameGrid.update();
gameGrid.renderGrid();
updateSunLevel();

const passTimeButton = document.createElement("button");
passTimeButton.textContent = "Pass Time";
passTimeButton.addEventListener("click", () => {
  updateSunLevel();
  gameGrid.update();
});

app.appendChild(passTimeButton);

const carrotButton = document.createElement("button");
carrotButton.textContent = "Plant Carrot";
carrotButton.addEventListener("click", () => {
  console.log(
    gameGrid.cellAt(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
    )?.plant?.growthLevel,
  );
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
      ?.plant?.growthLevel == 0
  ) {
    if (
      gameGrid.cellAt(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      )
    ) {
      //console.log(gameGrid.player.highlightedX, gameGrid.player.highlightedY);
      gameGrid.plantCarrot(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      );
    }
    gameGrid.update();
    checkWin();
  }
});

app.appendChild(carrotButton);


const potatoButton = document.createElement("button");
potatoButton.textContent = "Plant Potato";
potatoButton.addEventListener("click", () => {
  console.log(
    gameGrid.cellAt(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
    )?.plant?.growthLevel,
  );
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
      ?.plant?.growthLevel == 0
  ) {
    if (
      gameGrid.cellAt(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      )
    ) {
      //console.log(gameGrid.player.highlightedX, gameGrid.player.highlightedY);
      gameGrid.plantPotato(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      );
    }
    gameGrid.update();
    checkWin();
  }
});

app.appendChild(potatoButton);


const harvestButton = document.createElement("button");
harvestButton.textContent = "Harvest";
harvestButton.addEventListener("click", () => {
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
      ?.plant?.growthLevel == 3
  ) {
    console.log("harvest"); //somewhere here make the plant go away
    if (
      gameGrid.cellAt(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      )
    ) {
      gameGrid.harvestPlant(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      );
    }
    gameGrid.update();
    checkWin();
  }
});

app.appendChild(harvestButton);

// Add event listener for keydown event
document.addEventListener("keydown", (event) => {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const key = event.key;

  if (arrowKeys.includes(key)) {
    gameGrid.player.directionInput(key);
    updateSunLevel();
    gameGrid.update();
  }
});

function checkWin() {
  if (gameGrid.player.money >= 100) {
    alert("win");
  }
}
