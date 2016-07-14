const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.ship = this.game.addShip();
};

GameView.ROTATIONS = {
  "a": -0.005,
  "d": 0.005
};

GameView.prototype.bindKeyHandlers = function () {
  const ship = this.ship;

  Object.keys(GameView.ROTATIONS).forEach((k) => {
    let move = GameView.ROTATIONS[k];
    key(k, function () { ship.accelRot(move); } );
  });

  key("w", function () { ship.burn(); } );
  key("r", function () { ship.toggleReaction(); } );
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
