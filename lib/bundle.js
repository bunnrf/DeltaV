/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Planet = __webpack_require__(3);
	const Ship = __webpack_require__(6);
	const Util = __webpack_require__(4);
	
	const Game = function() {
	  this.planets = [];
	  this.ships = [];
	
	  this.addEarth();
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.BG_COLOR = "#000000";
	
	Game.prototype.add = function (object) {
	  if (object instanceof Planet) {
	    this.planets.push(object);
	  } else if (object instanceof Ship) {
	    this.ships.push(object);
	  } else {
	    throw "unrecognized object";
	  }
	};
	
	Game.prototype.addEarth = function() {
	  const earth = new Planet({
	    pos: [Game.DIM_X / 2, Game.DIM_Y / 2],
	    vel: [0, 0],
	    mass: 100,
	    radius: 50,
	    color: "blue",
	    fixed: true,
	    game: this
	  });
	
	  this.add(earth);
	
	  return earth;
	};
	
	Game.prototype.addShip = function () {
	  const ship = new Ship({
	    pos: [(Game.DIM_X / 2) + 100, Game.DIM_Y / 2],
	    vel: [0, 1.11],
	    color: "red",
	    game: this
	  });
	
	  this.add(ship);
	
	  return ship;
	};
	
	Game.prototype.allObjects = function () {
	  return [].concat(this.planets, this.ships);
	};
	
	Game.prototype.physicsStep = function () {
	  const allObjects = this.allObjects();
	  for (let i = 0; i < allObjects.length; i++) {
	    for (let j = i + 1; j < allObjects.length; j++) {
	      const obj1 = allObjects[i];
	      const obj2 = allObjects[j];
	
	      const force = Util.grav(obj1, obj2);
	
	      obj1.applyForce(force.map(dir => -dir));
	      obj2.applyForce(force);
	
	      if (obj1.isCollidedWith(obj2)) {
	        const collision = obj1.collideWith(obj2);
	        if (collision) return;
	      }
	    }
	  }
	};
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  this.allObjects().forEach((object) => {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.moveObjects = function (delta) {
	  this.allObjects().forEach((object) => {
	    object.move(delta);
	  });
	};
	
	Game.prototype.remove = function (object) {
	  if (object instanceof Planet) {
	    this.planets.splice(this.planets.indexOf(object), 1);
	  } else if (object instanceof Ship) {
	    this.ships.splice(this.ships.indexOf(object), 1);
	  } else {
	    throw "unrecognized object";
	  }
	};
	
	Game.prototype.step = function (delta) {
	  this.moveObjects(delta);
	  this.physicsStep();
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	const GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.ship = this.game.addShip();
	};
	
	GameView.MOVES = {
	  "w": [ 0, -0.1],
	  "a": [-0.1,  0],
	  "s": [ 0,  0.1],
	  "d": [ 0.1,  0],
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  const ship = this.ship;
	
	  Object.keys(GameView.MOVES).forEach((k) => {
	    let move = GameView.MOVES[k];
	    key(k, function () { ship.accelerate(move); });
	  });
	};
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  //start the animation
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  const timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);
	const Ship = __webpack_require__(6);
	
	const DEFAULTS = {
		COLOR: "#505050",
	};
	
	const Planet = function (options = {}) {
	  options.pos = options.pos;
	  options.vel = options.vel;
	  options.mass = options.mass;
	  options.radius = options.radius;
	  options.color = options.color || DEFAULTS.COLOR;
	
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Planet, MovingObject);
	
	Planet.prototype.collideWith = function (otherObject) {
	  if (otherObject instanceof Ship) {
	    otherObject.relocate();
			return true;
		}
	};
	
	module.exports = Planet;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  BIG_G: 1.87,
	
	  angle (pos1, pos2) {
	    return Math.atan2(pos1[1] - pos2[1], pos1[0] - pos2[0]);
	  },
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find acceleration due to gravity between two objects.
	  // obj = { pos: pos, mass: mass }
	  grav (obj1, obj2) {
	    const magnitude = Util.magnitude(obj1, obj2);
	    const angle = Util.angle(obj1.pos, obj2.pos);
	
	    const force_x = magnitude * Math.cos(angle);
	    const force_y = magnitude * Math.sin(angle);
	
	    return [force_x, force_y];
	  },
	
	  magnitude (obj1, obj2) {
	    const dist = Util.dist(obj1.pos, obj2.pos);
	    console.log(dist);
	    return Util.BIG_G * obj1.mass * obj2.mass / (Math.pow(dist, 2));
	  },
	  // Find the length of the vector.
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  inherits (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	// obj1 = {mass: 1, pos: [600, 300]};
	// obj2 = {mass: 100, pos: [500, 300]};
	// console.log(magnitude(obj1, obj2));
	// console.log(angle(obj1, obj2));
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
	const MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.mass = options.mass;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.fixed = options.fixed || false;
	  this.game = options.game;
	};
	
	MovingObject.prototype.accelerate = function (impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};
	
	MovingObject.prototype.applyForce = function (force) {
	  if (this.fixed) {
	    return;
	  }
	  this.accelerate([force[0] / this.mass, force[1] / this.mass]);
	};
	
	MovingObject.prototype.collideWith = function (otherObject) {
	  // default do nothing
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  const centerDist = Util.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function (timeDelta) {
	  //timeDelta is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	
	function randomColor() {
	  var hexDigits = "0123456789ABCDEF";
	
	  var color = "#";
	  for (var i = 0; i < 3; i ++) {
	    color += hexDigits[Math.floor((Math.random() * 16))];
	  }
	
	  return color;
	}
	
	var Ship = function (options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.mass = options.mass || 1;
	  options.radius = Ship.RADIUS;
	  options.color = options.color || randomColor();
	
	  MovingObject.call(this, options);
	};
	
	Ship.RADIUS = 10;
	
	Util.inherits(Ship, MovingObject);
	
	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};
	
	module.exports = Ship;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map