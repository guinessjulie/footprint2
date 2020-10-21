import Point from './Vertex.js'
export function getCanvasCoords(e, canvas){
    let rect = canvas.getBoundingClientRect();
    let x = ( e.x - rect.left );
    let y = ( e.y - rect.top );
    return new Point(x, y);
}