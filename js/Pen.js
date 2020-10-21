export default class Pen{
    constructor(ptStart, penWidth){
        this.strokes=[];
        this.strokes.push(ptStart);
        this.penWidth = penWidth;
    }
    addStroke(pt){
        this.strokes.push(pt);
    }
    endPen(){
        this.strokes.push(this.strokes);
    }
}