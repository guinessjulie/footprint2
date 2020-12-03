import BoundingBox2D from './boundingBox2D.js'
import {toBBox, toGrid } from './utils.js'
import {domRectToPolygon} from './utils.js'
import Rect from './Rect.js'
import {paint} from './app.js'
//import Grid from './grid.js';
import Grid from './grid2.js';
import Vec2 from './Vec2.js'
import { matrixValCount } from './ga/fitness.js'
import { dnaLength  } from './gaParams.js'
import Polygon from './Polygon.js'
import Parcel from './Parcel.js'
import {permitFaRatio} from './global.js';
import DNA from './ga/dna.js'
//from menu execution, a instance of parcel is globaly used.

export let parcel;
export let grid;
const createDefaultParcel = () =>{
    let domRect = canvas.getBoundingClientRect();    
    let rect = new Rect(new Vec2(0,0), new Vec2(domRect.width, domRect.height))
    let vertices = rect.toPolygon()
    parcel = new Parcel(vertices);
    return parcel;
    //parcel = new Parcel(domRectToPolygon(domRect)); // 현재는 그냥 캔버스 크기로 정함
}

export function onParcel(){
    if(paint){
        let i = 0;//todo to select parcel
        let poly = paint.toParcel(i);
        if(poly == undefined ){
            parcel = createDefaultParcel();
        }
        else{
            parcel = new Parcel(poly, 30)
        }
    }
    else{
        parcel = createDefaultParcel()
    }
    return parcel;
    //todo get polygon from t
}
export function onGrid(){
    if(parcel == undefined){
        parcel = onParcel();
    }
    //parcel.grid = new Grid(parcel.bbox.min, parcel.bbox.max, 30)    ;
    grid = new Grid(parcel.bbox.min, parcel.bbox.max, 30)    ;
    return grid;
}

export function onFootPrint(){
    if(parcel == undefined) parcel = onParcel();
    if(grid==undefined) grid = onGrid();
    grid.onStartFootPrint();
    
}


export function onValidate() {
    if(parcel == undefined)  parcel = onParcel();
    if(grid == undefined) grid = onGrid();
    if(grid.activeCell == 0) grid.activeCell= onFootPrint();
    grid.onValidateCell(parcel.vertices);
}
export function onParcelFootprint(){
    if(parcel == undefined) parcel = onParcel();
    if(grid == undefined)  grid = onGrid();
    if(grid.activeCell == 0)  grid.activeCell =onFootPrint();
    if(matrixValCount(grid.foot, 1) == 0 
        || matrixValCount(grid.validGrid == 0)){
            grid.onValidateCell(parcel.vertices)
        }
    if(parcel){
        parcel.draw();
    }
    if(grid){
        grid.onPreview(parcel.vertices)
    }
}
export function getParcel(){
    if(parcel){
        return parcel.vertices;
    }
    else{
        return createDefaultParcel().vertices;
    }
}

export function onPopulate(){
    if(parcel == undefined)  parcel = onParcel();
    if(grid == undefined)  grid = onGrid();
    grid.onPopulate();

}
    //todo DNA 클라스에서  gene  생성하는 걸 맞기자.
    //transform from onStartFootPrint to createDNA
export function  createDNA(){
        if(parcel == undefined){
            parcel = onParcel()
        }
        if(grid== undefined) grid=onGrid();
        let iter = dnaLength(parcel.area, permitFaRatio);
        let dna = new DNA(iter, {cols:grid.cols, rows: grid.rows})
        //forTests
        grid.dnaToFootprintMatrix(dna);
        return dna;
    }

    