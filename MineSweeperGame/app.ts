let mineArea = document.querySelector(".minesArea")  as HTMLDivElement;
let unopenedCells:number;
let boxes:string[][] = [];

const displayMineArea = (col:number, row:number):void => {
  mineArea.innerHTML = "";
  boxes = [];
  unopenedCells = col * row;
  mineArea.style.width = col * 35 + "px";
  for (let i:number = 0; i < row; i++) {
    let rowArr:string[] = [];
    for (let j:number = 0; j < col; j++) {
      let div = document.createElement("div") ;
      div.className = "mineBtn";
      div.setAttribute("onclick", `openPosition(event, ${row}, ${col})`);
      div.id = `${i}-${j}`;
      rowArr.push(`${i}-${j}`);
      mineArea.append(div);
    }
    boxes.push(rowArr);
  }
};

let minesPosition:string[] = [];

const mineSetter = (col:number, row:number):void => {
  let mineCount:number = Math.floor(col * row * 0.15);
  minesPosition = [];

  for (let i:number = 0; i < mineCount; i++) {
    let x:string = Math.floor(Math.random() * row).toString();
    let y:string = Math.floor(Math.random() * col).toString();
    let randomId = document.getElementById(`${x}-${y}`)! ;

    if (!minesPosition.includes(`${x}-${y}`)) {
      minesPosition.push(`${x}-${y}`);
      randomId.innerHTML = "&#128163;";
      randomId.style.color = "transparent"
    }
  }

  for (let item of minesPosition) {
    let splitId = item.split("-").map((item) => item);

    let x = parseInt(splitId[0]);
    let y = parseInt(splitId[1]);

    let leftId:string = `${x}-${y - 1}`;
    let topLeftId:string = `${x - 1}-${y - 1}`;
    let bottomLeftId:string = `${x + 1}-${y - 1}`;
    let topId:string = `${x - 1}-${y}`;
    let bottomId:string = `${x + 1}-${y}`;
    let topRightId:string = `${x - 1}-${y + 1}`;
    let rightId:string = `${x}-${y + 1}`;
    let bottomRightId:string = `${x + 1}-${y + 1}`;

    // left side part
    if (y > 0) {
      setNumber(leftId);
    }
    if (x > 0 && y > 0) {
      setNumber(topLeftId);
    }
    if (x < row - 1 && y > 0) {
      setNumber(bottomLeftId);
    }

    // middel part
    if (x > 0) {
      setNumber(topId);
    }
    if (x < row - 1) {
      setNumber(bottomId);
    }

    // right side part
    if (x > 0 && y < col - 1) {
      setNumber(topRightId);
    }
    if (y < col - 1) {
      setNumber(rightId);
    }
    if (x < row - 1 && y < col - 1) {
      setNumber(bottomRightId);
    }
  }
};

const setNumber = (ids:string):void => {
    let id = document.getElementById(ids)!
  if (id && !minesPosition.includes(ids)) {
    id.innerText = (parseInt(document.getElementById(ids).innerText) || 0) + 1;
   id.style.color = "transparent"
  }
};

const openPosition = (event:any, row:number, col:number) => {
  let clickPosition = event.target.id;

  if (minesPosition.includes(clickPosition)) {
    for (let mine of minesPosition) {
      let mineCell = document.getElementById(mine) as HTMLElement;
      mineCell.style.color = "black";
      mineCell.style.backgroundColor = "red";
      mineCell.innerHTML = "&#128163;";
    }
    let allBoxes = document.querySelectorAll(".mineBtn");
    allBoxes.forEach((item:any) => {
      item.style.pointerEvents = "none";
    });
    alert("Game Over");
  } else {
    openEmptyBoxes(clickPosition, row, col);
    winningCondition();
  }
};
const openEmptyBoxes = (id:string, row:number, col:number) => {
  let emptyId = id.split("-");
  let x:number = parseInt(emptyId[0]);
  let y:number = parseInt(emptyId[1]);
  let emptyBox = document.getElementById(id) as HTMLElement | null;
  
  if (!emptyBox || emptyBox.style.backgroundColor === "lightgrey") {
    return;
  }
  
  emptyBox.style.backgroundColor = "lightgrey";
  emptyBox.style.color = "black";
  emptyBox.style.fontWeight = "bold";
  unopenedCells--;
  
  if (emptyBox.innerHTML === "") {
    let leftId:string = `${x}-${y - 1}`;
    let topLeftId:string = `${x - 1}-${y - 1}`;
    let bottomLeftId:string = `${x + 1}-${y - 1}`;
    let topId:string = `${x - 1}-${y}`;
    let bottomId:string = `${x + 1}-${y}`;
    let topRightId:string = `${x - 1}-${y + 1}`;
    let rightId:string = `${x}-${y + 1}`;
    let bottomRightId:string = `${x + 1}-${y + 1}`;

    // left side part
    if (y > 0) {
      openEmptyBoxes(leftId, row, col);
    }
    if (x > 0 && y > 0) {
      openEmptyBoxes(topLeftId, row, col);
    }
    if (x < row - 1 && y > 0) {
      openEmptyBoxes(bottomLeftId, row, col);
    }

    // middle part
    if (x > 0) {
      openEmptyBoxes(topId, row, col);
    }
    if (x < row - 1) {
      openEmptyBoxes(bottomId, row, col);
    }

    // right side part
    if (x > 0 && y < col - 1) {
      openEmptyBoxes(topRightId, row, col);
    }
    if (y < col - 1) {
      openEmptyBoxes(rightId, row, col);
    }
    if (x < row - 1 && y < col - 1) {
      openEmptyBoxes(bottomRightId, row, col);
    }
  }
};

const winningCondition = ():void => {
  if (unopenedCells === minesPosition.length) {
    alert("Congratulations! You won");
    document.querySelectorAll(".mineBtn").forEach((item:any) => {
      item.style.pointerEvents = "none";
    });
  }
};

const selectBasic = () => {
  let row = 10;
  let col = 10;
  displayMineArea(col, row);
  mineSetter(col, row);
};

const selectIntermediate = () => {
  let row = 16;
  let col = 16;
  displayMineArea(col, row);
  mineSetter(col, row);
};

const selectExpert = () => {
  let col = 30;
  let row = 16;
  displayMineArea(col, row);
  mineSetter(col, row);
};

const customSelect = () => {
  let row:number = parseInt(prompt("Enter the number of rows"));
  let col:number = parseInt(prompt("Enter the number of columns"));
  if (!row || !col) {
    selectBasic();
  } else {
    displayMineArea(col, row);
    mineSetter(col, row);
  }
};

const ResetGame = () => {
  selectBasic();
};

selectBasic();
