export default class Rect {
    constructor(ptStart, ptCrnt){
        this.ptStart = ptStart;
        this.width = ptCrnt.x - ptStart.x ;
        this.height = ptCrnt.y -  ptStart.y ;
    }
}