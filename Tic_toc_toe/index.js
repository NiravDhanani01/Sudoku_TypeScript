let box = document.querySelectorAll("#box");
let valueX = document.querySelector("#valX");
let choosePlayer = document.querySelector("#player");
let selectPlayerOne = document.querySelector("#selectPlayer");
let selectPlayerTwo = document.querySelector("#selectPlayer2");

let turnO = true;
let cnt = 0;
let winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

valueX.addEventListener("click", () => {
    if (valueX.checked) {
        turnO = false;
        valueX.style.display = "none"
        choosePlayer.style.display = "none"
        selectPlayerOne.innerHTML = "X"
        selectPlayerTwo.innerHTML = "O"
    }
});

function setDefaultPlayer() {
    selectPlayerOne.innerHTML = "O"
    selectPlayerTwo.innerHTML = "X"
}
setDefaultPlayer()

box.forEach((item) => {
    item.addEventListener("click", () => {
        if (item.innerText === "") {
            if (turnO) {
                item.innerText = "O";
                item.style.color = "red";
                item.disabled = true;
                valueX.style.display = "none"
                valueX.style.display = "none"
                choosePlayer.style.display = "none"
                document.querySelector('.result').innerText = `Player X Turn`;
                turnO = false;
                cnt++;
            } else {
                item.innerText = "X";
                item.style.color = "blue";
                item.disabled = true;
                document.querySelector('.result').innerText = `Player O Turn`;
                turnO = true;
                cnt++;
            }

            for (let pattern of winningPatterns) {
                let val1 = box[pattern[0]].innerText;
                let val2 = box[pattern[1]].innerText;
                let val3 = box[pattern[2]].innerText;

                if (val1 !== "" && val1 === val2 && val2 === val3) {
                    document.querySelector('.result').innerText = `Winner is player ${item.innerText}`;
                    disableAllBoxes();
                    return;
                }
            }

            if (cnt === 9) {
                document.querySelector('.result').innerText = `It's a draw!`;
                disableAllBoxes();
            }
        }
    });
});

const disableAllBoxes = () => {
    for (let b of box) {
        b.disabled = true;
    }
};

const resetGame = () => {
    for (let b of box) {
        b.innerHTML = "";
        b.disabled = false;
    }
    turnO = true;
    valueX.checked = false;
    setDefaultPlayer()
    valueX.style.display = "block"
    choosePlayer.style.display = "block"
    cnt = 0;
    document.querySelector('.result').innerText = "";
};


