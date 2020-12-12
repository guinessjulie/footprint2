import {parcel} from "./ProcessParcel.js";
import {drawOnCanvas} from "./utils.js";

export default class OptimalFootprint{
    constructor(footprint){
        this.canvas = document.getElementById('canvas-generation');
        this.ctx = this.canvas.getContext("2d");
        drawOnCanvas('canvas-generation', parcel.vertices, "red");
        footprint.displayCells(footprint.validFootprintMatrix, 1, 'black');
    }


}