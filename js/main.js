var Stopwatch = function(elem, options) {

  var timer       = createTimer(),
      offset,
      clock,
      interval;

  // default options
  options = options || {};
  options.delay = options.delay || 1;

  // append elements     
  elem.appendChild(timer);

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render();
  }

  function update() {
    clock += delta();
    render();
  }

  function render() {
    if(clock > lastTicks + (_pauseSeconds * 1000)){
      lastTicks = clock;
      setBall();
    }
  }

  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }

  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
};

var stopWatch;
var _pauseSeconds = 5;

function startGame() {
  stopWatch.stop();
  stopWatch.reset();
  stopWatch.start();
  $("#start-btn").attr("disabled", "disabled");

  var gameType = $("#game-type").find(":selected").text();

  if(gameType == "X")
  {
    for(var i = 0; i < balls.length; ++i) {
      if(balls[i].startsWith("N")) {
        usedBalls.push(i);
      }
    }
  } else if(gameType == "Four Corners") {
    for(var i = 0; i < balls.length; ++i) {
      if(balls[i].startsWith("I") || balls[i].startsWith("N") || balls[i].startsWith("G")) {
        usedBalls.push(i);
      }
    }
  }

  setBall();
}

function resetGame() {
  stopWatch.stop();
  stopWatch.reset();
  lastTicks = 0;

  usedBalls = [-1];
  $("#ball").html('');
  $("#balls").html('');
  $("#start-btn").removeAttr("disabled");
}

function togglePauseGame() {


  stopWatch.stop();
  stopWatch.reset();
  lastTicks = 0;

  usedBalls = [-1];
  $("#ball").html('');
  $("#balls").html('');
  $("#start-btn").removeAttr("disabled");
}

$(function() {
  stopWatch = new Stopwatch($("#stopwatch")[0]);
  
  $("#pause-seconds").change(pauseSecondsChange);
  pauseSecondsChange();
});

function pauseSecondsChange() {
  var pauseSeconds = $("#pause-seconds");
  _pauseSeconds = parseInt(pauseSeconds.find(":selected").text());
}

function getNextBall(){
  if(usedBalls.length == balls.length)
  {
    return "";
  }

  var nextBallNumber = parseInt(getRandomArbitrary(0, balls.length));

  while(usedBalls.indexOf(nextBallNumber) >= 0) {
     nextBallNumber = parseInt(getRandomArbitrary(0, balls.length));
  }

  usedBalls.push(nextBallNumber);

  $("#ball").html(balls[nextBallNumber]);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function setBall(){
  $ball = $("#ball");
  $balls = $("#balls");
  if($.trim($('#balls').html()).length != 0){
    $("#balls").prepend(" - ");
  }
  $balls.prepend(ball.innerHTML);
  $ball.innerHTML = getNextBall();
}

var usedBalls = [-1];
var lastTicks = 0;
