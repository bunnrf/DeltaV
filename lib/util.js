const Util = {
  BIG_G: .51,

  angle (pos1, pos2) {
    return Math.atan2(pos1[1] - pos2[1], pos1[0] - pos2[0]);
  },
  // Normalize the length of the vector to 1, maintaining direction.
  dir (vec) {
    const norm = Util.norm(vec);
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

    return Util.scalar(magnitude, angle);
  },

  magnitude (obj1, obj2) {
    const dist = Util.dist(obj1.pos, obj2.pos);
    return Util.BIG_G * obj1.mass * obj2.mass / (Math.pow(dist, 2));
  },
  // Find the length of the vector.
  norm (vec) {
    return Util.dist([0, 0], vec);
  },
  // Return a randomly oriented vector with the given length.
  randomVec (length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scalar (magnitude, angle) {
    const force_x = magnitude * Math.cos(angle);
    const force_y = magnitude * Math.sin(angle);

    return [force_x, force_y];
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

module.exports = Util;
