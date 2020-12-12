import {toBBox} from './utils.js'
//import Grid from './grid.js';
import Polygon from './Polygon.js'

export default class Parcel{
    constructor(vertices = [], gridsize = 30){
        this.vertices = vertices;
        this.poly = new Polygon(vertices);
        this.gridSize = gridsize;
        this.ctx = canvas.getContext('2d');
        if( vertices && vertices.length > 3){
            this.bbox = toBBox(vertices);
        }
        this.area = this.getArea();
    }
    getArea(){
        if(this.vertices.length > 2){
            return new Polygon(this.vertices).area();
        }
    }
    fromPolygon(polygon){
        this.vertices = polygon.vertices;
    }
    draw(color = "rgb(252, 186, 3, 0.5)"){
            // Filled triangle
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            const path = this.vertices[i];
            this.ctx.lineTo(path.x, path.y);            
        }
        this.ctx.closePath();            
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();
    }


//     constructor(vertices, gridSize=30){ //site should be the polygon
//         this.bbox = toBBox(vertices)        ;
//         this.gridSize = gridSize;
//         this.ctx = canvas.getContext('2d');
//         //this.ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
    
    addPoints() {
        this.vertices.forEach(pt => {
            this.bb.addPoint(pt)
        })
    }


}
