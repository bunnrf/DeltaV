const Util = require("./util");

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
