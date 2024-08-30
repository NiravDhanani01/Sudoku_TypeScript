let box = document.querySelectorAll<Element>("#box") as NodeListOf<Element>;
let valueX = document.querySelector("#valX") as HTMLInputElement;
let choosePlayer = document.querySelector("#player") as HTMLElement;
let selectPlayerOne = document.querySelector("#selectPlayer") as HTMLElement;
let selectPlayerTwo = document.querySelector("#selectPlayer2") as HTMLElement;

let turnO: Boolean = true;
let cnt: number = 0;
let winningPatterns: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

valueX.addEventListener("click", (): void => {
  if (valueX.checked) {
    turnO = false;
    valueX.style.display = "none";
    choosePlayer.style.display = "none";
    selectPlayerOne.innerHTML = "X";
    selectPlayerTwo.innerHTML = "O";
  }
});

function setDefaultPlayer(): void {
  selectPlayerOne.innerHTML = "O";
  selectPlayerTwo.innerHTML = "X";
}
setDefaultPlayer();

box.forEach((item: any): void => {
  item.addEventListener("click", (): void => {
    if (item.innerText === "") {
      if (turnO) {
        item.innerText = "O";
        item.style.color = "red";
        item.disabled = true;
        valueX.style.display = "none";
        valueX.style.display = "none";
        choosePlayer.style.display = "none";
        (<HTMLElement>(
          document.querySelector(".result")
        )).innerText = `Player X Turn`;
        turnO = false;
        cnt++;
      } else {
        item.innerText = "X";
        item.style.color = "blue";
        item.disabled = true;
        (<HTMLElement>(
          document.querySelector(".result")
        )).innerText = `Player O Turn`;
        turnO = true;
        cnt++;
      }

      for (let pattern of winningPatterns) {
        let val1 = (<HTMLElement>box[pattern[0]]).innerText;
        let val2 = (<HTMLElement>box[pattern[1]]).innerText;
        let val3 = (<HTMLElement>box[pattern[2]]).innerText;

        if (val1 !== "" && val1 === val2 && val2 === val3) {
          (<HTMLElement>(
            document.querySelector(".result")
          )).innerText = `Winner is player ${item.innerText}`;
          disableAllBoxes();
          return;
        }
      }

      if (cnt === 9) {
        (<HTMLElement>(
          document.querySelector(".result")
        )).innerText = `It's a draw!`;
        disableAllBoxes();
      }
    }
  });
});

const disableAllBoxes = (): void => {
  for (let b of box) {
    (b as HTMLButtonElement).disabled = true;
  }
};

const resetGame = () => {
  for (let b of box) {
    b.innerHTML = "";
    (b as HTMLButtonElement).disabled = false;
  }
  turnO = true;
  valueX.checked = false;
  setDefaultPlayer();
  valueX.style.display = "block";
  choosePlayer.style.display = "block";
  cnt = 0;
  (<HTMLElement>document.querySelector(".result")).innerText = "";
};