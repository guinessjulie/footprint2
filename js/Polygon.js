export default class Polygon{
     
    constructor(vertices){
        if(vertices == undefined){
            this.vertices = [];
        }
        else{ 
            this.vertices = vertices;
        }
    }
    addVer(pt){
        this.vertices.push(pt);
    }
    get last(){
        return this.vertices[this.vertices.length-1];
    }

    //area from d3 algorithm
    area2(){
        let  i = -1;
        let  n = this.vertices.length;
        let  a;
        let  b = this.vertices[n - 1];
        let  area = 0;

        while (++i < n) {
          a = b;
          b = this.vertices[i];
          area += a.y * b.x - a.x * b.y;
        }
        return area / 2;
    }
   
    area(){
      const verts = [...this.vertices]
//      console.log(verts);
//      verts.push(verts[0])
      let x = verts.map(el => el.x);
      let y = verts.map(el => el.y);
      let sum = 0;
      for (let i = 0; i < x.length; i++) {
        let next = (i+1) % x.length;
        console.log('i',i, 'next : ' , next);
        console.log('x[i] : ', x[i], 'y[next] :', y[next], ',   xi*y[next] :', x[i]*y[next])
        console.log('y[i] : ', y[i], 'x[next] :', x[next], ',   yi*x[next] :', y[i]*x[next])
        console.log(x[i]*y[next],'-', y[i]*x[next], '=', (x[i]*y[next]) - (y[i]*x[next]));
        let a = (x[i]*y[next]) - (y[i]*x[next]);       
        sum+= a;
        console.log(i, sum) 
      }
      let area = Math.abs(sum/2)
      return area;
    }
    //from d3 algorithm
    ptInPolygon(point) {
      let n = this.vertices.length;
      let p = this.vertices[n - 1];
      let x = point.x;
      let y = point.y;
      let x0 = p.x;
      let y0 = p.y;
      let x1 ;
      let y1;
      let inside = false;
    
      for (var i = 0; i < n; ++i) {
        p = this.vertices[i], x1 = p.x, y1 = p.y;
        if (
            ((y1 > y) !== (y0 > y)) && 
            (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) {
          inside = !inside;
        }
        x0 = x1, y0 = y1;
      }
      return inside;
  }
 
ptInPolygon_trynew(point) {
  let n = this.vertices.length;
  let p = this.vertices[n - 1];
  let x = point.x;
  let y = point.y;
  let x0 = p.x;
  let y0 = p.y;
  let x1 ;
  let y1;
  let inside = false;

  for (var i = 0; i < n; ++i) {
    p = this.vertices[i], x1 = p.x, y1 = p.y;
    if (
        ((y1 >= y) !== (y0 >= y)) && 
        (x <= (x0 - x1) * (y - y1) / (y0 - y1) + x1)) {
      inside = !inside;
    }
    x0 = x1, y0 = y1;
  }
  return inside;
} 
}



