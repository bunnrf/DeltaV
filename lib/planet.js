const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");

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
