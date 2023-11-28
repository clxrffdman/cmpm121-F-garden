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
  // gameGrid.sunLevel = Math.floor(Math.random() * 3);
  gameGrid.sunLevel = 3;
  sunLevelText.textContent = `Sun Level: ${gameGrid.sunLevel}`;
}

const gridSize = 26;
export const gameGrid = new GameGrid(gridSize);
updateGame();

const passTimeButton = document.createElement("button");
passTimeButton.textContent = "Pass Time";
passTimeButton.addEventListener("click", () => {
  updateGame();
});
app.appendChild(passTimeButton);

// Add event listener for keydown event for movement
document.addEventListener("keydown", (event) => {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const key = event.key;
  const plantKeys = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const letterToPlantMap: { [key: string]: string } = {
    a: "apple",
    b: "banana",
    c: "carrot",
    d: "daikon",
    e: "eggplant",
    f: "fig",
    g: "grape",
    h: "horse_raddish",
    i: "indonesian_lime",
    j: "jackfruit",
    k: "kiwi",
    l: "lemon",
    m: "maize",
    n: "nectarine",
    o: "orange",
    p: "potato",
    q: "quince",
    r: "raddish",
    s: "squash",
    t: "tomato",
    u: "ugni",
    v: "vanilla",
    w: "watermelon",
    x: "xigua",
    y: "yam",
    z: "zuccini",
  };

  if (arrowKeys.includes(key)) {
    gameGrid.player.directionInput(key);
    updateSunLevel();
    gameGrid.update();
  }

  if (plantKeys.includes(key)) {
    placePlant(letterToPlantMap[key]);
  }

  if (key == " ") {
    harvest();
  }
});

function updateGame() {
  updateSunLevel();
  gameGrid.update();
  checkWin();
}

function checkWin() {
  if (gameGrid.player.money >= 100) {
    alert("win");
  }
}

function placePlant(plant: string) {
  if (
    gameGrid != null &&
    gameGrid.cellAt(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
    ) &&
    !gameGrid.cellAt(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
    )!.plant
  ) {
    gameGrid.plantSeeds(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
      plant,
    );
    updateGame();
  }
}

function harvest() {
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
      ?.plant?.growthLevel ==
      gameGrid.cellAt(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      )?.plant?.species.maxGrowthLevel
  ) {
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
    updateGame();
  }
}
