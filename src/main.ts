import "./style.css";
const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "121 Group 7 Garden Game";
document.title = gameName;
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
