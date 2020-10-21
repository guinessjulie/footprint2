import Point from './Vertex.js';

export default class Triangle{
    constructor(startPos, crntPos){
        this.v = [];
        
        //v1
        let x = startPos.x +  (crntPos.x - startPos.x)  /2;
        let y = startPos.y + (crntPos.y - startPos.y) / 2;
        let v1 = new Point(x, y)        
        this.v.push(v1);
        
        //v2
        x = startPos.x;
        y = crntPos.y;
        this.v.push(new Point(x, y));

        //v3
        x = crntPos.x;
        y = crntPos.y;
        this.v.push(new Point(x, y));

    }

    get vertices(){
        return this.v;
    }
}