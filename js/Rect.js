//import Point from './Point.js'
import Vec2 from './Vec2.js' 

export default class Rect {
    constructor(ptStart, ptCrnt){
        this.ptStart = ptStart;
        this.width = ptCrnt.x - ptStart.x ;
        this.height = ptCrnt.y -  ptStart.y ;
    }
    toPolygon(){
        let vertices = [];
        vertices.push(this.ptStart)
        //vertices.push(new Point(this.ptStart.x, this.ptStart.y + this.height))
        vertices.push(new Vec2(this.ptStart.x, this.ptStart.y + this.height))

        //vertices.push(new Point(this.ptStart.x + this.width, this.ptStart.y + this.height))
        vertices.push(new Vec2(this.ptStart.x + this.width, this.ptStart.y + this.height))
        //vertices.push(new Point(this.ptStart.x + this.width, this.ptStart.y))
        vertices.push(new Vec2(this.ptStart.x + this.width, this.ptStart.y))
        return vertices;
    }
}