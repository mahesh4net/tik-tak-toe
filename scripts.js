let isvalueo = true;
const boxes = document.querySelectorAll(".box");
const oTurn = document.getElementById("o-turn");
const xTurn = document.getElementById("x-turn");
const winnerMessage = document.getElementById("winner-message");
const gameContainer = document.getElementById("game-container");
const minute = document.getElementById("minute");
const second = document.getElementById("second");
    
const movesound = document.getElementById("move");
const tiesound = document.getElementById("tie");
const winsound = document.getElementById("win");

const b1b2b3 = document.getElementById("b1b2b3");
const b4b5b6 = document.getElementById("b4b5b6");
const b7b8b9 = document.getElementById("b7b8b9");
const b1b4b7 = document.getElementById("b1b4b7");
const b2b5b8 = document.getElementById("b2b5b8");
const b3b6b9 = document.getElementById("b3b6b9");
const b1b5b9 = document.getElementById("b1b5b9");
const b3b5b7 = document.getElementById("b3b5b7");

let timeINSeconds = 0;
let timeInMinutes = 0;
let isTimerStarted = false;
let timeInterval;

let winner = null;
let isTie = false;

boxes.forEach((box) => {
  box.addEventListener("click", handleClick);
});

function handleClick(e) {
movesound.play()
  if (!isTimerStarted) {
    timeINSeconds = 0;
    timeInMinutes = 0;
    startTimer();
    isTimerStarted = true;
  }

  if (isvalueo) {
    e.target.firstElementChild.classList.remove("red");
    e.target.firstElementChild.classList.add("green");
  } else {
    e.target.firstElementChild.classList.remove("green");
    e.target.firstElementChild.classList.add("red");
  }

  e.target.firstElementChild.textContent = isvalueo ? "o" : "x";
  e.target.firstElementChild.classList.add("popup");
  checkwinner();
  if (isvalueo == true) {
    isvalueo = false;
    oTurn.classList.remove("turn-active");
    xTurn.classList.add("turn-active");
  } else {
    isvalueo = true;
    xTurn.classList.remove("turn-active");
    oTurn.classList.add("turn-active");
  }
}

function restart() {
  boxes.forEach((box) => {
    box.firstElementChild.textContent = "";
  });
  timeINSeconds = "00";
  timeInMinutes = "00";
  isTimerStarted = false;
  second.textContent = timeINSeconds;
  minute.textContent = timeInMinutes;
  clearInterval(timeInterval);
  winnerMessage.classList.remove("winner-active");
  gameContainer.classList.remove("click-disable");

  document.querySelectorAll(".line").forEach((line) => {
    line.classList.remove(winner == "o" ? "bg-green" : "bg-red");
  });

  isvalueo = true;
  winner = null;
  isTie = false;
}

function checkwinner() {
  console.log("ggggg");
  const box1value = document.getElementById("box-1").firstElementChild.textContent;
  const box2value = document.getElementById("box-2").firstElementChild.textContent;
  const box3value = document.getElementById("box-3").firstElementChild.textContent;
  const box4value = document.getElementById("box-4").firstElementChild.textContent;
  const box5value = document.getElementById("box-5").firstElementChild.textContent;
  const box6value = document.getElementById("box-6").firstElementChild.textContent;
  const box7value = document.getElementById("box-7").firstElementChild.textContent;
  const box8value = document.getElementById("box-8").firstElementChild.textContent;
  const box9value = document.getElementById("box-9").firstElementChild.textContent;

  if (box1value == box2value && box2value == box3value && box1value != "") {
    winner = box1value;
    b1b2b3.classList.add(winner == "o" ? "bg-green" : "bg-red");
    gameEnd();
  }
  if (box4value == box5value && box5value == box6value && box4value != "") {
    winner = box4value;
    b4b5b6.classList.add(winner == "o" ? "bg-green" : "bg-red");

    gameEnd();
  }
  if (box7value == box8value && box8value == box9value && box7value != "") {
    winner = box7value;
    b7b8b9.classList.add(winner == "o" ? "bg-green" : "bg-red");

    gameEnd();
  }
  if (box1value == box4value && box4value == box7value && box1value != "") {
    winner = box1value;
    b1b4b7.classList.add(winner == "o" ? "bg-green" : "bg-red");

    gameEnd();
  }
  if (box2value == box5value && box5value == box8value && box2value != "") {
    winner = box2value;
    b2b5b8.classList.add(winner == "o" ? "bg-green" : "bg-red");

    gameEnd();
  }
  if (box3value == box6value && box6value == box9value && box3value != "") {
    winner = box3value;
    b3b6b9.classList.add(winner == "o" ? "bg-green" : "bg-red");

    gameEnd();
  }
  if (box1value == box5value && box5value == box9value && box1value != "") {
    winner = box1value;
    b1b5b9.classList.add(winner == "o" ? "bg-green" : "bg-red");

    gameEnd();
  }
  if (box3value == box5value && box5value == box7value && box3value != "") {
    winner = box3value;
    b3b5b7.classList.add(winner == "o" ? "bg-green" : "bg-red");

    gameEnd();
  }

  if (
    box1value != "" &&
    box2value != "" &&
    box3value != "" &&
    box4value != "" &&
    box5value != "" &&
    box6value != "" &&
    box7value != "" &&
    box8value != "" &&
    box9value != "" &&
    winner == null
  ) {
    isTie = true;
  
    gameEnd();
  }
}

function startTimer() {
  timeInterval = setInterval(() => {
    timeINSeconds += 1;
    second.textContent = timeINSeconds.toString().padStart(2, "0");

    if (timeINSeconds > 59) {
      timeInMinutes += 1;
      minute.textContent = timeInMinutes.toString().padStart(2, "0");
      timeINSeconds = 0;
    }
  }, 1000);
}

function gameEnd() {
  if (isTie) {
    tiesound.play()
  }
  else {
    winsound.play()
  }
  clearInterval(timeInterval);

  gameContainer.classList.add("click-disable");
  winnerMessage.classList.add("winner-active");
  winnerMessage.textContent =
    winner == "o" && isTie == false ? "WINNER IS O" : winner == "x" && isTie == false ? "WINNER IS X" : "Game Tied !";
}


