//variables
var ObstacleScored = false;
var points = 0;
var HighestScore = 0;
var game_over_music = new Audio("gameover.mp3");
var music = new Audio("music.mp3");
var DinoRect;
var GameRunning = false;
// Variables to track swipe start and end positions
let startX = 0;
let startY = 0;

//cached dom elements
const dino = document.getElementById("dino");
var score = document.getElementById("score");
var heighest_score = document.getElementById("heighest_score");
const obstacle = document.getElementById("obstacle");
const html = document.getElementById("html");
var gamecontainer = document.getElementById("gamecontainer");
var gameover = document.getElementById("gameover");
var game_over_text2 = document.getElementById("game_over_text2");
var hmm = parseFloat(
  window
    .getComputedStyle(document.getElementById("hmm"), null)
    .getPropertyValue("left")
);

//EventListeners
html.addEventListener("keydown", keypressed);
html.addEventListener("click", clicked);
gamecontainer.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});
gamecontainer.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  const endX = touch.clientX;
  const endY = touch.clientY;

  handleSwipe(startX, startY, endX, endY);
});

//Event reactor Functions
function clicked() {
  if (!GameRunning) {
    Start();
  }
}

function keypressed(Key) {
  if (!GameRunning && Key.keyCode == 13) {
    Start();
  } else if (GameRunning) {
    if (Key.keyCode == 39) {
      move_right();
    } else if (Key.keyCode == 38) {
      jump();
    } else if (Key.keyCode == 37) {
      move_left();
    } else if (Key.keyCode == 40) {
      move_down();
    }
  }
}

//Collision_Detector
setInterval(() => {
  DinoRect = dino.getBoundingClientRect();
  const ObstacleRect = obstacle.getBoundingClientRect();
  const dinoHitbox = {
    left: DinoRect.left + DinoRect.width * 0.25, // Ignore 20% from left (empty space)
    right: DinoRect.left + DinoRect.width * 1, // Use only 90% of width
    top: DinoRect.top + DinoRect.height * 0.1, // Ignore 10% from top
    bottom: DinoRect.top + DinoRect.height * 0.9, // Ignore 10% from bottom
  };

  const obstacleHitbox = {
    left: ObstacleRect.left + ObstacleRect.width * 0.1, // Ignore 10% from left
    right: ObstacleRect.left + ObstacleRect.width * 1, // Use 100% of width
    top: ObstacleRect.top + ObstacleRect.height * 0, // Ignore s0% from top
    bottom: ObstacleRect.top + ObstacleRect.height * 1, // Use 100% of height
  };

  const isColliding =
    dinoHitbox.right > obstacleHitbox.left &&
    dinoHitbox.left < obstacleHitbox.right &&
    dinoHitbox.bottom > obstacleHitbox.top;

  const ObstaclePassed = DinoRect.left > ObstacleRect.right;
  const ObstacleBeforeScreen = ObstacleRect.left > window.innerWidth;

  //Collided
  if (isColliding) {
    obstacle.classList.remove("obstacle_animation");
    music.pause();
    game_over_music.play();

    setTimeout(() => {
      game_over_music.pause();
    }, 1500);

    if (points > HighestScore) {
      HighestScore = points;
      updatehscore(HighestScore);
    }

    gameover.style.visibility = "visible";
    game_over_text2.style.visibility = "visible";
    gamecontainer.style.opacity = 0.4;
    heighest_score.style.visibility = "visible";
    heighest_score.style.top = "65.5vh";
    score.style.top = "65.5vh";
    score.style.left = "57vw";
    GameRunning = false;
    document.getElementById("cool").style.visibility = "hidden";
  }

  //if passed and not scored
  else if (ObstaclePassed && !ObstacleScored) {
    points += 100;
    updatescore(points);
    ObstacleScored = true;
  }

  if (ObstacleBeforeScreen) {
    ObstacleScored = false;
  }

  //SpeedIncrease
  //if (ObstacleRect.right < 0) {
  //const CurrentSpeed = parseFloat(obstacle.style.animationDuration || "3.5");
  //const NewSpeed = Math.max(CurrentSpeed - 0.03, 3.0);//updates 2-3 times due to interval rate and wide distance, so use speedIncrese/3 or /2 value
  //obstacle.style.animationDuration = NewSpeed + "s";}
}, 50);

//Functions
function Start() {
  gameover.style.visibility = "hidden";
  obstacle.classList.add("obstacle_animation");
  obstacle.style.animationDuration = 3.5 + "s";
  document.getElementById("intro1").style.visibility = "hidden";
  document.getElementById("intro2").style.visibility = "hidden";
  game_over_text2.style.visibility = "hidden";
  gamecontainer.style.opacity = 1;
  score.style.visibility = "visible";
  GameRunning = true;
  score.innerHTML = "Your Score: 0";
  document.getElementById("dino").style.left = 0 + "vw";
  score.style.top = "0vw";
  score.style.left = "0vw";
  heighest_score.style.top = "0vh";
  document.getElementById("cool").style.visibility = "visible";
  points = 0;
  music.play();
}
// Function to handle swipe gestures with responsive thresholds
function handleSwipe(startX, startY, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;

  // Calculate responsive thresholds based on screen dimensions
  const thresholdX = window.innerWidth * 0.1; // 10% of screen width
  const thresholdY = window.innerHeight * 0.1; // 10% of screen height

  // Determine if the swipe is horizontal or vertical
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > thresholdX) {
      // Swipe right
      move_right();
    } else if (diffX < -thresholdX) {
      // Swipe left
      move_left();
    }
  } else {
    // Vertical swipe
    if (diffY > thresholdY) {
      // Swipe down
      move_down();
    } else if (diffY < -thresholdY) {
      // Swipe up
      jump();
    }
  }
}

function move_right() {
  dino.style.left = DinoRect.left + hmm + "px";
}

function jump() {
  dino.classList.add("dino_jump_ani");

  setTimeout(() => {
    dino.classList.remove("dino_jump_ani");
  }, 1000);
}

function move_left() {
  dino.style.left = DinoRect.left - hmm + "px";
}

function move_down() {
  dino.classList.remove("dino_jump_ani");
}

function updatescore(points) {
  score.innerHTML = "Your Score: " + points;
}
function updatehscore(h_score) {
  heighest_score.innerHTML = "Highest Score: " + h_score;
}
