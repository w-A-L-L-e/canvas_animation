// main animation js code.
// this proof of concept code/work in progress and will be modified to show a nice animation
// for the documentation landing page of a fastapi application I'm currently developing for pfizer.
// many hardcoded values will be replaced here and code needs further refactoring + cleanup.
//

// some labels to customize
const APP_CANVAS = "animation_canvas";
const SERVICE_LABEL = "SERVER 2";
const FRONTEND_LABEL = "Frontend";
const API_LABEL = "API 1";

// define color theme
const API_LABEL_COLOR = "#88CCFF";
const API_BG_COLOR = "#222288";
const BG_COLOR = "#000000";
const LINE_COLOR = "#2244AA";

// state variables to control canvas and animation elements
let canvas = null;
let ctx = null;
let state = {};

let mouseX = 0;
let mouseY = 0;

let centralBall = {};
let numBalls = 0;
let balls = [];

const radius = 170; // Distance from the center
const speed = 0.012; // Speed of rotation

function onMouseMove(e) {
  e.preventDefault();
  e.stopPropagation();

  const canvas_rect = canvas.getBoundingClientRect();
  mouseX = parseInt(e.clientX - canvas_rect.left);
  mouseY = parseInt(e.clientY - canvas_rect.top);
}

function clearScreen() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // you need to set canvas background color and then clearrect also works
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function print(txt, xpos, ypos, color = "#FFFFFF") {
  ctx.fillStyle = color;
  ctx.fillText(txt, xpos, ypos);
}

function line(x, y, x2, y2) {
  ctx.beginPath();
  ctx.strokeStyle = LINE_COLOR;

  // dashed line
  ctx.setLineDash([5, 8]);
  ctx.lineWidth = 3;
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

// example of drawing a sprite image
//var ball_sprite = null;
//function drawSprite(x, y, w, h) {
//  if (ball_sprite) ctx.drawImage(ball_sprite, x, y, w, h);
//}

function initBalls() {
  // balls = [];
  while (numBalls < balls.length) balls.pop();

  let firstAngle = 0;
  if (balls.length > 0) firstAngle = balls[0].angle;

  // Initialize the balls
  for (let i = 0; i < numBalls; i++) {
    let angle = (i * 2 * Math.PI) / numBalls;
    angle += firstAngle;

    if (i < balls.length) {
      balls[i] = {
        angle: angle,
        radius: 25,
        distance: 1.0, // 0 to 1 val
        color: "#5588cc",
        label: "#" + (i + 1),
      };
    } else {
      // balls array too small, resize it
      balls.push({
        angle: angle,
        radius: 25,
        distance: 1.0, // 0 to 1 val
        color: "#5588cc",
        label: "#" + (i + 1),
      });
    }
  }

  // last added is contracted
  balls[balls.length - 1].distance = 0.2;
}

function drawRotatingBalls() {
  ctx.beginPath();
  balls.forEach((ball) => {
    if (ball.distance < 1.01) ball.distance += 0.03;

    const x = centralBall.x + radius * ball.distance * Math.cos(ball.angle);
    const y = centralBall.y + radius * ball.distance * Math.sin(ball.angle);

    // line to center
    line(x, y, centralBall.x, centralBall.y);

    // ball orbiting center
    ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();

    print(ball.label, x - 6 * ball.label.length, y + 7, "#ffffff");

    // Update the angle for rotation
    ball.angle += speed;
  });
  ctx.closePath();
}

function drawCentralBall() {
  ctx.beginPath();
  ctx.arc(centralBall.x, centralBall.y, centralBall.radius, 0, Math.PI * 2);
  ctx.fillStyle = centralBall.color;
  ctx.fill();
  ctx.closePath();

  print(API_LABEL, centralBall.x - 40, centralBall.y + 8, API_LABEL_COLOR);
}

function hoverCentralBall() {
  var dx = centralBall.x - mouseX;
  var dy = centralBall.y - mouseY;
  var r = centralBall.radius;
  return dx * dx + dy * dy < r * r;
}

// slowly populate balls
function populateBalls() {
  numBalls += 1;
  initBalls();
  if (numBalls < 5) setTimeout(populateBalls, 900);
  if (numBalls >= 5 && numBalls < 12) setTimeout(populateBalls, 4000);
}

function drawApiFrontend() {
  ctx.strokeStyle = API_BG_COLOR;
  ctx.fillStyle = API_BG_COLOR;

  line(700, 70, centralBall.x, centralBall.y);
  ctx.beginPath();
  // ctx.roundRectFill(650, 30, 120, 200, 10);
  ctx.fillRect(630, 30, 140, 100, 10);
  ctx.stroke();
  ctx.closePath();

  print(FRONTEND_LABEL, 640, 50);
}

function drawConsumingService() {
  ctx.strokeStyle = API_BG_COLOR;
  ctx.fillStyle = API_BG_COLOR;

  line(120, 70, centralBall.x, centralBall.y);
  ctx.beginPath();
  //ctx.roundRect(20, 30, 120, 200, 10);
  ctx.fillRect(30, 30, 135, 100, 10);
  ctx.stroke();
  ctx.closePath();

  print(SERVICE_LABEL, 40, 55);
}

// main animation loop
function animate() {
  clearScreen();
  drawApiFrontend();
  drawConsumingService();
  drawRotatingBalls();
  drawCentralBall();

  // print("mouse: " + mouseX + "," + mouseY, 10, 20, "#ffffff");
  if (hoverCentralBall()) {
    print("TODO: redirect to API", 20, 380);
    // window.location = "..."
  }

  requestAnimationFrame(animate);
}

function setup() {
  canvas = document.getElementById(APP_CANVAS);
  canvas.style.display = "block";

  ctx = canvas.getContext("2d");
  ctx.font = "20px Arial";

  // wire up mouse movements and to canvas
  canvas.addEventListener("mousemove", onMouseMove, false);

  // other mouse events:
  // canvas.addEventListener("mousedown", onMouseDown, false);
  // canvas.addEventListener("mouseup", onMouseUp, false);

  // placement of central hub
  centralBall = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 52,
    color: API_BG_COLOR,
  };

  setTimeout(populateBalls, 400);

  // Example: how to load image for a sprite
  // and when its loaded assign it to ball_sprite
  // so you can draw and move it around the canvas
  //  var img = new Image();
  //  img.src = "./ball_sprite.png";
  //  img.onload = function () {
  //    ball_sprite = img;
  //  };
}

function main() {
  setup();
  requestAnimationFrame(animate);
}

// wait for DOM ready so that document queries work correctly
document.addEventListener("DOMContentLoaded", (_event) => {
  main();
});
