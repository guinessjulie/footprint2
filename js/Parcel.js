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
    }
    setup(){

    }

    draw(){

    }

    update(){

    }



    addPoints(){
        console.log('isadded')
        this.site.vertices.forEach(pt => {
            this.bb.addPoint(pt)
        })
    }
}

export function parcelMenuClickHandle(){
    let rect = canvas.getBoundingClientRect();            
    //todo from polygon or other geometry
    let parcel = new Parcel(rectToPolygon(rect)) // 현재는 그냥 캔버스 크기로 정함
    //todo parcel = new Parcel(fromPolygon)
    let grids = new Grid(parcel.bbox.min, parcel.bbox.max, 10)
    grids.createGrid();
    //let grids = parcel.createGrid()
    console.log(grids)
}
