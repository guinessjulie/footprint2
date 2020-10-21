import { getCanvasCoords } from "./utils.js";

export default class Paint{
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext("2d")
    }
    set activeTool(tool){
        this.tool = tool;
        console.log(this.tool);
    }

    init(){
        this.canvas.onmousedown = e =>this.onMouseDown(e);
    }

    onMouseDown(e){
        this.canvas.onmousemove = e=>this.onMouseMove(e);        
        document.onmouseup = e=>this.onMouseUp(e);
        console.log(getCanvasCoords(e, this.canvas));
    }

    onMouseMove(e){
        console.log(getCanvasCoords(e, this.canvas));
    }

    onMouseUp(e){
        this.canvas.onmousemove = null;
        document.onmouseup=null;
    }
}