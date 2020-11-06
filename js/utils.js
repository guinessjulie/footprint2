import Vec2 from './Vec2.js'
import Polygon from './Polygon.js';
export function getCanvasCoords(e, canvas){
    let rect = canvas.getBoundingClientRect();
    let x = ( e.x - rect.left );
    let y = ( e.y - rect.top );
    return new Vec2(x, y);
}
export function rectToPolygon(domRect){
    let polygon = new Polygon();
    polygon.addVer(new Vec2(domRect.left, domRect.top));
    polygon.addVer(new Vec2(domRect.left, domRect.bottom));
    polygon.addVer(new Vec2(domRect.right, domRect.bottom))
    polygon.addVer(new Vec2(domRect.right, domRect.top))
    return polygon;
}

export function toBBox(vertices){
    let bbox = {}
    console.log(vertices)
    let minX = vertices.reduce((a, b)=> Math.min(a, b.x), Number.MAX_SAFE_INTEGER)        
    let maxX= vertices.reduce((a, b)=> Math.max(a, b.x), Number.MIN_SAFE_INTEGER)
    let minY= vertices.reduce((a, b)=> Math.min(a, b.y), Number.MAX_SAFE_INTEGER)        
    let maxY= vertices.reduce((a, b)=> Math.max(a, b.y), Number.MIN_SAFE_INTEGER)
    bbox.min = new Vec2(minX, minY)
    bbox.max = new Vec2(maxX, maxY)
    return bbox;
}

export function toGrid(cols, rows){
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}
export const rand = (size) => Math.floor(Math.random()*(size));
export const geneToColor = (ge) =>{
    switch(ge){
        case '10' : return '#f5a23d';
        case '00' : return '#9ff53d';
        case '11' : return '#62c3f0';
        case '01' : return '#ba6bf2';
        default   : return 'white';
    }
}
//not using
export const ToColor = () => {
    let R = Math.floor(Math.random()*110+145);
    let G = Math.floor(Math.random()*110+145);
    let B = Math.floor(Math.random()*110+145);
    let color=
    { 
        '10' : `rgb(${R}, ${G}, ${B})`,
        '00' : `rgb(${G}, ${B}, ${R})`,
        '11' : `rgb(${B}, ${R}, ${G})`,
        '01' : `rgb(${R}, ${B}, ${G})`
    } 
    return color
}

