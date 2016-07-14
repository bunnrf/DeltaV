var Util = require("./util");
var MovingObject = require("./moving_object");

function randomColor() {
  var hexDigits = "0123456789ABCDEF";

  var color = "#";
  for (var i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

var Ship = function (options) {
  options.vel = options.vel || [0, 0];
  options.mass = options.mass || 1;
  options.radius = options.radius || Ship.RADIUS;
  options.rotation = options.rotation || 0;
  options.thrust = options.thrust || .01;
  options.torque = options.torque || 100;
  options.color = options.color || randomColor();

  MovingObject.call(this, options);
};

Ship.RADIUS = 5;

Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

// overwrites MovingObject.draw
Ship.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;

  const x = this.pos[0];
  const y = this.pos[1];

  ctx.save(); // saves the coordinate system
  ctx.translate(x, y); // now the position (0, 0) is found at (x, y)
  ctx.rotate(this.rotation); // rotate around the start point of your line
  ctx.beginPath();
  ctx.moveTo(this.radius * 2, 0);
  ctx.lineTo(0 - this.radius, this.radius);
  ctx.bezierCurveTo(0, 0, 0, 0, 0 - this.radius, 0 - this.radius);
  ctx.fill();
  ctx.restore(); // restores the coordinate system back to (0, 0)
};

Ship.prototype.burn = function () {
  const force = Util.scalar(this.thrust, this.rotation);
  this.applyForce(force);
};

Ship.prototype.toggleReaction = function () {
  this.reactionControl = !this.reactionControl;
};

module.exports = Ship;
