let players: (string | number)[] = [];
let idArray: (string | number)[] = [];
let removeSpaceArray: (string | number)[] = [];
let playerName = document.getElementById("player") as HTMLElement | null;
let score = document.getElementById("score") as HTMLElement | null;
let level = document.getElementById("level") as HTMLElement | null;
let gameTime = document.getElementById("time") as HTMLElement | null;
let gameScore: number = 0;
let gameBoard = document.getElementById("gameBoard") as HTMLElement | null;
let size: number = 9;
let interval: number;
let getPlayers: (string | null | number)[] = JSON.parse(
  localStorage.getItem("player")
);
let playerDate = document.querySelector(".playerData") as HTMLElement;
playerDate.style.display = "none";

// first set up for player name
type playerInput = (event: any) => void;
const takePlayerInput: playerInput = (event) => {
  event.preventDefault();
  const playerName = document.getElementById(
    "inputPlayerName"
  ) as HTMLInputElement;
  const player: string = playerName.value;
  const playLevel = document.getElementById(
    "gameLevelSelect"
  ) as HTMLSelectElement;
  const playerLevel: string = playLevel.value;
  const id: number = Math.floor(Math.random() * 100);
  if (!player) {
    alert("Please enter your name");
    return;
  }
  if (!playLevel || playerLevel == "") {
    alert("Please select difficulty level");
    return;
  }

  let setObj = {
    id: id,
    name: player,
    level: playerLevel,
  };

  if (
    localStorage.getItem("player") == null ||
    localStorage.getItem("player") == undefined
  ) {
    players.push(setObj);
    localStorage.setItem("player", JSON.stringify(players));
    localStorage.setItem("oldPlayer", JSON.stringify(setObj));
    location.reload();
  } else {
    for (let i = 0; i < getPlayers.length; i++) {
      if (getPlayers[i].name == playerName) {
        alert("Player name already exists");
        document.querySelector(".playerData").style.display = "block";
        existingPlayer();
        return false;
      } else {
        localStorage.setItem("oldPlayer", JSON.stringify(setObj));
        location.reload();
      }
    }
    getPlayers.push(setObj);
    localStorage.setItem("player", JSON.stringify(getPlayers));
  }

  playerName.value = "";
  playerName.setAttribute("disabled", "disabled");
  playLevel.setAttribute("disabled", "disabled");
  let newBtn = document.getElementById("newGameBtn") as HTMLElement;
  newBtn.setAttribute("disabled", "disabled");
};

// if player exist
const existingPlayer = () => {
  if (
    localStorage.getItem("player") == null ||
    localStorage.getItem("player") == undefined
  )
    alert("no data found");
  else {
    let playerData: any = JSON.parse(localStorage.getItem("player")) || [];
    let tbl = "";
    playerData.map((item: any, i: number) => {
      i++;
      tbl += `
        <tr>
            <td id="no">${i}</td>
            <td id="playerName">${item.name}</td>
            <td id="playerLevel">${item.level}</td>
           <td> 
             <button class="select" onclick="selectPlayerAndStartGame(${item.id})">select</button>
             <button  class="delete" onclick="deleteOldPlayer(${item.id})">delete</button>
           </td>
        </tr>
      `;
    });
    document.querySelector(".playerData").style.display = "block";
    document.getElementById("tbody").innerHTML = tbl;
  }
};

// select player from list or loading old game logic
const selectPlayerAndStartGame = (id: number) => {
  let playerData = JSON.parse(localStorage.getItem("player")) || [];
  let selectedPlayer = playerData.find((item: any) => item.id == id);
  localStorage.setItem("oldPlayer", JSON.stringify(selectedPlayer));
  document.querySelector(".playerData").style.display = "none";
  location.reload();
};

const deleteOldPlayer = (id: number) => {
  let deletePlayer = getPlayers.filter((item: any) => item.id != id);
  localStorage.setItem("player", JSON.stringify(deletePlayer));

  if (getPlayers.length == 1) {
    localStorage.removeItem("player");
  }
  location.reload();
};

const setLevel = (newLevel: string) => {
  alert("your Current Data Will Be Lost !!!");
  let selectedPlayer = JSON.parse(localStorage.getItem("oldPlayer")) || [];
  let updateNewPlayer = JSON.parse(localStorage.getItem("player")) || [];
  let id = Math.floor(Math.random() * 100);

  let playerInfo = {
    id: id,
    name: selectedPlayer.name,
    level: newLevel,
  };
  updateNewPlayer.find((item: any) => {
    if (item.id === selectedPlayer.id) {
      item.id = id;
      (item.name = selectedPlayer.name), (item.level = newLevel);
    }
  });
  localStorage.removeItem("oldPlayer");

  location.reload();
  localStorage.setItem("oldPlayer", JSON.stringify(playerInfo));
  localStorage.setItem("player", JSON.stringify(updateNewPlayer));

  removeSpaceArray = [];
  gameScore = 0;
};

const easyLevel = () => setLevel("easy");
const mediumLevel = () => setLevel("medium");
const hardLevel = () => setLevel("hard");

//// now here start game , set name,score etc .
const startGame = () => {
  gameBoard.innerHTML = "";
  const oldData = JSON.parse(localStorage.getItem("oldPlayer"));
  if (oldData == undefined || oldData == null) {
    let levelBtn = document.querySelectorAll(".levelBtn");
    levelBtn.forEach((btn) => {
      btn.setAttribute("disabled", "disabled");
      btn.style.backgroundColor = "#1384964b";
      gameBoard.innerHTML = "";
      clearInterval(interval);
    });
  } else {
    playerName.innerHTML = oldData.name;
    if (oldData.score > 0) {
      gameScore = oldData.score;
    }
    score.innerHTML = gameScore;
    level.innerHTML = oldData.level;
    displayBoard(oldData.level);
    bestScore(oldData.level, oldData.score);
    document.getElementById("newGameBtn").setAttribute("disabled", "disabled");
    document.getElementById("newGameBtn").style.backgroundColor = "#1384964b";

    document.querySelector(".oldPlayer").style.backgroundColor = "#1384964b";
    document.querySelector(".oldPlayer").setAttribute("disabled", "disabled");
  }
};

// logout or exit game
const exitFromGame = (): void => {
  storeDataIntoLocalStorage();
  localStorage.removeItem("oldPlayer");
  location.reload();
};

// set timer functionality
const setTimer = (): void => {
  const oldData = JSON.parse(localStorage.getItem("oldPlayer"));
  let time: string;
  let minute: number = 0;
  let second: number = 0;
  if (oldData.time) {
    minute = oldData.time.split(":")[0];
    second = oldData.time.split(":")[1];
  }
  interval = setInterval(() => {
    second++;
    if (second == 60) {
      second = 0;
      minute++;
    }

    if (second.toString().length == 1) {
      time = `${minute}:0${second}`;
    } else {
      time = `${minute}:${second}`;
    }
    gameTime.innerHTML = time;
  }, 1000);
  // beforeunload
  window.addEventListener(
    "beforeunload",
    (e) => {
      // e.preventDefault();
      storeDataIntoLocalStorage();
    },
    false
  );
};

// create empty Array
let boxArray: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// setup sudoku grid and numbers
const displayBoard = (level: string): void => {
  // // create empty sudoku box
  function createEmptyBox() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let div = document.createElement("div");
        div.className = "gameBox";
        div.id = `${i}-${j}`;
        idArray.push(div.id);
        gameBoard.appendChild(div);

        if (i == 2 || i == 5) {
          div.style.borderBottom = "2px solid black";
        }
        if (j == 2 || j == 5) {
          div.style.borderRight = "2px solid black";
        }
      }
    }
  }
  createEmptyBox();
  let getOldData = JSON.parse(localStorage.getItem("oldPlayer"));

  if (getOldData && getOldData.gameBoard != null) {
    let gridCount: number = 0;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let box = document.getElementById(`${i}-${j}`) as HTMLDivElement;
        box.innerHTML = getOldData.gameBoard[gridCount].value;
        boxArray[i][j] = getOldData.boxArray[i][j];
        gridCount++;
      }
    }
    if (getOldData.scoreUpdateChecking) {
      scoreUpdateChecking = getOldData.scoreUpdateChecking;
    }

    removeSpace();
    setTimer();
  } else {
    function fillBox() {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          let div = document.getElementById(`${i}-${j}`);
          if (boxArray[i][j] == 0) {
            let number = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            number.sort(() => Math.random() - 0.5);

            for (let num of number) {
              // now check the row wise
              let row = true;
              for (let k = 0; k < size; k++) {
                if (boxArray[i][k] == num) {
                  row = false;
                  break;
                }
              }

              // col checking
              let col = true;
              for (let k = 0; k < size; k++) {
                if (boxArray[k][j] == num) {
                  col = false;
                  break;
                }
              }

              // matrix box checking
              let matrix = true;
              let matrixRow = i - (i % 3);
              let matrixCol = j - (j % 3);
              for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                  if (boxArray[matrixRow + x][matrixCol + y] == num) {
                    matrix = false;
                    break;
                  }
                }
              }

              if (row && col && matrix) {
                boxArray[i][j] = num;
                div.innerHTML = boxArray[i][j];
                if (fillBox()) {
                  return true;
                }
                boxArray[i][j] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
    fillBox();

    // remove the space as per difficulties
    if (level == "easy") {
      removeSpace(30);
    } else if (level == "medium") {
      removeSpace(40);
    } else if (level == "hard") {
      removeSpace(50);
    }
    setTimer();
  }
};

// remove box value from sudoku
const removeSpace = (num: number): void => {
  const oldData = JSON.parse(localStorage.getItem("oldPlayer"));

  if (oldData.space) {
    removeSpaceArray = oldData.space;
  } else {
    for (let i = 0; i < num; i++) {
      let x = Math.floor(Math.random() * 9);
      let y = Math.floor(Math.random() * 9);
      // document.getElementById(`${x}-${y}`).style.backgroundColor =
      //   "rgba(176, 219, 253, 0.217)";
      document.getElementById(`${x}-${y}`).innerHTML = "";
      if (removeSpaceArray.includes(`${x}-${y}`)) {
        i--;
      } else {
        removeSpaceArray.push(`${x}-${y}`);
      }
    }
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!removeSpaceArray.includes(`${i}-${j}`)) {
        document.getElementById(`${i}-${j}`).style.backgroundColor =
          "rgba(208, 234, 255, 0.435)";
      }
    }
  }
};

// select empty box  and set number
gameBoard.addEventListener("click", selectEmptyBox);
let targetBox: any = null;
function selectEmptyBox(e: any) {
  if (targetBox) {
    targetBox.classList.remove("active");
    document.removeEventListener("click", selectEmptyBox);
    document.removeEventListener("keyup", setNumberInTargetBox);
  }

  targetBox = e.target;
  if (removeSpaceArray.includes(targetBox.id)) {
    targetBox.classList.add("active");
    setNumberInTargetBox();
    eraseSelectedNumber();
    saveSteps();
  }
}

const setNumberInTargetBox = ():void =>
  document.addEventListener("keyup", (e: KeyboardEvent) => {
    if (removeSpaceArray.includes(targetBox.id)) {
      if (!targetBox) return;
      let keyValue: string | number = e.key;
      if (typeof keyValue === "number") {
        if (keyValue >= 1 && keyValue <= 9) {
          targetBox.innerText = keyValue;
          checkInputValue(targetBox);
          saveSteps();
        }
      } else if (keyValue == "Backspace") {
        targetBox.innerText = "";
        checkInputValue(targetBox);
      }
      targetBox.classList.remove("active");
      document.removeEventListener("click", selectEmptyBox);
      document.removeEventListener("keyup", setNumberInTargetBox);
    }
  });

// erase Selected box
const eraseSelectedNumber = ():void =>
  let  earseBtn = document.getElementById("eraseBtn") 
earseBtn.addEventListener("click", () => {
    if (removeSpaceArray.includes(targetBox.id)) {
      if (!targetBox) return;
      let eraseValue = "";
      targetBox.innerText = eraseValue;
      checkInputValue(targetBox);
      targetBox.classList.remove("active");
      document.removeEventListener("click", selectEmptyBox);
      saveSteps();
    }
  });

// updating score
let scoreUpdateChecking: string[] = [];
let scoreUpdate = false;

function checkInputValue(targetBox: any) {
  let [x, y] = targetBox.id.split("-");
  if (targetBox.innerText != boxArray[x][y]) {
    targetBox.style.color = "red";
  } else {
    targetBox.style.color = "black";

    if (!scoreUpdateChecking.includes(targetBox.id)) {
      scoreUpdateChecking.push(targetBox.id);
      scoreUpdate = true;
    }

    let targetRowNumber = targetBox.id.split("-")[0];
    let targetColNumber = targetBox.id.split("-")[1];

    // check row wise is full or not
    let rowCountCheck = 0;
    for (let i = targetRowNumber; i <= targetRowNumber; i++) {
      for (let j = 0; j < 9; j++) {
        let div = document.getElementById(`${i}-${j}`);
        if (div.innerText == boxArray[i][j]) rowCountCheck += 1;
      }
    }

    // check col wise is full or not
    let colCountCheck = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = targetColNumber; j <= targetColNumber; j++) {
        let div = document.getElementById(`${i}-${j}`);
        if (div.innerText == boxArray[i][j]) colCountCheck += 1;
      }
    }

    //  matrix checking
    let matrixCountCheck = 0;
    let matrixRow = Math.floor(targetRowNumber / 3) * 3;
    let matrixCol = Math.floor(targetColNumber / 3) * 3;

    for (let i = matrixRow; i < matrixRow + 3; i++) {
      for (let j = matrixCol; j < matrixCol + 3; j++) {
        let div = document.getElementById(`${i}-${j}`);
        if (div.innerText == boxArray[i][j]) matrixCountCheck++;
      }
    }

    // check the  score update
    if (scoreUpdate) {
      let level = document.getElementById("level").innerHTML;

      if (level == "easy") {
        gameScore += 10;
      } else if (level == "medium") {
        gameScore += 20;
      } else if (level == "hard") {
        gameScore += 30;
      }

      if (rowCountCheck == 9) {
        if (level == "easy") {
          gameScore += 100;
        } else if (level == "medium") {
          gameScore += 200;
        } else if (level == "hard") {
          gameScore += 300;
        }
      }

      if (colCountCheck == 9) {
        if (level == "easy") {
          gameScore += 100;
        } else if (level == "medium") {
          gameScore += 200;
        } else if (level == "hard") {
          gameScore += 300;
        }
      }

      if (matrixCountCheck == 9) {
        if (level == "easy") {
          gameScore += 100;
        } else if (level == "medium") {
          gameScore += 200;
        } else if (level == "hard") {
          gameScore += 300;
        }
      }

      if (matrixCountCheck == 9 && colCountCheck == 9 && rowCountCheck == 9) {
        if (level == "easy") {
          gameScore += 300;
        } else if (level == "medium") {
          gameScore += 600;
        } else if (level == "hard") {
          gameScore += 900;
        }
      } else if (
        matrixCountCheck == 9 &&
        (colCountCheck == 9 || rowCountCheck == 9)
      ) {
        if (level == "easy") {
          gameScore += 200;
        } else if (level == "medium") {
          gameScore += 400;
        } else if (level == "hard") {
          gameScore += 600;
        }
      }
      winningPattern();
      scoreUpdate = false;
    }
  }
  score.innerText = gameScore;
  storeDataIntoLocalStorage();
}

const storeDataIntoLocalStorage = () => {
  let storeGameBoard = [];
  let playerData = JSON.parse(localStorage.getItem("player"));
  let oldPlayerData = JSON.parse(localStorage.getItem("oldPlayer"));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      div = document.getElementById(`${i}-${j}`);
      div.innerHTML;
      obj = {
        id: div.id,
        value: div.innerHTML,
      };
      storeGameBoard.push(obj);
    }
  }

  playerData.find((item) => {
    if (item.id == oldPlayerData.id) {
      item.score = gameScore;
      item.time = gameTime.innerHTML;
      item.gameBoard = storeGameBoard;
      item.space = removeSpaceArray;
      item.boxArray = boxArray;
      item.scoreUpdateChecking = scoreUpdateChecking;
      item.level = oldPlayerData.level;
    }
  });
  oldPlayerData.score = gameScore;
  oldPlayerData.time = gameTime.innerHTML;
  oldPlayerData.gameBoard = storeGameBoard;
  oldPlayerData.space = removeSpaceArray;
  oldPlayerData.boxArray = boxArray;
  oldPlayerData.scoreUpdateChecking = scoreUpdateChecking;
  localStorage.setItem("player", JSON.stringify(playerData));
  localStorage.setItem("oldPlayer", JSON.stringify(oldPlayerData));
};

// winner functionality
const winningPattern = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let div = document.getElementById(`${i}-${j}`);
      if (div.innerHTML != boxArray[i][j]) {
        return false;
      }
    }
  }

  setTimeout(() => {
    alert("You Win!");
    storeDataIntoLocalStorage();
    clearInterval(interval);
    gameBoard = "";
    removeSpaceArray = [];
    exitFromGame();
    alert("want to start new game!!!");
    resetGame();
  }, 1500);
};

const bestScore = (playerLevel, playerScore) => {
  const bestScore = document.getElementById("bestScore");
  let bestPlayerData = getPlayers;

  let highScore = bestPlayerData.filter((level) => {
    if (level.level == playerLevel) {
      return level;
    }
  });

  let selectedLevelAllPlayerScore = [];
  highScore.forEach((item) => {
    selectedLevelAllPlayerScore.push(item.score);
  });

  let bestPlayer = selectedLevelAllPlayerScore.reduce(
    (a, b) => (a > b ? a : b),
    0
  );
  bestScore.innerHTML = bestPlayer == undefined ? "00" : bestPlayer;
};

// undo game logic
let recordAllStep = [];
document.getElementById("undoBtn").addEventListener("click", undoFunctionality);

function saveSteps() {
  document.removeEventListener("click", selectEmptyBox);
  document.removeEventListener("keyup", setNumberInTargetBox);
  let obj = {
    id: targetBox.id,
    value: targetBox.innerHTML,
  };
  recordAllStep.push(obj);
  console.log(recordAllStep);
}

function undoFunctionality() {
  if (recordAllStep.length <= 1) {
    return;
  }
  recordAllStep.pop();
  recordAllStep.forEach((item) => {
    document.getElementById(item.id).innerHTML = item.value;
  });
  console.log(recordAllStep);
}

const resetGame = () => {
  let oldData = JSON.parse(localStorage.getItem("oldPlayer"));
  setLevel(oldData.level);
};

bestScore();
startGame();
for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    let div = document.getElementById(`${i}-${j}`);
    if (div.innerHTML != boxArray[i][j]) {
      div.style.color = "red";
    }
  }
}
