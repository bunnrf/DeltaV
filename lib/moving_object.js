const Util = require("./util");

const MovingObject = function (options) {
  this.pos       = options.pos;
  this.vel       = options.vel;
  this.rotVel    = options.rotVel || 0;
  this.rotation  = options.rotation;
  this.mass      = options.mass;
  this.thrust    = options.thrust || 0;
  this.torque    = options.torque || 1;
  this.radius    = options.radius;
  this.fixed     = options.fixed || false;
  this.color     = options.color;
  this.image     = options.image || undefined;
  this.game      = options.game;
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
  if (this.image) {
    ctx.drawImage(this.image, this.pos[0] - this.radius, this.pos[1] - this.radius, this.radius * 2, this.radius * 2);
  } else {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }
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
  this.rotation = this.rotation + this.rotVel;

  //dampen angular velocity
  //does not consider mass
  if (this.reactionControl) {
    this.accelRot(-this.rotVel / this.torque);
  }
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

MovingObject.prototype.accelRot = function (rotAcc) {
  this.rotVel += rotAcc;
};

module.exports = MovingObject;
