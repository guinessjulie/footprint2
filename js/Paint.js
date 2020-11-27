import {getCanvasCoords} from './utils.js'
import Line from './Line.js';
import Rect from './Rect.js';
import Circle from './Circle.js';
import Triangle from './Triangle.js';
import {
    TOOL_ERASER,
    TOOL_BRUSH,
    TOOL_BUCKET, 
    TOOL_PEN, 
    TOOL_RECT, 
    TOOL_LINE ,    TOOL_CIRCLE, 
    TOOL_TRI,
    TOOL_POLYGON,
    MENU_PARCEL
} from './Tools.js'
import Polygon from './Polygon.js';
import Pen from './Pen.js';
import Fill from './fill.js';

export default class Paint{
    constructor(canvasId){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 1;
        this.brushsize = 4;
        this.color = '#000'
        this.ctx.strokeStyle =this.color;                
    }
    set activeTool (tool){
        this.tool = tool;
    }
    set lineWidth (linewidth){
        this._linewidth = linewidth;
        this.ctx.lineWidth = this._linewidth;
        console.log('set paint lineWidth'+ this.ctx.lineWidth);
        
    }
    set brushSize ( brushsize){
        this.brushsize = brushsize;
    }

    set selectColor(color){
        this.color = color;
        this.ctx.strokeStyle = color;
        console.log('color', color , ', this.ctx.strokeStyle', this.ctx.strokeStyle );
    }
    init(){
        this.canvas.onmousedown = (e)=> this.onMouseDown(e);
    }
    onMouseDown(e){
        console.log('MouseDown', this.tool, e)

        if(this.tool === MENU_PARCEL ){
            let elt = canvas.getBoundingClientRect()
            console.log(elt)
            //this.ga = new Ga()
        }
        this.canvas.onmousemove = (e) => this.onMouseMove(e);
        document.onmouseup = (e)=> this.onMouseUp(e);
        this.canvas.oncontextmenu = (e) =>this.onContextMenu(e);
        switch(this.tool){
            case TOOL_POLYGON:
                if(e.which == 1){
                    this.mouseDownPolygon(e)
                }
                break;
            case TOOL_LINE :
            case TOOL_RECT: 
            case TOOL_CIRCLE: 
            case TOOL_TRI:
                this.initDraw(e)
                break;
            case TOOL_PEN:
            case TOOL_BRUSH:        
                this.startPos = getCanvasCoords(e, canvas);
                this.initPen(e);
                break;
            case TOOL_BUCKET: 
                //todo fill color
                this.startPos = getCanvasCoords(e, canvas);
                
                new Fill(this.canvas, Math.round(this.startPos.x), Math.round(this.startPos.y), this.color);
                break;
            case TOOL_ERASER:             
            default:
                break;
        }
    }
    registerMouseHandle(e){

    }
    initDraw(e){
        this.screenSaved= this.ctx.getImageData(0,0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.startPos = getCanvasCoords(e, canvas);        
    }
    initPen(e){
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPos.x, this.startPos.y)   ;
        if(this.tool === TOOL_PEN) {
            this.penStroke = new Pen(this.startPos, this.ctx.lineWidth);        
        } else if(this.tool === TOOL_BRUSH){
            this.penStroke = new Pen(this.startPos, this.brushsize);
        }
    }
    mouseDownPolygon(e){
        this.screenSaved= this.ctx.getImageData(0,0, this.canvas.clientWidth, this.canvas.clientHeight);
        //create polygon
        if(e.which == 1) { 
            if(this.polygon == undefined || this.polygon == null ){
                this.initPolygon(e);
                console.log('initPolygon', this.startPos);

            }
        }

    }
    initPolygon(e){
        this.polygon = new Polygon();
        this.startPos = getCanvasCoords(e, canvas); //start point
        this.lastPos = getCanvasCoords(e, canvas); //for vertex
        this.crntPos = getCanvasCoords(e, canvas); //for drawing
    }
 
    onContextMenu(e){
        e.preventDefault();
    }

  
    onMouseUp(e){ //from document up
        switch(this.tool){
            case TOOL_POLYGON:
                if(e.which ===1){
                    this.lastPos = getCanvasCoords(e, canvas)
                    if(this.polygon){
                        this.polygon.addVer(this.lastPos);
                    }
                }
                else if(e.which == 3){
                    this.finalizePolygon(e);
                }
                break;
            default:
                case TOOL_PEN:
                this.finalizeDrawGeom(e)
                break;
        }
    }


    finalizeDrawGeom(e){
        switch(this.tool){
            case TOOL_LINE:
                this.finalizeLine();
                break;
            case TOOL_RECT:
                this.finalizeRect();
                break;
            case TOOL_CIRCLE:
                this.finalizeCircle();
                break;
            case TOOL_TRI:
                this.finalizeTriangle();
                break;
            case TOOL_POLYGON:
                this.finalizePolygon();
                break;
            case TOOL_PEN:
                this.finalizePen()
            default:
                break;

        }
        this.canvas.onmousemove = null;        
    }
    finalizeLine(){
        let line = new Line(this.startPos, this.crntPos); //to distinguish tool line named geomLine
        if(this.lines == undefined){
            this.lines = [];
        }
        this.lines.push(line);
    }
    finalizeRect(){
        let rect = new Rect(this.startPos, this.crntPos);
        if(this.rects  == undefined){
            this.rects = [];
        }                
        this.rects.push(rect); 

    }
    finalizeCircle(){
        let w = this.crntPos.x -this.startPos.x;
        let h = this.crntPos.y -this.startPos.y;
        let radius = Math.sqrt(w*w + h*h);
        let circle = new Circle(this.startPos.x, this.startPos.y,radius)
        if(this.circles == undefined){
            this.circles=[];
        }
        this.circles.push(circle);
        console.log('this.circles', this.circles  );
    }

    finalizeTriangle(){
        let triangle = new Triangle(this.startPos, this.crntPos);
        if(this.triangles == undefined){
            this.triangles=[];
        }
        this.triangles.push(triangle);
        
    }
    finalizePolygon(){
        if(this.polygons == undefined){
            this.polygons = [];
        }
        if(this.polygon || this.polygon.vertices.length > 3){
            this.ctx.putImageData(this.screenSaved, 0,0)
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastPos.x, this.lastPos.y)
            this.ctx.lineTo(this.startPos.x, this.startPos.y);
            this.ctx.stroke();

            this.polygons.push(this.polygon); 
            this.polygon = null;
            this.startPos = null;
            this.lastPos = null;
            this.crntPos = null;
        } 
        this.canvas.onmousemove=null;
        this.canvas.onmouseup = null
    }
    finalizePen(){
        if(this.penStroke == undefined || this.penStroke== null) return;

        this.penStroke.endPen();
        if (this.freeshapes == undefined){
            this.freeshapes = []
        }
        this.freeshapes.push(this.penStroke)
        this.penStroke = null;
        this.canvas.onmousemove=null;
        document.onmouseup = null;
    }
    onMouseMove(e){

        switch(this.tool){
            case TOOL_POLYGON:
                this.drawPolygon(e);
                break;
            case TOOL_BRUSH:
                console.log('this.brushsize', this.brushsize );               
                this.drawPen(e, this.brushsize)
                break;
            case TOOL_PEN:
                this.drawPen(e, this._linewidth);
                break;
            default:
                this.drawGeomShape(e);
                break;
        }
    }
    drawPen(e, linewidth){
        this.crntPos = getCanvasCoords(e, canvas);
        this.ctx.lineWidth = linewidth
        this.ctx.lineTo(this.crntPos.x, this.crntPos.y);
        this.ctx.stroke();
        this.penStroke.addStroke(this.crntPos);
    }
    drawPolygon(e){
        //this.ctx.beginPath();
        
        this.ctx.putImageData(this.screenSaved, 0, 0);
        this.crntPos = getCanvasCoords(e, canvas);
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastPos.x, this.lastPos.y)
        this.ctx.lineTo(this.crntPos.x, this.crntPos.y);
        this.ctx.stroke();
        //todo at when polygon object started beginPath()
    }
    drawGeomShape(e){
        this.ctx.putImageData(this.screenSaved, 0, 0);
        this.crntPos = getCanvasCoords(e, canvas);
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPos.x, this.startPos.y)
        let geomWidth = this.crntPos.x -this.startPos.x;
        let geomHeight = this.crntPos.y- this.startPos.y;
        

        switch(this.tool){
            case TOOL_LINE:
                this.ctx.lineTo(this.crntPos.x, this.crntPos.y);
                break;
            case TOOL_RECT:
                this.ctx.rect(this.startPos.x, this.startPos.y,geomWidth , geomHeight);
                break;
            case TOOL_CIRCLE:
                let radius = Math.sqrt(geomWidth*geomWidth + geomHeight*geomHeight);
                this.ctx.moveTo(this.startPos.x + radius, this.startPos.y);
                this.ctx.arc(this.startPos.x, this.startPos.y, radius, 0, Math.PI * 2, false);                
                break;
            case TOOL_TRI:
                let tri = new Triangle(this.startPos, this.crntPos);
                let vertices = tri.vertices;
                this.ctx.moveTo(vertices[0].x, vertices[0].y);
                this.ctx.lineTo(vertices[1].x, vertices[1].y);
                this.ctx.lineTo(vertices[2].x, vertices[2].y);
                this.ctx.lineTo(vertices[0].x, vertices[0].y);
                break;
            default:
                break;
        }
        this.ctx.stroke();
    }
    //일단 첫번째 폴리건에 대해서만 기능을 작성하고 확장합시다. 
    toParcel(i){
        if(this.polygons == undefined || this.polygons.length === 0)
        {
            return undefined;
        }
        return this.polygons[i].vertices;
    }

}