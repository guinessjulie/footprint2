export default class Polygon{
     
    constructor(){
        this.vertices = [];
    }
    addVer(pt){
        this.vertices.push(pt);
    }
    get last(){
        return this.vertices[this.vertices.length-1];
    }
    
}