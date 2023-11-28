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

const carrotButton = document.createElement("button");
carrotButton.textContent = "Plant Carrot";
carrotButton.addEventListener("click", () => {
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
  ) {
    console.log(gameGrid.player.highlightedX, gameGrid.player.highlightedY);
    gameGrid.plantSeeds(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
      "carrot",
    );

    console.log(
      gameGrid.cellAt(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      ),
    );
    updateGame();
  }
});
app.appendChild(carrotButton);

const potatoButton = document.createElement("button");
potatoButton.textContent = "Plant Potato";
potatoButton.addEventListener("click", () => {
  placePlant("potato");
});
app.appendChild(potatoButton);

const harvestButton = document.createElement("button");
harvestButton.textContent = "Harvest";
harvestButton.addEventListener("click", () => {
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
      ?.plant?.growthLevel ==
      gameGrid.cellAt(
        gameGrid.player.highlightedX,
        gameGrid.player.highlightedY,
      )?.plant?.species.maxGrowthLevel
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
    updateGame();
  }
});
app.appendChild(harvestButton);

// Add event listener for keydown event for movement
document.addEventListener("keydown", (event) => {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const key = event.key;

  if (arrowKeys.includes(key)) {
    gameGrid.player.directionInput(key);
    updateSunLevel();
    gameGrid.update();
  }
});

document.addEventListener("keydown", (event) => {
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
  const key = event.key;
  if (plantKeys.includes(key)) {
    placePlant(letterToPlantMap[key]);
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
  console.log(
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY),
  );
  if (
    gameGrid != null &&
    gameGrid.cellAt(gameGrid.player.highlightedX, gameGrid.player.highlightedY)
  ) {
    console.log(gameGrid.player.highlightedX, gameGrid.player.highlightedY);
    gameGrid.plantSeeds(
      gameGrid.player.highlightedX,
      gameGrid.player.highlightedY,
      plant,
    );
    updateGame();
  }
}
