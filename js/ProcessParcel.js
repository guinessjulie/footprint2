import BoundingBox2D from "./boundingBox2D.js";
import { toBBox, toGrid, getContext2d, domRectToPolygon } from "./utils.js";
import Rect from "./Rect.js";
import { paint } from "./app.js";
//import Grid from './grid.js';
import Grid from "./grid2.js";
import Vec2 from "./Vec2.js";
import { matrixValCount } from "./ga/fitness.js";
import { calcDnaLength, params } from "./gaParams.js";
import Polygon from "./Polygon.js";
import Parcel from "./Parcel.js";
import { permitFaRatio } from "./global.js";
import Gene from "./ga/gene.js";
import Footprints from "./footprints.js";
import { frameId } from "./footprints.js";
import { qId, qry } from "./alias.js";
//from menu execution, a instance of parcel is globaly used.

export let parcel;
export let grid;
let stopAni = false;
let footprints;
const createDefaultParcel = () => {
  let domRect = canvas.getBoundingClientRect();
  let rect = new Rect(new Vec2(0, 0), new Vec2(domRect.width, domRect.height));
  let vertices = rect.toPolygon();
  parcel = new Parcel(vertices, params.cellSize);
  return parcel;
  //parcel = new Parcel(domRectToPolygon(domRect)); // 현재는 그냥 캔버스 크기로 정함
};

export function onParcel() {
  if (paint) {
    let i = 0; //todo to select parcel
    let poly = paint.toParcel(i);
    const cellChanged = qId("cellsize-changed").value;
    if (poly == undefined || cellChanged) {
      parcel = createDefaultParcel();
    } else {
      parcel = new Parcel(poly, params.cellSize);
    }
  } else {
    parcel = createDefaultParcel();
  }
  return parcel;
  //todo get polygon from t
}
export function onGrid(canvasId = "canvas") {
  if (parcel == undefined) {
    parcel = onParcel();
  }
  //grid = new Grid(canvasId, parcel.bbox.min, parcel.bbox.max, 30)    ;
  grid = new Grid(canvasId, parcel);
  qId("cellsize-changed").value = false;
  return grid;
}

export function onFootPrint() {
  if (parcel == undefined) parcel = onParcel();
  if (grid == undefined) grid = onGrid((canvasId = "canvas"), parcel);
  grid.onStartFootPrint();
}
export function onValidate() {
  if (parcel == undefined) parcel = onParcel();
  if (grid == undefined) grid = onGrid();
  if (grid.activeCell == 0) grid.activeCell = onFootPrint();
  grid.onValidateCell(parcel.vertices);
}

export function onPreview() {
  if (parcel == undefined) parcel = onParcel();
  if (grid == undefined) grid = onGrid();
  if (grid.activeCell == 0) grid.activeCell = onFootPrint();
  let parcelFootprintMatrix;
  if (
    matrixValCount(grid.foot, 1) == 0 ||
    matrixValCount(grid.validGrid == 0)
  ) {
    grid.onValidateCell(parcel.vertices);
  }
  if (parcel) {
    parcel.draw();
  }
  if (grid) {
    parcelFootprintMatrix = grid.onPreview(parcel.vertices);
  }
}

export function getParcel() {
  if (parcel) {
    return parcel.vertices;
  } else {
    return createDefaultParcel().vertices;
  }
}
//todo DNA 클라스에서  gene  생성하는 걸 맞기자.
export function onPopulate_org() {
  if (parcel == undefined) parcel = onParcel();
  if (grid == undefined) grid = onGrid();
  let footprints = new Footprints(parcel, grid);
  gridPopulateFoot();
}
/*************************************
 * This is main
 */
export function onPopulate() {
  if (parcel == undefined) parcel = onParcel();
  if (grid == undefined) grid = onGrid("canvas");
  footprints = new Footprints();
  // gridPopulateFoot()
}
export function onStopEvolve() {
  console.log(`stopButtonPressed`);
  stopAni = !stopAni;
  if (stopAni) {
    cancelAnimationFrame(frameId);
    qry("#pause").className = "fas fa-play fa-2x";
  } else {
    requestAnimationFrame(footprints.draw.bind(footprints));
    qry("#pause").className = "fas fa-pause fa-2x";
  }
}
export function gridPopulateFoot() {
  for (let i = 0; i < params.numIndividuals; i++) {
    console.log("i", i);
    this.onStartFootPrint();
    this.clearFootPrint();
  }
}

function clearFootPrint() {}

export function onFootPrintNew() {
  grid.onStartFootPrint();
}
//transform from onStartFootPrint to createDNA
export function createDNA() {
  if (parcel == undefined) {
    parcel = onParcel();
  }
  if (grid == undefined) grid = onGrid();
  let iter = calcDnaLength(parcel.area, permitFaRatio);
  let gene = new Gene(iter, { cols: grid.cols, rows: grid.rows });
  //forTests
  grid.dnaToFootprintMatrix(gene);
  return gene;
}
