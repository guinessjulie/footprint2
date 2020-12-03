"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onParcel = onParcel;
exports.onGrid = onGrid;
exports.onFootPrint = onFootPrint;
exports.onValidate = onValidate;
exports.onParcelFootprint = onParcelFootprint;
exports.getParcel = getParcel;
exports.onPopulate = onPopulate;
exports.createDNA = createDNA;
exports.grid = exports.parcel = void 0;

var _boundingBox2D = _interopRequireDefault(require("./boundingBox2D.js"));

var _utils = require("./utils.js");

var _Rect = _interopRequireDefault(require("./Rect.js"));

var _app = require("./app.js");

var _grid = _interopRequireDefault(require("./grid2.js"));

var _Vec = _interopRequireDefault(require("./Vec2.js"));

var _fitness = require("./ga/fitness.js");

var _gaParams = require("./gaParams.js");

var _Polygon = _interopRequireDefault(require("./Polygon.js"));

var _Parcel = _interopRequireDefault(require("./Parcel.js"));

var _global = require("./global.js");

var _dna = _interopRequireDefault(require("./ga/dna.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//from menu execution, a instance of parcel is globaly used.
var parcel;
exports.parcel = parcel;
var grid;
exports.grid = grid;

var createDefaultParcel = function createDefaultParcel() {
  var domRect = canvas.getBoundingClientRect();
  var rect = new _Rect["default"](new _Vec["default"](0, 0), new _Vec["default"](domRect.width, domRect.height));
  var vertices = rect.toPolygon();
  exports.parcel = parcel = new _Parcel["default"](vertices);
  return parcel; //parcel = new Parcel(domRectToPolygon(domRect)); // 현재는 그냥 캔버스 크기로 정함
};

function onParcel() {
  if (_app.paint) {
    var i = 0; //todo to select parcel

    var poly = _app.paint.toParcel(i);

    if (poly == undefined) {
      exports.parcel = parcel = createDefaultParcel();
    } else {
      exports.parcel = parcel = new _Parcel["default"](poly, 30);
    }
  } else {
    exports.parcel = parcel = createDefaultParcel();
  }

  return parcel; //todo get polygon from t
}

function onGrid() {
  if (parcel == undefined) {
    exports.parcel = parcel = onParcel();
  } //parcel.grid = new Grid(parcel.bbox.min, parcel.bbox.max, 30)    ;


  exports.grid = grid = new _grid["default"](parcel.bbox.min, parcel.bbox.max, 30);
  return grid;
}

function onFootPrint() {
  if (parcel == undefined) exports.parcel = parcel = onParcel();
  if (grid == undefined) exports.grid = grid = onGrid();
  grid.onStartFootPrint();
}

function onValidate() {
  if (parcel == undefined) exports.parcel = parcel = onParcel();
  if (grid == undefined) exports.grid = grid = onGrid();
  if (grid.activeCell == 0) grid.activeCell = onFootPrint();
  grid.onValidateCell(parcel.vertices);
}

function onParcelFootprint() {
  if (parcel == undefined) exports.parcel = parcel = onParcel();
  if (grid == undefined) exports.grid = grid = onGrid();
  if (grid.activeCell == 0) grid.activeCell = onFootPrint();

  if ((0, _fitness.matrixValCount)(grid.foot, 1) == 0 || (0, _fitness.matrixValCount)(grid.validGrid == 0)) {
    grid.onValidateCell(parcel.vertices);
  }

  if (parcel) {
    parcel.draw();
  }

  if (grid) {
    grid.onPreview(parcel.vertices);
  }
}

function getParcel() {
  if (parcel) {
    return parcel.vertices;
  } else {
    return createDefaultParcel().vertices;
  }
}

function onPopulate() {
  if (parcel == undefined) exports.parcel = parcel = onParcel();
  if (grid == undefined) exports.grid = grid = onGrid();
  grid.onPopulate();
} //todo DNA 클라스에서  gene  생성하는 걸 맞기자.
//transform from onStartFootPrint to createDNA


function createDNA() {
  if (parcel == undefined) {
    exports.parcel = parcel = onParcel();
  }

  if (grid == undefined) exports.grid = grid = onGrid();
  var iter = (0, _gaParams.dnaLength)(parcel.area, _global.permitFaRatio);
  var dna = new _dna["default"](iter, {
    cols: grid.cols,
    rows: grid.rows
  }); //forTests

  grid.dnaToFootprintMatrix(dna);
  return dna;
}