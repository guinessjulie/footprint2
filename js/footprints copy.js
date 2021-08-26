import {
  calcDnaLength,
  params,
  range,
  lerp,
  invlerp,
  clamp,
} from "./gaParams.js";

import { correlationCoefficient } from "./libs/ex/exMath.js";

import Gene from "./ga/dna.js";
import Footprint from "./footprint.js";
import { grid, parcel } from "./ProcessParcel.js";
import { qId, qry } from "./alias.js";
import OptimalFootprint from "./optimalFootprint.js";
import { onParcel } from "./ProcessParcel.js";
import { drawOnCanvas, displayCell } from "./utils.js";
import Grid from "./grid2.js";
export let frameId;
export default class Footprints {
  //todo move footprint class to here and separates individuals and population
  constructor() {
    this.populFoots = [];
    this.gridSize = {
      cols: grid.arr2d.length,
      rows: grid.arr2d[0].length,
    };
    this.generation = 0;
    this.parcel = onParcel();
    this.grid1 = new Grid("canvas", parcel);
    this.grid2 = new Grid("canvas-generation", parcel);
    this.nextFoot = 0;
    this.popSet = [];
    this.cur = 0;
    //this.matingPool = []; //todo remove later becuase this has useless verbose attrib
    this.matingPoolA = [];
    this.populateDNA(params.popSize); //fill array of this.dnas[]
    this.displayDomInformation();
    this.draw();
  }
  displayDomInformation() {
    this.popSet.forEach((el) => {
      qry("#out-generation").value = el.generation; //todo when evolving process started this will be needed don't worry mr. code reviewer
    });
  }
  initDisplayGrid() {
    this.disableOutsideParcel();
    this.grid1.initCanvasGrid();
  }
  disableOutsideParcel() {
    this.grid1.displayCells(
      this.grid1.matCellInside,
      0,
      "rgb(120,120,160,0.2)"
    ); //parcel 바깥에 있는 셀들을 disable시켜라
  }

  evolve() {
    this.generation += 1;
    this.createMatingPool();
    this.select();
    //this.createGeneration(params.popSize);
  }
  //to implement
  createGeneration(numIndividual) {
    let generation = {
      genId: 0,
      numInd: numIndividual,
      selected: [],
    };
  }
  populateDNA(popSize) {
    let permitFaRatio = qId("input-faRatio").value;
    let geneSize = calcDnaLength(parcel.area, +permitFaRatio);
    for (let i = 0; i < params.popSize; i++) {
      //params가 동적으로 바뀌는지 잘 모르겠음.
      let gene = new Gene(this.gridSize, geneSize);
      let foot = new Footprint(gene, i);
      let indInfo = {
        id: i,
        gene: gene,
        attr: foot.attr,
        validFootprintMatrix: foot.validFootprintMatrix,
        generation: 0, //to implement
      };
      this.popSet.push(indInfo);
    }
    this.foots = [...this.popSet];
  }

  //todo display dom info of footprints generation

  createMatingPool() {
    const population = this.popSet;

    //todo temp
    // this.createMatingPoolByRouletteWheel(population);
    let minB = population.reduce(
      (acc, info) => Math.min(acc, info.attr.boundaryLength),
      Number.MAX_SAFE_INTEGER
    );
    let maxB = population.reduce(
      (acc, info) => Math.max(acc, info.attr.boundaryLength),
      Number.MIN_SAFE_INTEGER
    );
    let onlyIndexAndFit = [];

    for (let i = 0; i < population.length; i++) {
      const boundary = population[i].attr.boundaryLength;
      let fitnessBoundary = 1 - range(minB, maxB, 0, 1, boundary);
      let n = fitnessBoundary * 100;
      //   console.log(`n`, n);
      for (let j = 0; j < n; j++) {
        //this.matingPool.push(population[i])   //todo : matingPool has useless attributes let's remove later
        this.matingPoolA.push(population[i].id);
        let parent = {
          idx: population[i].id,
          fit: fitnessBoundary,
        };
        onlyIndexAndFit.push(parent);
      }
    }
    // console.log(`onlyIndexAndFit`, onlyIndexAndFit);
  }

  createMatingPoolByRouletteWheel() {
    //array of only measured fitness value
    const population = this.popSet;
    console.log(`population`, population);
    let bLengthArray = population.map((ind, idx) => {
      return ind.attr.boundaryLength;
    });

    //to unique array
    let bUniqueArray = [...new Set(bLengthArray)];
    let minB = Math.min(...bUniqueArray);
    let maxB = Math.max(...bUniqueArray);

    //to key-value pair hash map data structure
    let hashMapFitToRelFit = bLengthArray.reduce((map, len) => {
      map[len] = 1 - (len - minB) / (maxB - minB);
      return map;
    }, {});

    //population array stored the relative fitness value
    let bRelFitArray = bLengthArray.map((len) => {
      return hashMapFitToRelFit[len];
    });
    // console.log(`bRelFitArray`, bRelFitArray);

    let matingPool = [];
    const repeatePick = 30;
    for (let i = 0; i < repeatePick; i++) {
      bRelFitArray.forEach((el, idx) => {
        let pick = Math.random();
        //el: probability of current individual being selected
        //pick: random position
        if (pick <= el) {
          matingPool.push(idx);
        }
      });
    }
    // console.log(`matingPool`, matingPool);

    //key-value pair
    let countFit = matingPool.reduce((map, val) => {
      map[val] = (map[val] || 0) + 1;
      return map;
    }, {});
    // console.log(`countFit`, countFit);

    //to file output
    let csvContent = "data:text/csv;charset=utf-8,\r\n";
    let countFitArray = [];
    for (let i = 0; i < bRelFitArray.length; i++) {
      let cnt = countFit[i];
      if (cnt === undefined) {
        cnt = 0;
      }
      countFitArray.push(cnt);
      const relFit = bRelFitArray[i];
      let row = i + "," + cnt + "," + relFit;
      csvContent += row + "\r\n";
    }
    //check for the moment
    console.log(`csvContent`, csvContent);

    //correlation Coefficient
    const cc = correlationCoefficient(
      countFitArray,
      bRelFitArray,
      bRelFitArray.length
    );
    console.log(repeatePick + "," + matingPool.length + "," + cc);
  }
  createMatingPoolByRouletteWheel_copy(population) {
    //fitness array based on the boundary length
    let minB = population.reduce(
      (acc, info) => Math.min(acc, info.attr.boundaryLength),
      Number.MAX_SAFE_INTEGER
    );
    let maxB = population.reduce(
      (acc, info) => Math.max(acc, info.attr.boundaryLength),
      Number.MIN_SAFE_INTEGER
    );
    let fitBoundaries = population.map((indv) => {
      return 1 - range(minB, maxB, 0, 1, indv.attr.boundaryLength);
    });

    let sumFits = fitBoundaries.reduce((acc, v) => acc + v, 0);
    console.log(`sumFits`, sumFits);

    //let relativeFitness = fitBoundaries.map((val) => val / sumFits);
    let relativeFitness = fitBoundaries;

    //sum of fitness
    let sumRel = relativeFitness.reduce((acc, val) => acc + val, 0);

    let matingPool = [];
    //todo 100개만 골라야 됨
    //todo index값을 가져와야 됨
    let idx = 0;
    console.log(`relativeFitness`, relativeFitness);
    relativeFitness.forEach((element) => {
      let pick = Math.random();
      if (pick > element) {
        console.log(`pick`, pick, "fitness", element, "idx", idx);
        parent = {
          idx: idx,
          fit: element,
        };
        matingPool.push(parent);
      }
      idx++;
    });
    // for (const pi of relativeFitness) {
    //   let pick = Math.random();
    //   if (pick > pi) {
    //     matingPool.push(pi);
    //   }
    // }
    console.log(`matingPool`, matingPool);
  }
  select() {
    let newPop = [];
    for (let i = 0; i < params.popSize; i++) {
      let selectedIdx = Math.floor(Math.random() * this.matingPoolA.length);
      let selectedAttr = this.popSet[this.matingPoolA[selectedIdx]];
      let indInfo = {
        id: i,
        gene: selectedAttr.gene,
        attr: selectedAttr.attr,
        validFootprintMatrix: selectedAttr.validFootprintMatrix,
        generation: selectedAttr.generation + 1, //to implement
      }; //need crossover and mutation

      newPop.push(indInfo);

      // let gene = new Gene(this.gridSize, geneSize)
      // let foot = new Footprint(gene, i);
      // let indInfo = {
      //     id: i,
      //     gene:gene,
      //     attr : foot.attr,
      //     validFootprintMatrix: foot.validFootprintMatrix,
      //     generation:0, //to implement
      // }
      // this.popSet.push(indInfo) ;
    }
    this.popSet = newPop;
    this.foots = [...this.popSet];
  }
  reproduce() {
    this.popSet = [];
    for (let i = 0; i < params.popSize; i++) {
      let momIdx = Math.floor(Math.random() * this.matingPool.length);
      let dadIdx = Math.floor(Math.random() * this.matingPool.length);
      let momDNA = this.matingPool[momIdx];
      let dadDNA = this.matingPool[dadIdx];
      let childDNA = momDNA.crossover(dadDNA);
      let foot = new Footprint(childDNA, i);
      let indInfo = {
        id: i,
        gene: childDNA,
        attr: foot.attr,
        validFootprintMatrix: foot.validFootprintMatrix,
        generation: 1,
      };
      this.popSet.push(indInfo);
    }

    this.foots = [...this.popSet];
  }

  displayFootprint(frameId) {
    //this.evolve();
    let opFoot = this.foots.shift(); // get one by one from this.foots was deep-copied from  this.popSet
    if (opFoot === undefined) {
      cancelAnimationFrame(frameId);
      //this.optimalFootprint();
      //this.evolve();
      this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
      this.grid1.displayCells(opFoot.validFootprintMatrix, 1, "black");
      this.createMatingPool(); //todo replace
      console.log(`what?`);
      //this.createMatingPoolByRouletteWheel(); //todo replace
      //this.reproduce();
    } else {
      this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
      this.grid1.displayCells(opFoot.validFootprintMatrix, 1, "black");
    }
    // let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
    // let outGeneration = qry('#out-generation');
    // outGeneration.value = opFoot.generation;
  }

  displayGeneration(floor) {
    if (floor > 0) {
      this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
      this.grid1.displayCells(floor.validFootprintMatrix, 1, "black");
    }
    if (this.frameId == undefined) {
      cancelAnimationFrame(frameId);
    }
  }
  backgroundGrid() {
    this.grid1.displayCells(grid.matCellInside, 1, "white");
  }
  draw() {
    this.frameId = requestAnimationFrame(this.draw.bind(this));
    const numGen = qId("numGeneration").value;
    if (Number(this.generation) >= Number(numGen)) {
      // todo generation change
      cancelAnimationFrame(this.frameId);
    }
    if (this.cur < params.popSize) {
      this.drawFootprint();
      this.cur += 1;
    } else {
      let best = this.getBestFootprint();
      this.displayOptimalFootprint(best);
      this.evolve();
      this.cur = 0;
    }
    // this.drawBest()
    // this.displayGeneration(floor);
  }
  drawFootprint() {
    this.backgroundGrid();
    let foot = this.foots[this.cur];
    this.grid1.displayCells(foot.validFootprintMatrix, 1, "black");
  }
  drawIndividual() {
    //obsolute
    this.backgroundGrid();
    let foot = this.foot[this.cur];
    if (this.foots.length > 0) {
      let foot = this.foots.shift();
      this.grid1.displayCells(foot.validFootprintMatrix, 1, "black");
    } else {
      cancelAnimationFrame(frameId);
      this.evolve();
      // let bestFootMat = this.getBestFootprint();
      // this.drawBest(bestFootMat)
    }
  }
  getBestFootprint() {
    let minIdx = 0;
    let min = this.popSet[0].attr.boundaryLength; //todo parameterise for fitness
    for (let i = 0; i < this.popSet.length; i++) {
      let indv = this.popSet[i];
      if (this.popSet[i].attr.boundaryLength < min) {
        min = this.popSet[i].attr.boundaryLength;
        minIdx = i;
      }
    }
    return this.popSet[minIdx];
  }
  drawBest(betFootMat) {
    drawOnCanvas("canvas-generation", parcel.vertices, "#35e664");
    let color = "black";
    //let grid2 = new Grid('canvas-generation', parcel.bbox.min, parcel.bbox.max, CELL_SIZE) //constructor 자체에서initDisplayGrid를 호출한다. 이 떄문에 원본이 초기화되어 안보이게 되는 것이다. 이것을 픽스하려면 grid2를 대대적으로 손보던가 여기 클래스에서 필요한 부분만duplicate하ㅣ던가 해야한다.
    for (let col in [...new Array(this.grid2.cols).keys()]) {
      for (let row in [...new Array(this.grid2.rows).keys()]) {
        if (betFootMat[col][row] == 1) {
          displayCell("canvas-generation", col, row, parcel.bbox.min, color);
        }
      }
    }
  }
  getOptimalFootprint() {
    let min = this.popSet[0].attr.boundaryLength;
    let minIdx = 0;
    for (let i = 1; i < this.popSet.length; i++) {
      const current = this.popSet[i].attr.boundaryLength;
      if (current < min) {
        min = current;
        minIdx = i;
      }
    }
    let opFoot = this.popSet[minIdx];
    return opFoot;
  }

  displayOptimalFootprint(opFoot) {
    //console.log(opFoot, minIndex);
    let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
    selectedFootprint.displayGridCells(opFoot.validFootprintMatrix);
    qry("#out-generation").value = opFoot.generation;
    qry("#out-individual").value = opFoot.id;
    qry("#out-parcel-area").value = opFoot.attr.area;
    qry("#out-faRatio").value = opFoot.attr.faRatio;
    qry("#out-boundary-length").value = opFoot.attr.boundaryLength;
    return opFoot;
  }
  animate_save() {
    frameId = requestAnimationFrame(this.animate.bind(this));
    this.displayFootprint(frameId);
  }
}
