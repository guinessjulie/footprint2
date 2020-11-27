import BoundingBox2D from './boundingBox2D.js'
import {toBBox, toGrid } from './utils.js'
import {domRectToPolygon} from './utils.js'
import Rect from './Rect.js'
import {paint} from './app.js'
import Grid from './grid.js';
import Vec2 from './Vec2.js'

export default class Parcel{
    constructor(vertices = [], gridsize = 30){
        this.vertices = vertices;
        this.gridSize = gridsize;
        this.ctx = canvas.getContext('2d');
        if( vertices && vertices.length > 3){
            this.bbox = toBBox(vertices);
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
export let parcel // oh i don't like to use global variable no matter how javascripts sucks
const createDefaultParcel = () =>{
    let domRect = canvas.getBoundingClientRect();    
    let rect = new Rect(new Vec2(0,0), new Vec2(domRect.width, domRect.height))
    let vertices = rect.toPolygon()
    parcel = new Parcel(vertices);
    //parcel = new Parcel(domRectToPolygon(domRect)); // 현재는 그냥 캔버스 크기로 정함
}

export function onParcel(){
    if(paint){
        let i = 0;//todo to select parcel
        let poly = paint.toParcel(i);
        if(poly == undefined ){
            createDefaultParcel();
        }
        else{
            parcel = new Parcel(poly, 30)
        }
    }
    else{
        createDefaultParcel()
    }
    //todo get polygon from t
}
export function onGrid(){
    if(parcel == undefined){
        onParcel();
    }
    parcel.grid = new Grid(parcel.bbox.min, parcel.bbox.max, 30)    ;
    //parcel.grid = new Grid(parcel.bbox.min, parcel.bbox.max, 10)    
}

export function onValidate() {
    console.log('onValidate', this);
    parcel.grid.onValidateCell(parcel.vertices);
}

export function onFootPrint(){
    parcel.grid.onStartFootPrint(10);
}

export function onParcelFootprint(){
    if(parcel){
        parcel.draw();
    }
    if(parcel.grid){
        parcel.grid.onCreateFloor(parcel.vertices)
    }
}

export function onPopulate(){
    parcel.grid.onPopulate()
}