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
