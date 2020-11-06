import BoundingBox2D from './boundingBox2D.js'
import {toBBox, toGrid } from './utils.js'
import {rectToPolygon} from './utils.js'
import {paint} from './app.js'
import Grid from './grid.js';

export default class Parcel{
    constructor(site, gridSize){
        this.site = site;
        this.bbox = toBBox(site.vertices)        ;
        this.gridSize = gridSize;
        this.ctx = canvas.getContext('2d');
        //this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    addPoints() {
        console.log('isadded')
        this.site.vertices.forEach(pt => {
            this.bb.addPoint(pt)
        })
    }


}
let parcel // oh i don't like to use global variable no matter how javascripts sucks
export function onParcel(){
    if(paint){
        let i = 0;//todo to select parcel
        let poly = paint.toParcel(i);
        parcel = new Parcel(poly, 30)
    }
    else{
        let rect = canvas.getBoundingClientRect();            
        parcel = new Parcel(rectToPolygon(rect)); // 현재는 그냥 캔버스 크기로 정함
    }
    //todo get polygon from the map
}
export function onGrid(){
    parcel.grid = new Grid(parcel.bbox.min, parcel.bbox.max, 30)    
    //parcel.grid = new Grid(parcel.bbox.min, parcel.bbox.max, 10)    
}
export function onFootPrint(){
    parcel.grid.startFootPrint(10);
}
export function testHandle(){
    console.log('testHandle')
    //parcel.grid.testFootPrint(10)
    parcel.grid.testDisplayCell(50)
}