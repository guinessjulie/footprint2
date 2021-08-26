import Vec2 from "./Vec2.js";
import Polygon from "./Polygon.js";
import { qId } from "./alias.js";
import { CELL_SIZE } from "./global.js";
export function getCanvasCoords(e, canvas) {
  let rect = canvas.getBoundingClientRect();
  let x = e.x - rect.left;
  let y = e.y - rect.top;
  return new Vec2(x, y);
}
// export function getCanvasXY(x, y){
//     let rect = canvas.getBoundingClientRect();
//     return {x : x-rect.left,
//             y : x - rect.top
//         }
// }
export function getAverage(fit) {
  //todo move to utils
  const avgFit = fit.reduce((avg, value, _, { length }) => {
    return avg + value / length;
  }, 0);
  return avgFit;
}
export function randInt(max) {
  //from 0 to max
  return Math.floor(Math.random() * max);
}
export function domRectToPolygon(domRect) {
  let polygon = new Polygon();
  polygon.addVer(new Vec2(domRect.left, domRect.top));
  polygon.addVer(new Vec2(domRect.left, domRect.bottom));
  polygon.addVer(new Vec2(domRect.right, domRect.bottom));
  polygon.addVer(new Vec2(domRect.right, domRect.top));
  return polygon;
}
export function rectToPolygon(rect) {
  let polygon = new Polygon();
  polygon.addVer(new Vec2(rect.x));
}

export function delay(gap) {
  /* gap is in millisecs */

  let then, now;
  then = new Date().getTime();
  now = then;
  while (now - then < gap) {
    now = new Date().getTime(); // 현재시간을 읽어 함수를 불러들인 시간과의 차를 이용하여 처리
  }
}

//출처: https://blog.opid.kr/116 [opid's document]
//Usage:

// array of coordinates of each vertex of the polygon
// var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
// inside([ 1.5, 1.5 ], polygon); // true

export function toBBox(vertices) {
  let bbox = {};
  let minX = vertices.reduce(
    (a, b) => Math.min(a, b.x),
    Number.MAX_SAFE_INTEGER
  );
  let maxX = vertices.reduce(
    (a, b) => Math.max(a, b.x),
    Number.MIN_SAFE_INTEGER
  );
  let minY = vertices.reduce(
    (a, b) => Math.min(a, b.y),
    Number.MAX_SAFE_INTEGER
  );
  let maxY = vertices.reduce(
    (a, b) => Math.max(a, b.y),
    Number.MIN_SAFE_INTEGER
  );
  bbox.min = new Vec2(minX, minY);
  bbox.max = new Vec2(maxX, maxY);
  return bbox;
}

export function toGrid(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
export const rand = (size) => Math.floor(Math.random() * size);
export const geneToColor = (ge) => {
  switch (ge) {
    case "10":
      return "rgb(245, 162, 61, 0.4)";
    case "00":
      return "rgb(159, 245, 61, 0.4)";
    case "11":
      return "rgb(98, 195, 240, 0.4)";
    case "01":
      return "rgb(186, 107, 242, 0.4)";
    default:
      return "white";
  }
};
//not using
export const ToColor = () => {
  let R = Math.floor(Math.random() * 110 + 145);
  let G = Math.floor(Math.random() * 110 + 145);
  let B = Math.floor(Math.random() * 110 + 145);
  let color = {
    10: `rgb(${R}, ${G}, ${B})`,
    "00": `rgb(${G}, ${B}, ${R})`,
    11: `rgb(${B}, ${R}, ${G})`,
    "01": `rgb(${R}, ${B}, ${G})`,
  };
  return color;
};

export function to2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows); //changed 2020-11-09
  }
  return arr;
}

export function parcelArea(vertices) {
  let poly = new Polygon(vertices);
  let area = poly.area();
  return { area: area, poly: poly };
}

export function reverseColRow(array) {
  let reversed = array[0].map((_, colIndex) =>
    array.map((row) => row[colIndex])
  );
  return reversed;
}
export function rotateRight(array) {
  var result = [];
  array.forEach(function (col, i, aryA) {
    col.forEach(function (row, j, arrRow) {
      result[arrRow.length - j - 1] = result[arrRow.length - j - 1] || [];
      result[arrRow.length - j - 1][i] = row;
    });
  });
  return result;
}

export function rotateLeft(array) {
  var result = [];
  array.forEach(function (col, i, arr) {
    col.forEach(function (b, j, bb) {
      result[j] = result[j] || [];
      result[j][arr.length - i - 1] = b;
    });
  });
  return result;
}

export function matrixPeremeter1(m) {
  let s = 0;
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j]) {
        if (i <= 0 || !m[i - 1][j]) s++; //왼쪽이 0이면 s증가
        if (j <= 0 || !m[i][j - 1]) s++; //위쪽이 0이면 s 증가
        if (i >= m.length - 1 || !m[i + 1][j]) s++; //오른쪽이 0이면 s 증가
        if (j <= m[i].length - 1 || !m[i][j + 1]) s++;
      }
    }
  }
  return s;
}
export const matrixPerimeter2 = (m) => {
  let row = m.length;
  let col = m[0].length;
  let s = 0;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (m[i][j]) {
        s -= i > 0 && m[i - 1][j];
        s -= j > 0 && m[i][j - 1];
        s -= j < col - 1 && m[i][j + 1];
        s -= i < row - 1 && m[i + 1][j];
        s += 4;
      }
    }
  }
  return s;
};
//debugging
export const matrixPerimeter_Debugging = (m) => {
  let s = 0;
  m.map((row, i) => {
    row.map((col, j) => {
      if (col) {
        //그림상 왼쪽 셀이 채워져 있으면 -1
        if (i > 0 && m[i - 1][j]) {
          s -= 1;
          console.log(`upper occupied: -1 `, s);
        }
        //upper cell is occupied -1
        if (j > 0 && row[j - 1]) {
          s -= 1;
          console.log(`left occupied: -1 `, s);
        }
        //(j < row.length - 1) tests hit the wall, then don't test next
        if (j < row.length - 1 && row[j + 1]) {
          s -= 1;
          console.log(`right occupied: -1 `, s);
        }
        //right cell is occupied -1
        if (i < m.length - 1 && m[i + 1][j]) {
          s -= 1;
          console.log(`below occupied: -1 `, s);
        }
        s += 4;
        console.log(`i, j, s`, i, j, s);
      }
    });
  });
  return s;
};
export const matrixPerimeter = (m) => {
  let s = 0;
  m.map((row, i) => {
    row.map((col, j) => {
      if (col) {
        s -= i > 0 && m[i - 1][j]; //그림상 왼쪽 셀이 채워져 있으면 -1
        s -= j > 0 && row[j - 1]; //upper cell is occupied -1
        s -= j < row.length - 1 && row[j + 1]; //(j < row.length - 1) tests hit the wall, then don't test next
        s -= i < m.length - 1 && m[i + 1][j]; //right cell is occupied -1
        s += 4;
        // console.log(`i, j, s`, i, j, s);
      }
    });
  });
  return s;
};
export function drawOnCanvas(
  canvasId,
  vertices,
  clr = "rgb(25, 25, 125, 0.2)",
  id,
  boundaryLength
) {
  let color = clr;
  let canvas = qId(canvasId);
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    const path = vertices[i];
    ctx.lineTo(path.x, path.y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

export function getContext2d(canvasId) {
  let canvas = qId(canvasId);
  let ctx = canvas.getContext("2d");
  return ctx;
}

export function displayCell(canvasId, col, row, min, color = "darkgrey") {
  let ctx = getContext2d(canvasId);
  ctx.save();
  ctx.lineWidth = 1;
  ctx.fillStyle = color;
  let { x, y, w } = translate(col, row, min);
  ctx.translate(x, y);
  ctx.fillRect(0, 0, w, w);
  ctx.restore();
}

export function translate(col, row, min) {
  return {
    x: min.x + col * CELL_SIZE,
    y: min.y + row * CELL_SIZE,
    w: CELL_SIZE,
  };
}

export function cleanupGrid(canvasId) {
  let ctx = getContext2d(canvasId);
}
