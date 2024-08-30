let mineArea = document.querySelector(".minesArea") as HTMLDivElement;
let unopenedCells: number;
let boxes: string[][] = [];

const displayMineArea = (col: number, row: number): void => {
  mineArea.innerHTML = "";
  boxes = [];
  unopenedCells = col * row;
  mineArea.style.width = col * 35 + "px";
  for (let i = 0; i < row; i++) {
    let rowArr: string[] = [];
    for (let j = 0; j < col; j++) {
      let div = document.createElement("div");
      div.className = "mineBtn";
      div.setAttribute("onclick", `openPosition(event, ${row}, ${col})`);
      div.id = `${i}-${j}`;
      rowArr.push(div.id);
      mineArea.append(div);
    }
    boxes.push(rowArr);
  }
};

let minesPosition: string[] = [];

const mineSetter = (col: number, row: number): void => {
  let mineCount: number = Math.floor(col * row * 0.15);
  minesPosition = [];

  for (let i = 0; i < mineCount; i++) {
    let x = Math.floor(Math.random() * row).toString();
    let y = Math.floor(Math.random() * col).toString();
    let randomId = document.getElementById(`${x}-${y}`)!;

    if (!minesPosition.includes(`${x}-${y}`)) {
      minesPosition.push(`${x}-${y}`);
      randomId.innerHTML = "&#128163;";
      randomId.style.color = "transparent";
    }
  }

  for (let item of minesPosition) {
    let [x, y] = item.split("-").map(Number);

    let leftId = `${x}-${y - 1}`;
    let topLeftId = `${x - 1}-${y - 1}`;
    let bottomLeftId = `${x + 1}-${y - 1}`;
    let topId = `${x - 1}-${y}`;
    let bottomId = `${x + 1}-${y}`;
    let topRightId = `${x - 1}-${y + 1}`;
    let rightId = `${x}-${y + 1}`;
    let bottomRightId = `${x + 1}-${y + 1}`;

    if (y > 0) setNumber(leftId);
    if (x > 0 && y > 0) setNumber(topLeftId);
    if (x < row - 1 && y > 0) setNumber(bottomLeftId);
    if (x > 0) setNumber(topId);
    if (x < row - 1) setNumber(bottomId);
    if (x > 0 && y < col - 1) setNumber(topRightId);
    if (y < col - 1) setNumber(rightId);
    if (x < row - 1 && y < col - 1) setNumber(bottomRightId);
  }
};

const setNumber = (ids: string): void => {
  let id = document.getElementById(ids)!;
  if (id && !minesPosition.includes(ids)) {
    id.innerText = ((parseInt(id.innerText) || 0) + 1).toString();
    id.style.color = "transparent";
  }
};

const openPosition = (event: MouseEvent, row: number, col: number): void => {
  let clickPosition = (event.target as HTMLElement).id;

  if (minesPosition.includes(clickPosition)) {
    for (let mine of minesPosition) {
      let mineCell = document.getElementById(mine)!;
      mineCell.style.color = "black";
      mineCell.style.backgroundColor = "red";
      mineCell.innerHTML = "&#128163;";
    }
    let allBoxes = document.querySelectorAll(".mineBtn");
    allBoxes.forEach((item) => {
      (item as HTMLElement).style.pointerEvents = "none";
    });
    alert("Game Over");
  } else {
    openEmptyBoxes(clickPosition, row, col);
    winningCondition();
  }
};

const openEmptyBoxes = (id: string, row: number, col: number): void => {
  let [x, y] = id.split("-").map(Number);
  let emptyBox = document.getElementById(id);

  if (!emptyBox || emptyBox.style.backgroundColor === "lightgrey") {
    return;
  }

  emptyBox.style.backgroundColor = "lightgrey";
  emptyBox.style.color = "black";
  emptyBox.style.fontWeight = "bold";
  unopenedCells--;

  if (emptyBox.innerHTML === "") {
    let leftId = `${x}-${y - 1}`;
    let topLeftId = `${x - 1}-${y - 1}`;
    let bottomLeftId = `${x + 1}-${y - 1}`;
    let topId = `${x - 1}-${y}`;
    let bottomId = `${x + 1}-${y}`;
    let topRightId = `${x - 1}-${y + 1}`;
    let rightId = `${x}-${y + 1}`;
    let bottomRightId = `${x + 1}-${y + 1}`;

    if (y > 0) openEmptyBoxes(leftId, row, col);
    if (x > 0 && y > 0) openEmptyBoxes(topLeftId, row, col);
    if (x < row - 1 && y > 0) openEmptyBoxes(bottomLeftId, row, col);
    if (x > 0) openEmptyBoxes(topId, row, col);
    if (x < row - 1) openEmptyBoxes(bottomId, row, col);
    if (x > 0 && y < col - 1) openEmptyBoxes(topRightId, row, col);
    if (y < col - 1) openEmptyBoxes(rightId, row, col);
    if (x < row - 1 && y < col - 1) openEmptyBoxes(bottomRightId, row, col);
  }
};

const winningCondition = (): void => {
  if (unopenedCells === minesPosition.length) {
    alert("Congratulations! You won");
    document.querySelectorAll(".mineBtn").forEach((item) => {
      (item as HTMLElement).style.pointerEvents = "none";
    });
  }
};

const selectBasic = (): void => {
  const row = 10;
  const col = 10;
  displayMineArea(col, row);
  mineSetter(col, row);
};

const selectIntermediate = (): void => {
  const row = 16;
  const col = 16;
  displayMineArea(col, row);
  mineSetter(col, row);
};

const selectExpert = (): void => {
  const col = 30;
  const row = 16;
  displayMineArea(col, row);
  mineSetter(col, row);
};

const customSelect = (): void => {
  const row = parseInt(prompt("Enter the number of rows") || "0");
  const col = parseInt(prompt("Enter the number of columns") || "0");
  if (!row || !col) {
    selectBasic();
  } else {
    displayMineArea(col, row);
    mineSetter(col, row);
  }
};

const ResetGame = (): void => {
  selectBasic();
};

selectBasic();
