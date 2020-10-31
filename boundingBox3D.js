/*source from : https://vorg.github.io/pex/*/
 /**
  * Example use
 var right = new Vec3(0, 1, 0);
 var forward = new Vec3(0, 0, -1);
 var up = Vec3.create().asCross(right, foward);
  */
var Vec3 = require('./Vec3');
/*
BoundingBox3D ( min, max )
min - { Vec3 }
max - { Vec3 }
*/
 
function BoundingBox3D(min, max) {
  this.min = min;
  this.max = max;
}
/*
fromPositionSize ( pos, size )
pos - The position of the enclosed geometry { Vec3 }
size - Size of the enclosed geometry { Vec3 }
returns { BoundingBox3D }
*/
BoundingBox3D.fromPositionSize = function(pos, size) {
  return new BoundingBox3D(Vec3.create(pos.x - size.x / 2,
                                     pos.y - size.y / 2,
                                     pos.z - size.z / 2),
                                     Vec3.create(pos.x + size.x / 2,
                                                 pos.y + size.y / 2,
                                                 pos.z + size.z / 2));
};

/*
fromPoints ( points )
points - Points in space that the bounding box will enclose { Array of { Vec3 } }
returns { BoundingBox3D }
*/
BoundingBox3D.fromPoints = function(points) {
  var bbox = new BoundingBox3D(points[0].clone(), points[0].clone());
  points.forEach(bbox.addPoint.bind(bbox));
  return bbox;
};
/*
isEmpty ()
returns { Boolean }
*/
BoundingBox3D.prototype.isEmpty = function() {
  if (!this.min || !this.max) return true;
  else return false;
};
/*
addPoint (p)
p - point to be added to the enclosing space of the bounding box { Vec3 }
*/
 
BoundingBox3D.prototype.addPoint = function(p) {
  if (this.isEmpty()) {
    this.min = p.clone();
    this.max = p.clone();
  }
  if (p.x < this.min.x) this.min.x = p.x;
  if (p.y < this.min.y) this.min.y = p.y;
  if (p.z < this.min.z) this.min.z = p.z;
  if (p.x > this.max.x) this.max.x = p.x;
  if (p.y > this.max.y) this.max.y = p.y;
  if (p.z > this.max.z) this.max.z = p.z;
};
/*
getSize ()
returns the size of the bounding box as a { Vec3 }
*/
 
BoundingBox3D.prototype.getSize = function() {
  return Vec3.create(this.max.x - this.min.x,
                     this.max.y - this.min.y,
                     this.max.z - this.min.z);
};
/*
getCenter ()
returns the center of the bounding box as a { Vec3 }
*/
 
BoundingBox3D.prototype.getCenter = function() {
  return Vec3.create(this.min.x + (this.max.x - this.min.x) / 2,
                     this.min.y + (this.max.y - this.min.y) / 2,
                     this.min.z + (this.max.z - this.min.z) / 2);
};
/*
contains(p)
returns true if point is inside the bounding box
*/
 
BoundingBox3D.prototype.contains = function(p) {
  return p.x >= this.min.x
      && p.x <= this.max.x
      && p.y >= this.min.y
      && p.y <= this.max.y
      && p.z >= this.min.z
      && p.z <= this.max.z;
}

module.exports = BoundingBox3D;