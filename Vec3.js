/*source from : https://vorg.github.io/pex/*//*
*var right = new Vec3(0, 1, 0);
*var forward = new Vec3(0, 0, -1);
*var up = Vec3.create().asCross(right, foward);
*/

function Vec3(x, y, z){
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    this.z = z != null ? z : 0;
}

Vec3.create = function(x, y, z){
    return new Vec3(x, y, z);
}

Vec3.fromArray = a => new Vec3(a[0], a[1], a[2]);

Vec3.prototype.set = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
}

Vec3.prototype.equals = function(v, tolerance){
    if(tolerance == undefined){
        tolerance = 0.0000001;
    }
    return (Math.abs(this.x-v.x) <= tolerance ) &&
            (Math.abs(this.y-v.y) <= tolerance) &&
            (Math.abs(this.z-v.z) <= tolerance)
}

Vec3.prototype.add = v =>{
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
}

Vec3.prototype.subtract = v =>{
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
}

Vec3.prototype.distance = v=>{
    let dx = v.x - this.x;
    let dy = v.y - this.y;
    let dz = v.z - this.z;
    return Math.sqrt(dx*dx + dy* dy + dz*dz)
}

Vec3.prototype.squareDistance = v =>{
    let dx = v.x - this.x;
    let dy = v.y - this.y;
    let dz = v.z - this.z;
    return dx*dx + dy*dy + dz*dz    
}

Vec3.prototype.copy = v =>{
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
}

Vec3.prototype.clone = () =>{
    return new Vec3(this.x, this.y, this.z)
}

Vec3.prototype.dup = function(){
    return this.clone();
}
Vec3.prototype.dot = function(b){
    return this.x*b.x + this.y*b.y + this.z * b.z;
}
/**Computes cross product with another vector */
Vec3.prototype.cross = function(v) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var vx = v.x;
    var vy = v.y;
    var vz = v.z;
    this.x = y * vz - z * vy;
    this.y = z * vx - x * vz;
    this.z = x * vy - y * vx;
    return this;
  };

  Vec3.prototype.asAdd = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  };

  Vec3.prototype.asSub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  };

  Vec3.prototype.asCross = function(a, b) {
    return this.copy(a).cross(b);
  };
  
 /**
 * addScaled(a, f)
* Add another vector with scaling it first
* @a - { Vec3 }
* @f - { Number }
 */
  Vec3.prototype.addScaled = function(a, f) {
    this.x += a.x * f;
    this.y += a.y * f;
    this.z += a.z * f;
    return this;
  };

  Vec3.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };

  Vec3.prototype.limit = function(s) {
    var len = this.length();
  
    if (len > s && len > 0) {
      this.scale(s / len);
    }
  
    return this;
  };
/**
 * Interpolates between this and another vector by given factor
 * 
 * {lerp(a, f)
 * @param v - { Vec3 }
 * @param f - { Number }} v 
 */
  Vec3.prototype.lerp = function(v, t) {
    this.x = this.x + (v.x - this.x) * t;
    this.y = this.y + (v.y - this.y) * t;
    this.z = this.z + (v.z - this.z) * t;
    return this;
  }

  Vec3.prototype.transformMat4 = function(m) {
    var x = m.a14 + m.a11 * this.x + m.a12 * this.y + m.a13 * this.z;
    var y = m.a24 + m.a21 * this.x + m.a22 * this.y + m.a23 * this.z;
    var z = m.a34 + m.a31 * this.x + m.a32 * this.y + m.a33 * this.z;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  };
  /**
   * transformMat4
   * Transforms this vector by given matrix 
   * @param {m} quat 
   */
  Vec3.prototype.transformQuat = function(q) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;
    var qw = q.w;
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  };

  Vec3.prototype.toString = function() {
    return "{" + Math.floor(this.x*1000)/1000 + ", " + Math.floor(this.y*1000)/1000 + ", " + Math.floor(this.z*1000)/1000 + "}";
  };
/*************
 * hash()
*  Returns naive hash string representation of this vector
 */
  Vec3.prototype.hash = function() {
    return 1 * this.x + 12 * this.y + 123 * this.z;
  };

  Vec3.Zero = new Vec3(0, 0, 0);

  module.exports = Vec3;