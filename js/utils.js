import Vec2 from './Vec2.js'
import Polygon from './Polygon.js';
export function getCanvasCoords(e, canvas){
    let rect = canvas.getBoundingClientRect();
    let x = ( e.x - rect.left );
    let y = ( e.y - rect.top );
    return new Vec2(x, y);
}
// export function getCanvasXY(x, y){
//     let rect = canvas.getBoundingClientRect();
//     return {x : x-rect.left,
//             y : x - rect.top
//         }
// }
export function domRectToPolygon(domRect){
    let polygon = new Polygon();
    polygon.addVer(new Vec2(domRect.left, domRect.top));
    polygon.addVer(new Vec2(domRect.left, domRect.bottom));
    polygon.addVer(new Vec2(domRect.right, domRect.bottom))
    polygon.addVer(new Vec2(domRect.right, domRect.top))
    return polygon;
}
export function rectToPolygon(rect){
    let polygon = new Polygon();
    polygon.addVer(new Vec2(rect.x))
}
//from d3 algorithm
export function ptInPolygon(polygon, point) {
  var n = polygon.vertices.length,
      p = polygon.vertices[n - 1],
      x = point.x, y = point.y
      x0 = p.x, y0 = p.y,
      x1, y1
    let inside = false;

  for (var i = 0; i < n; ++i) {
    p = polygon.vertices[i], x1 = p.x, y1 = p.y;
    if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside;
    x0 = x1, y0 = y1;
    return inside;
  }
}


function ptInside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};
//Usage:

// array of coordinates of each vertex of the polygon
// var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
// inside([ 1.5, 1.5 ], polygon); // true

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
        case '10' : return 'rgb(245, 162, 61, 0.4)';
        case '00' : return 'rgb(159, 245, 61, 0.4)';
        case '11' : return 'rgb(98, 195, 240, 0.4)';
        case '01' : return 'rgb(186, 107, 242, 0.4)';
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

