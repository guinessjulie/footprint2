export default class Line{
    constructor(ptStart, ptEnd){
        this.ptStart = ptStart;
        this.ptEnd = ptEnd;
    }
    set ptEnd(ptEnd){
        this.ptEnd = ptEnd;
    }
}