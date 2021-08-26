//Rerenced https://www.trysmudford.com/blog/linear-interpolation-functions/

import { CELL_SIZE } from "./global.js";
import { qId } from "./alias.js";

export const lerp = (x, y, a) => x * (1 - a) + y * a; //x와 y의 범위가 주어졌을 때 a ratio(a배)면 얼마가 되겠느냐 하는 것
export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a)); //a 가 x와 y의 맥스 값을 넘지 않도록, 넘으면  x y중  max값 리턴
export const invlerp = (x, y, a) => clamp((a - x) / (y - x)); // a가 x 와  y 사이의 몇분율에 해당하는지를 구함
export const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a)); //p5의  map 과 동일

//todo this param should accept input from the DOM element
export const params = {
  popSize: Number(qId("popSizeIn").value),
  faRatio: floorAreaRatio,
  dnaLength: calcDnaLength,
  numGen: qId("numGeneration").value,
  pCrossOut: Number(qId("pCrossOut").textContent),
  paused: false,
};
//용적률
export function floorAreaRatio(aParcel, aFootPrint) {
  return aFootPrint / aParcel;
}

export function setNumIndividual() {
  return qId("popSizeIn").value;
}
//fitness function based on floorAreaRatio
export function fitnessFaRatio(allowance, faRatio) {
  if (allowance > faRatio) {
    return -1;
  }
  let max = allowance;
  let min = 0;
  let diff = allowanced - faRatio;
  let fitArea = invlerp(min, max, diff);
  return fitArea;
}

export function calcDnaLength(parcelArea, permitFaRatio) {
  if (qId("checkbox-dna-size").checked) {
    return +qId("lengthDnaIn").value;
  } else {
    let maxFloorArea = (parcelArea * permitFaRatio * 1) / 100;
    let numCell = Math.round(maxFloorArea / (CELL_SIZE * CELL_SIZE));
    // return  10; //todo for test fixed dna numbers return numCell
    return numCell;
  }
  //ex  parcelArea = 1000,
  // maxFaRate = 0.3 (30%)
  // maxFloorArea = 1000*0.3 = 300

  //eachcellArea = w*w;
  //eachCellArea * numCell = maxFloorArea
  //numCell = maxFloorArea/eachCellArea
}
