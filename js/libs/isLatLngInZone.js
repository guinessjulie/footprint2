function isLatLngInZone(latLngs,lat,lng){
    // latlngs = [{"lat":22.281610498720003,"lng":70.77577162868579},{"lat":22.28065743343672,"lng":70.77624369747241},{"lat":22.280860953131217,"lng":70.77672113067706},{"lat":22.281863655593973,"lng":70.7762061465462}];
    vertices_y = new Array();
    vertices_x = new Array();
    longitude_x = lng;
    latitude_y = lat;
    latLngs = JSON.parse(latLngs);
    var r = 0;
    var i = 0;
    var j = 0;
    var c = 0;
    var point = 0;
  
    for(r=0; r<latLngs.length; r++){
     vertices_y.push(latLngs[r].lat);
     vertices_x.push(latLngs[r].lng);
    }
    points_polygon = vertices_x.length;
    for(i = 0, j = points_polygon; i < points_polygon; j = i++){
     point = i;
     if(point == points_polygon)
      point = 0;
     if ( ((vertices_y[point]  >  latitude_y != (vertices_y[j] > latitude_y)) && (longitude_x < (vertices_x[j] - vertices_x[point]) * (latitude_y - vertices_y[point]) / (vertices_y[j] - vertices_y[point]) + vertices_x[point]) ) )
      c = !c;
    }
  return c;
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
var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
inside([ 1.5, 1.5 ], polygon); // true

//test function here https://github.com/substack/point-in-polygon/blob/master/index.js

