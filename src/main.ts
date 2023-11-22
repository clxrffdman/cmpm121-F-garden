import "./style.css";
import { GameGrid } from "./gameGrid";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "121 Group 7 Garden Game";
document.title = gameName;
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const sunLevelText = document.createElement("p");
app.appendChild(sunLevelText);
export const gridContainer = document.createElement("div");
// gridContainer.classList.add("grid-container"); //Don't have this yet
app.appendChild(gridContainer);

function updateSunLevel() {
  gameGrid.sunLevel = Math.floor(Math.random() * 3);
  sunLevelText.innerHTML = `Sun Level: ${gameGrid.sunLevel}`;
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
