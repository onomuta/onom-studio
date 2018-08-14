var myCanvas;
var x = 0;
var p_x = [10];
var p_c = [10];
var frame = 0;
var p5ClearTrg = false;
var canvasWidth = 1280;
var canvasHeight = 720;

function setup() {
  // var p5canvas = createCanvas(1280, 720, WEBGL);
  var p5canvas = createCanvas(1280, 720);
  if (window.devicePixelRatio == 2) {
    p5canvas = createCanvas(1280 /2, 720/2);
  }
  p5canvas.parent('stage');
  background(0);
  smooth();
  noStroke();

  ellipseMode( CORNER );
  rectMode( CENTER );
  myCanvas = document.getElementById('defaultCanvas0');
  renderInit();
}

function draw() {
  // clear();
  if(frame ==1){
    for (var i = 0; i < 10; i++){
      p_x[i] = Math.random() *width;
      p_c[i] = Math.random() *255;
    }
  }
  for (var i = 0; i < 10; i++){
    fill(p_c[i])
    rect(p_x[i], height / RENDER.duration * frame, 10, 120)
  }

  console.log(frame)
}

function p5CanvasCleaning(){
  if (p5ClearTrg == true) {
    p5ClearTrg = false;
  }
}


