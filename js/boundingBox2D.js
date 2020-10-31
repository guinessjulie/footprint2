import Vec2 from './Vec2.js'

function BoundingBox2D(min, max){
    console.log('min', min , ', max', max );
    this.min = min ;
    this.max = max;
}
BoundingBox2D.prototype.isEmpty = function(){
    if(!this.min || !this.max) return true;
    else return true;
}

BoundingBox2D.prototype.addPoint = function(p){
    if(this.isEmpty()){
        this.min = p.clone();
        this.max = p.clone();
    }
    if (p.x < this.min.x) this.min.x = p.x;
    if (p.y < this.min.y) this.min.y = p.y;
    if (p.x > this.max.x) this.max.x = p.x;
    if (p.y > this.max.y) this.max.y = p.y;
}

BoundingBox2D.prototype.getSize = function(){
    return Vec2.create(this.max.x - this.min.x,
        this.max.y - this.min.y);
}

BoundingBox2D.prototype.getCenter = function(){
    return Vec2.create(
        this.min.x + (this.max.x - this.min.x) / 2,
        this.min.y + (this.max.y - this.min.y) / 2,
    )
}

BoundingBox2D.prototype.contains = function(p) {
    return p.x >= this.min.x
        && p.x <= this.max.x
        && p.y >= this.min.y
        && p.y <= this.max.y
}

export default BoundingBox2D
