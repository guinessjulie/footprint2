import {calcDnaLength, params} from "./gaParams.js";
import DNA from "./ga/dna.js";
import Footprint from "./footprint.js";
import {grid, parcel} from "./ProcessParcel.js";
import {qId} from "./alias.js";
import OptimalFootprint from "./optimalFootprint.js";

export default class Footprints { //todo move footprint class to here and seperates individuals and population
    constructor() {
        this.generation = 1;
        this.dnas = [];
        this.populFoots = [];
        this.gridSize = {
            cols: grid.arr2d.length,
            rows: grid.arr2d[0].length
        }
        this.populateDNA(params.numIndividuals)
        this.initPopulationFootprint();
        this.displayDomInformation()
        this.optimalFootprint();
    }
//todo display dom info of footprints generation
    displayDomInformation() {
        let outGeneration = document.querySelector('#out-generation'); //todo when evolving process started this will be needed don't worry mr. code reviewer

    }

    initPopulationFootprint() {
        let id = 0;
        for (let indvDna of this.dnas) {
            let footprint = new Footprint(indvDna, id++);
            this.populFoots.push(footprint);
        }
    }
    optimalFootprint(){
        let opFoot = this.populFoots.pop(); //todo get optimal one. now testing with last one right now
        let selectedFootprint = new OptimalFootprint(opFoot); //todo
    }
    populateDNA(numIndividual) {
        let permitFaRatio = qId('input-faRatio').value;
        let dnaSize = calcDnaLength(parcel.area, +permitFaRatio)
        for (let i = 0; i < numIndividual; i++) {
            let dna = new DNA(numIndividual, this.gridSize, dnaSize)
            this.dnas.push(dna);
        }
    }
}
