var mineArea = document.querySelector(".minesArea");
var unopenedCells;
var boxes = [];
var displayMineArea = function (col, row) {
    mineArea.innerHTML = "";
    boxes = [];
    unopenedCells = col * row;
    mineArea.style.width = col * 35 + "px";
    for (var i = 0; i < row; i++) {
        var rowArr = [];
        for (var j = 0; j < col; j++) {
            var div = document.createElement("div");
            div.className = "mineBtn";
            div.setAttribute("onclick", "openPosition(event, ".concat(row, ", ").concat(col, ")"));
            div.id = "".concat(i, "-").concat(j);
            rowArr.push(div.id);
            mineArea.append(div);
        }
        boxes.push(rowArr);
    }
};
var minesPosition = [];
var mineSetter = function (col, row) {
    var mineCount = Math.floor(col * row * 0.15);
    minesPosition = [];
    for (var i = 0; i < mineCount; i++) {
        var x = Math.floor(Math.random() * row).toString();
        var y = Math.floor(Math.random() * col).toString();
        var randomId = document.getElementById("".concat(x, "-").concat(y));
        if (!minesPosition.includes("".concat(x, "-").concat(y))) {
            minesPosition.push("".concat(x, "-").concat(y));
            randomId.innerHTML = "&#128163;";
            randomId.style.color = "transparent";
        }
    }
    for (var _i = 0, minesPosition_1 = minesPosition; _i < minesPosition_1.length; _i++) {
        var item = minesPosition_1[_i];
        var _a = item.split("-").map(Number), x = _a[0], y = _a[1];
        var leftId = "".concat(x, "-").concat(y - 1);
        var topLeftId = "".concat(x - 1, "-").concat(y - 1);
        var bottomLeftId = "".concat(x + 1, "-").concat(y - 1);
        var topId = "".concat(x - 1, "-").concat(y);
        var bottomId = "".concat(x + 1, "-").concat(y);
        var topRightId = "".concat(x - 1, "-").concat(y + 1);
        var rightId = "".concat(x, "-").concat(y + 1);
        var bottomRightId = "".concat(x + 1, "-").concat(y + 1);
        if (y > 0)
            setNumber(leftId);
        if (x > 0 && y > 0)
            setNumber(topLeftId);
        if (x < row - 1 && y > 0)
            setNumber(bottomLeftId);
        if (x > 0)
            setNumber(topId);
        if (x < row - 1)
            setNumber(bottomId);
        if (x > 0 && y < col - 1)
            setNumber(topRightId);
        if (y < col - 1)
            setNumber(rightId);
        if (x < row - 1 && y < col - 1)
            setNumber(bottomRightId);
    }
};
var setNumber = function (ids) {
    var id = document.getElementById(ids);
    if (id && !minesPosition.includes(ids)) {
        id.innerText = ((parseInt(id.innerText) || 0) + 1).toString();
        id.style.color = "transparent";
    }
};
var openPosition = function (event, row, col) {
    var clickPosition = event.target.id;
    if (minesPosition.includes(clickPosition)) {
        for (var _i = 0, minesPosition_2 = minesPosition; _i < minesPosition_2.length; _i++) {
            var mine = minesPosition_2[_i];
            var mineCell = document.getElementById(mine);
            mineCell.style.color = "black";
            mineCell.style.backgroundColor = "red";
            mineCell.innerHTML = "&#128163;";
        }
        var allBoxes = document.querySelectorAll(".mineBtn");
        allBoxes.forEach(function (item) {
            item.style.pointerEvents = "none";
        });
        alert("Game Over");
    }
    else {
        openEmptyBoxes(clickPosition, row, col);
        winningCondition();
    }
};
var openEmptyBoxes = function (id, row, col) {
    var _a = id.split("-").map(Number), x = _a[0], y = _a[1];
    var emptyBox = document.getElementById(id);
    if (!emptyBox || emptyBox.style.backgroundColor === "lightgrey") {
        return;
    }
    emptyBox.style.backgroundColor = "lightgrey";
    emptyBox.style.color = "black";
    emptyBox.style.fontWeight = "bold";
    unopenedCells--;
    if (emptyBox.innerHTML === "") {
        var leftId = "".concat(x, "-").concat(y - 1);
        var topLeftId = "".concat(x - 1, "-").concat(y - 1);
        var bottomLeftId = "".concat(x + 1, "-").concat(y - 1);
        var topId = "".concat(x - 1, "-").concat(y);
        var bottomId = "".concat(x + 1, "-").concat(y);
        var topRightId = "".concat(x - 1, "-").concat(y + 1);
        var rightId = "".concat(x, "-").concat(y + 1);
        var bottomRightId = "".concat(x + 1, "-").concat(y + 1);
        if (y > 0)
            openEmptyBoxes(leftId, row, col);
        if (x > 0 && y > 0)
            openEmptyBoxes(topLeftId, row, col);
        if (x < row - 1 && y > 0)
            openEmptyBoxes(bottomLeftId, row, col);
        if (x > 0)
            openEmptyBoxes(topId, row, col);
        if (x < row - 1)
            openEmptyBoxes(bottomId, row, col);
        if (x > 0 && y < col - 1)
            openEmptyBoxes(topRightId, row, col);
        if (y < col - 1)
            openEmptyBoxes(rightId, row, col);
        if (x < row - 1 && y < col - 1)
            openEmptyBoxes(bottomRightId, row, col);
    }
};
var winningCondition = function () {
    if (unopenedCells === minesPosition.length) {
        alert("Congratulations! You won");
        document.querySelectorAll(".mineBtn").forEach(function (item) {
            item.style.pointerEvents = "none";
        });
    }
};
var selectBasic = function () {
    var row = 10;
    var col = 10;
    displayMineArea(col, row);
    mineSetter(col, row);
};
var selectIntermediate = function () {
    var row = 16;
    var col = 16;
    displayMineArea(col, row);
    mineSetter(col, row);
};
var selectExpert = function () {
    var col = 30;
    var row = 16;
    displayMineArea(col, row);
    mineSetter(col, row);
};
var customSelect = function () {
    var row = parseInt(prompt("Enter the number of rows") || "0");
    var col = parseInt(prompt("Enter the number of columns") || "0");
    if (!row || !col) {
        selectBasic();
    }
    else {
        displayMineArea(col, row);
        mineSetter(col, row);
    }
};
var ResetGame = function () {
    selectBasic();
};
selectBasic();
