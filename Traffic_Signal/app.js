"use strict";
let totalTime = 0;
let currentPosition = 0;
let green = document.querySelectorAll("#green");
let yellow = document.querySelectorAll("#yellow");
let red = document.querySelectorAll("#red");
let timer = document.querySelectorAll("#timer");
let firstLine = document.getElementById("1st");
let secondLine = document.getElementById("2nd");
let thirdLine = document.getElementById("3rd");
let fourthLine = document.getElementById("4th");
let startBtn = document.querySelector(".startTime");
let stopBtn = document.querySelector(".stopBtn");
let userInput = document.getElementById("userInput");
let blinking;
let stopBlinking;
let timeArray = [];
const startTrafficLight = () => {
    totalTime = parseInt(userInput.value);
    if (isNaN(totalTime) || totalTime < 10) {
        alert("Please enter a valid number greater than 50");
        return;
    }
    let line1 = parseInt(firstLine.value);
    let line2 = parseInt(secondLine.value);
    let line3 = parseInt(thirdLine.value);
    let line4 = parseInt(fourthLine.value);
    let finalTime = line1 + line2 + line3 + line4;
    if (finalTime !== 100) {
        alert("Time ratio must be equal to 100");
        return;
    }
    let firstLineTime = Math.floor((totalTime * line1) / 100);
    let secondLineTime = Math.floor((totalTime * line2) / 100);
    let thirdLineTime = Math.ceil((totalTime * line3) / 100);
    let fourthLineTime = Math.ceil((totalTime * line4) / 100);
    trafficLightSimulation(firstLineTime, secondLineTime, thirdLineTime, fourthLineTime);
    startBtn.setAttribute("disabled", "disabled");
    stopBtn.removeAttribute("disabled");
    userInput.value = "";
    firstLine.value = "";
    secondLine.value = "";
    thirdLine.value = "";
    fourthLine.value = "";
};
const trafficLightSimulation = async (firstLine, secondLine, thirdLine, fourthLine) => {
    clearInterval(blinking);
    clearInterval(stopBlinking);
    let time;
    let timeData = await fetch("./data.json");
    let response = await timeData.json();
    let time0 = firstLine + secondLine + thirdLine + fourthLine + 3;
    let time1 = firstLine;
    let time2 = firstLine + secondLine + 1;
    let time3 = firstLine + secondLine + thirdLine + 3;
    console.log("forth line", fourthLine);
    setInterval(() => {
        let currentDate = new Date();
        let hours = currentDate.getHours().toString().padStart(2, "0");
        let minutes = currentDate.getMinutes().toString().padStart(2, "0");
        let realTime = `${hours}${minutes}`;
        localStorage.setItem("time", JSON.stringify(realTime));
    }, 2000);
    function update() {
        let jsonTime = response.map((item) => {
            let separateStartTime = item.startTime.split("/");
            let separateEndTime = item.endTime.split("/");
            let startHours = separateStartTime[0].padStart(2, 0);
            let startMinute = separateStartTime[1].padStart(2, 0);
            let separateEndHour = separateEndTime[0].padStart(2, 0);
            let separateEndMinute = separateEndTime[1].padStart(2, 0);
            let startTime = `${startHours}${startMinute}`;
            let endTime = `${separateEndHour}${separateEndMinute}`;
            return { startTime, endTime };
        });
        for (let i = 0; i < jsonTime.length; i++) {
            let start = jsonTime[i].startTime;
            timeArray.push(start);
        }
        let realTime = JSON.parse(localStorage.getItem("time") || "");
        let check = jsonTime.find((item) => item.startTime <= realTime && item.endTime > realTime);
        if (check) {
            clearInterval(blinking);
            clearInterval(stopBlinking);
            if (currentPosition == 0)
                time = firstLine.toString();
            else if (currentPosition == 1)
                time = secondLine.toString();
            else if (currentPosition == 2)
                time = thirdLine.toString();
            else if (currentPosition == 3)
                time = fourthLine.toString();
            if (currentPosition > 3) {
                currentPosition = 0;
                time = firstLine.toString();
            }
            let decrementTime = parseInt(time);
            green.forEach((light, index) => {
                if (index != currentPosition) {
                    light.style.backgroundColor = "transparent";
                    light.style.boxShadow = "none";
                }
                else {
                    green[currentPosition].style.backgroundColor = "rgb(0, 255, 0)";
                    green[currentPosition].style.boxShadow =
                        "0px 0px 40px rgb(0, 255, 0)";
                }
            });
            red.forEach((light, index) => {
                if (index != currentPosition) {
                    light.style.backgroundColor = "rgb(255, 0, 0)";
                    light.style.boxShadow = "0px 0px 40px rgb(255, 0, 0)";
                }
                else {
                    light.style.backgroundColor = "transparent";
                    light.style.boxShadow = "none";
                }
            });
            yellow.forEach((light) => {
                light.classList.remove("yellowBlink");
            });
            let countdown = setInterval(() => {
                timer[currentPosition].innerText = `${decrementTime} s`;
                timer[currentPosition].style.color = "green";
                timer.forEach((time, index) => {
                    if (index !== currentPosition) {
                        time.style.color = "red";
                    }
                    if (index == 1 && index !== currentPosition) {
                        timer[1].innerHTML = `${time1} s`;
                    }
                    if (index == 2 && index !== currentPosition) {
                        timer[2].innerHTML = `${time2} s`;
                    }
                    if (index == 3 && index !== currentPosition) {
                        timer[3].innerHTML = `${time3} s`;
                    }
                    if (index == 0 && index !== currentPosition) {
                        timer[0].innerHTML = `${time0} s`;
                    }
                });
                decrementTime--;
                time0--;
                time1--;
                time2--;
                time3--;
                if (time0 < 0)
                    time0 = firstLine + secondLine + thirdLine + fourthLine + 3;
                if (time1 < 0)
                    time1 = firstLine + secondLine + thirdLine + fourthLine + 3;
                if (time2 < 0)
                    time2 = firstLine + secondLine + thirdLine + fourthLine + 3;
                if (time3 < 0)
                    time3 = firstLine + secondLine + thirdLine + fourthLine + 3;
                if (decrementTime < 0) {
                    currentPosition++;
                    clearInterval(countdown);
                    update();
                }
            }, 1000);
        }
        //////////
        else {
            yellow.forEach((item) => {
                blinking = setInterval(() => {
                    item.classList.add("yellowBlink");
                }, 1000);
                stopBlinking = setInterval(() => {
                    item.classList.remove("yellowBlink");
                }, 2000);
            });
            // Turn off green and red
            green.forEach((light) => {
                light.style.backgroundColor = "transparent";
                light.style.boxShadow = "none";
            });
            red.forEach((light) => {
                light.style.backgroundColor = "transparent";
                light.style.boxShadow = "none";
            });
            timer.forEach((time) => {
                time.style.color = "yellow";
                time.innerText = `00`;
            });
            let checkCurrentTime;
            setInterval(() => {
                checkCurrentTime = JSON.parse(localStorage.getItem("time") || "");
            }, 1000);
            let currentInterval = setInterval(() => {
                let nearestStartTime = timeArray.find((item) => item >= checkCurrentTime);
                if (nearestStartTime <= checkCurrentTime) {
                    yellow.forEach((light) => {
                        light.classList.remove("yellowBlink");
                    });
                    clearInterval(currentInterval);
                    clearInterval(blinking);
                    clearInterval(stopBlinking);
                    update();
                }
            }, 1000);
        }
    }
    update();
};
function stop() {
    location.reload();
}
