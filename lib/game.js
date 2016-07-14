const Planet = require("./planet");
const Ship = require("./ship");
const Util = require("./util");

const Game = function() {
  this.planets = [];
  this.ships = [];

  this.addSun();
  this.addEarth();
};

Game.DIM_X = 5000;
Game.DIM_Y = 3000;
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

Game.prototype.addSun = function() {
  const sun = new Planet({
    pos: [Game.DIM_X / 2, Game.DIM_Y / 2],
    vel: [0, 0],
    mass: 10000,
    radius: 250,
    fixed: true,
    color: "yellow",
    game: this
  });

  this.add(sun);

  return sun;
};

Game.prototype.addEarth = function() {
  const earth = new Planet({
    pos: [Game.DIM_X / 2 + 1000, Game.DIM_Y / 2],
    vel: [0, 1.4],
    mass: 500,
    radius: 50,
    color: "blue",
    game: this
  });

  this.add(earth);

  return earth;
};

Game.prototype.addShip = function () {
  const ship = new Ship({
    pos: [Game.DIM_X / 2 + 1000, Game.DIM_Y / 2 + 200],
    vel: [.7, 1.4],
    mass: 1,
    heading: Math.PI,
    color: "green",
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
