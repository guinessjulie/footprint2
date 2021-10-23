import { qry, qId } from "./alias.js";
import {
  onParcel,
  onGrid,
  onFootPrint,
  onValidate,
  onPreview,
  onPopulate,
  onStopEvolve,
} from "./ProcessParcel.js";
import * as gaParams from "./gaParams.js";

export function registerFootPrintHandle() {
  qry(".parcel").on("click", onParcel);
  qry(".validate").on("click", onValidate);
  qry(".grid").on("click", onGrid);
  qry(".footprint").on("click", onFootPrint);
  qry(".parcel-footprint").on("click", onPreview);
  qry(".populate").on("click", onPopulate);
  qry(".stop").on("click", onStopEvolve);
}

export function addGAParamEventHandle() {
  qId("lengthDnaIn").addEventListener("change", updateDnaLengthIn);
  qId("popSizeIn").addEventListener("change", updatePopulationSize);
  qId("intervalIn").addEventListener("change", updateIntervalIn);
  qId("pCrossIn").addEventListener("change", updatepCrossOut);
  qId("pMutateIn").addEventListener("change", updatepMutateOut);
  qId("checkbox-dna-size").addEventListener(
    "change",
    updateCheckboxForceDnaSize
  );
  qId("numGeneration").addEventListener("change", updateNumGen);
  qId("input-cell-size").addEventListener("change", updateCellSize);
}

export function updatePopulationSize(event) {
  //   gaParams.params.numIndividuals = event.target.value;
  gaParams.params.popSize = event.target.value;
}
export function updateIntervalIn(event) {
  qId("intervalOut").value = event.target.value;
}
export function updatepCrossOut(event) {
  qId("pCrossOut").value = event.target.value;
}
export function updatepMutateOut(event) {
  qId("pMutateOut").value = event.target.value;
}
export function updateCheckboxForceDnaSize(event) {
  gaParams.params.dnaLength = event.target.value;
}
export function updateCellSize(event) {
  gaParams.params.cellSize = event.target.value;
  qId("cellsize-changed").value = true;
}
export function updateDnaLengthIn(event) {
  // qId("lengthDnaOut").value = event.target.value;
  if (qId("checkbox-dna-size").checked) {
    gaParams.params.dnaLength = event.target.value;
  } else {
  } //else gaParams is already loaded so it has the numberf from the calculated based faRatio input
}

export function updateNumGen(event) {
  qId("numGeneration").value = event.target.value;
}
