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

