//import Point from './Point.js';
import Vec2 from './Vec2.js';

export default class Triangle{
    constructor(startPos, crntPos){
        this.v = [];
        
        //v1
        let x = startPos.x +  (crntPos.x - startPos.x)  /2;
        let y = startPos.y + (crntPos.y - startPos.y) / 2;
        let v1 = new Vec2(x, y)        
        this.v.push(v1);
        
        //v2
        x = startPos.x;
        y = crntPos.y;
        this.v.push(new Vec2(x, y));

        //v3
        x = crntPos.x;
        y = crntPos.y;
        this.v.push(new Vec2(x, y));

    }

    get vertices(){
        return this.v;
    }
}