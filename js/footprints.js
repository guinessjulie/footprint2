import {
  calcDnaLength,
  params,
  range,
  lerp,
  invlerp,
  clamp,
} from "./gaParams.js";

import { correlationCoefficient } from "./libs/ex/exMath.js";

import Gene from "./ga/gene.js";
import Footprint from "./footprint.js";
import { grid, parcel } from "./ProcessParcel.js";
import { qId, qry } from "./alias.js";
import OptimalFootprint from "./optimalFootprint.js";
import { onParcel } from "./ProcessParcel.js";
import { getAverage, drawOnCanvas, displayCell } from "./utils.js";
import Grid from "./grid2.js";
export let frameId;
export default class Footprints {
  //todo move footprint class to here and separates individuals and population
  constructor() {
    this.initClassMember();
    this.populateDNA(params.popSize); //fill array of this.dnas[]
    // console.log(`this.popSet in constructor after populateDNA`, this.popSet);
    this.displayDomInformation();
    this.draw(); //THIS IS THE WORKING VERSION DON'T SCREW UP ORIGINAL FILE DON'T DELETE THIS
    //this.drawTemp();
  }

  initClassMember() {
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
    this.initialPopSet = []; //to test matingpool size
    this.cur = 0;
    //this.matingPool = []; //todo remove later becuase this has useless verbose attrib
    //this.matingPoolA = [];
  }

  displayDomInformation() {
    console.log(`this.generation`, this.generation);
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
  draw() {
    frameId = requestAnimationFrame(this.draw.bind(this));
    const numGen = qId("numGeneration").value;
    let pause = false;
    if (this.generation >= numGen) {
      // todo generation change
      cancelAnimationFrame(frameId);
    }
    if (this.cur < params.popSize) {
      this.drawFootprint();
      this.cur += 1;
    } else {
      //let best = this.getBestFootprint(); //draw best of generation
      this.showAvgFitDebugInfo();
      let optimals = this.getOptimalChildren();
      this.displayOptimalFootprints(optimals); //반복작업
      this.evolve();
      this.cur = 0;
    }
  }
  evolve() {
    this.generation += 1;
    qry("#out-generation").value = this.generation;
    //let matingPool = this.createMatingPoolByRouletteWheel();
    let matingPool = this.createMatingPoolByLenAreaRatio();
    let newPop = [];
    for (let i = 0; i < params.popSize; i++) {
      let child = this.select(matingPool, i);
      newPop.push(child);
    }
    this.printNewGenerationInfo(newPop);
    this.popSet = newPop;
    this.foots = [...this.popSet];
  }

  select(matingPool, i) {
    let childNode;
    let idxA = Math.floor(Math.random() * matingPool.length);
    let idxB = Math.floor(Math.random() * matingPool.length);
    let parentAIdx = matingPool[idxA];
    let parentBIdx = matingPool[idxB];
    if (parentAIdx === parentBIdx) {
      //같은 부모를 가리키면 그냥 아무거나 하나 넣는다.
      childNode = { ...this.popSet[parentAIdx] };
    } else {
      const childGene = this.reproduce(parentAIdx, parentBIdx);
      childNode = this.generateChild(childGene, i);
    }
    return childNode;
  }
  reproduce(parentAIdx, parentBIdx) {
    let geneA = this.popSet[parentAIdx].gene;
    let geneB = this.popSet[parentBIdx].gene;
    let dnaA = [...geneA.dna];
    let dnaB = [...geneB.dna];
    let newDNA = Gene.crossoverDNA(dnaA, dnaB);
    this.printReproduceDebug(dnaA, dnaB, newDNA);

    const mutRate = qId("pMutateIn").value;
    const mutDNA = Gene.mutate(newDNA, mutRate);
    let childGene = new Gene(this.gridSize, mutDNA.length);
    childGene.dna = [...mutDNA];
    return childGene;
  }
  printReproduceDebug(dnaA, dnaB, newDNA) {
    console.log(`dnaA, dnaB`, dnaA, dnaB);
    console.log(`newDNA`, newDNA);
  }
  generateChild(childGene, id) {
    let foot = new Footprint(childGene, id);
    let childNode = {
      id: id,
      gene: childGene, //todo duplicate gene, attr.gene
      attr: foot.attr,
      validFootprintMatrix: foot.validFootprintMatrix,
      generation: childGene.generation + 1, //to implement
    };
    return childNode;
  }
  printNewGenerationInfo(newPop) {
    console.log(`new population`);
    const fitLenAreaRatio = newPop.map((pop, idx) => {
      console.log(`${idx}`, pop.gene.dna, pop.attr.lenAreaRatio);
      return pop.attr.lenAreaRatio;
    });
    const avgFit = getAverage(fitLenAreaRatio);
    console.log(`=>average fitness`, avgFit);
  }

  populateDNA(popSize) {
    let permitFaRatio = qId("input-faRatio").value;
    let geneSize = calcDnaLength(parcel.area, +permitFaRatio);
    // console.log(`geneSize`, geneSize);
    for (let i = 0; i < params.popSize; i++) {
      //why why why gene is differ from this.dna in Gene class in file dna.js.
      const gene = new Gene(this.gridSize, geneSize);
      // console.log(`populateDNA: gene, gene.dna`, gene, gene.dna);
      let foot = new Footprint(gene, i);
      let indInfo = {
        id: i,
        gene: gene,
        attr: foot.attr,
        validFootprintMatrix: foot.validFootprintMatrix,
        generation: 0, //to implement
      };
      this.popSet.push(indInfo);
      // console.log(`populateDNA: after allocation indInfo gene`, gene);
    }
    // console.log(`populateDNA: this.popSet`, this.popSet);
    this.initPopSet = [...this.popSet];
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
        this.matingPool.push(population[i]); //todo : matingPool has useless attributes let's remove later
        //this.matingPoolA.push(population[i].id);
      }
    }
    console.log(`this.matingPoolA`, this.matingPoolA);
  }
  createMatingPoolByLenAreaRatio() {
    //array of only measured fitness value
    const population = this.popSet;
    let bLenAreaRatio = population.map((ind, idx) => {
      return ind.attr.lenAreaRatio;
    });

    //to unique array
    let bUniqueArray = [...new Set(bLenAreaRatio)];
    let minB = Math.min(...bUniqueArray);
    let maxB = Math.max(...bUniqueArray);

    //to key-value pair hash map data structure
    // console.log(`bLengthArray.length `, bLengthArray.length);
    let hashMapFitToRelFit = bUniqueArray.reduce((map, len) => {
      if (maxB === minB) {
        map[len] = 1;
        return map;
      }
      map[len] = (len - minB) / (maxB - minB);
      return map;
    }, {});

    // console.log(`bLengthArray`, bLengthArray);
    // console.log(`hashMapFitToRelFit`, hashMapFitToRelFit);
    //population array stored the relative fitness value
    let fits = bLenAreaRatio.map((len) => {
      return hashMapFitToRelFit[len];
    });
    // console.log(`fits`, fits);
    let matingPool = [];
    const k = 10;
    for (let i = 0; i < k; i++) {
      fits.forEach((fitness, idx) => {
        let pick = Math.random();
        if (pick <= fitness) {
          matingPool.push(idx);
        }
      });
    }
    // console.log(`matingPool`, matingPool);
    //this.testMatingPoolSize(matingPool, relativeFitnesses);
    return matingPool;
  }
  createMatingPoolByRouletteWheel() {
    //array of only measured fitness value
    const population = this.popSet;
    let bLengthArray = population.map((ind, idx) => {
      return ind.attr.boundaryLength;
    });

    //to unique array
    let bUniqueArray = [...new Set(bLengthArray)];
    let minB = Math.min(...bUniqueArray);
    let maxB = Math.max(...bUniqueArray);

    //to key-value pair hash map data structure
    // console.log(`bLengthArray.length `, bLengthArray.length);
    let hashMapFitToRelFit = bLengthArray.reduce((map, len) => {
      if (maxB === minB) {
        map[len] = 1;
        return map;
      }
      map[len] = 1 - (len - minB) / (maxB - minB);
      return map;
    }, {});

    // console.log(`bLengthArray`, bLengthArray);
    // console.log(`hashMapFitToRelFit`, hashMapFitToRelFit);
    //population array stored the relative fitness value
    let fits = bLengthArray.map((len) => {
      return hashMapFitToRelFit[len];
    });
    // console.log(`fits`, fits);
    let matingPool = [];
    const k = 10;
    for (let i = 0; i < k; i++) {
      fits.forEach((fitness, idx) => {
        let pick = Math.random();
        if (pick <= fitness) {
          matingPool.push(idx);
        }
      });
    }
    // console.log(`matingPool`, matingPool);
    //this.testMatingPoolSize(matingPool, relativeFitnesses);
    return matingPool;
  }

  testMatingPoolSize(matingPool, relativeFitnesses) {
    //key-value pair of matingPool how many times has been selected each individual(key) element
    let countFit = matingPool.reduce((map, val) => {
      map[val] = (map[val] || 0) + 1;
      return map;
    }, {});
    console.log(`countFit`, countFit);

    //repeated selection
    //countFit hashMap to array
    let countFitArray = [];
    for (let i = 0; i < relativeFitnesses.length; i++) {
      let cnt = countFit[i];
      if (cnt === undefined) {
        cnt = 0;
      }
      countFitArray.push(cnt);
    }

    //correlation Coefficient
    const cc = correlationCoefficient(
      countFitArray,
      relativeFitnesses,
      relativeFitnesses.length
    );
    // console.log(repeatePick + "," + matingPool.length + "," + cc);
  }

  selectSave() {
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
  reproduce_old() {
    this.popSet = [];
    for (let i = 0; i < params.popSize; i++) {
      let momIdx = Math.floor(Math.random() * matingPool.length);
      let dadIdx = Math.floor(Math.random() * matingPool.length);
      let momDNA = this.matingPool[momIdx];
      let dadDNA = this.matingPool[dadIdx];
      let childDNA = momDNA.crossover(dadDNA);
      let foot = new Footprint(childDNA, i);
      console.log(`foot`, foot);
      let indInfo = {
        id: i,
        gene: childDNA,
        attr: foot.attr,
        validFootprintMatrix: foot.validFootprintMatrix,
        generation: 1,
      };
      this.popSet.push(indInfo);
    }
    const dnas = this.popSet.map((data) => data.gene.dna);
    console.log(`dnas`, dnas);
    this.foots = [...this.popSet];
  }

  //   displayFootprint(frameId) {
  //     //this.evolve();
  //     let opFoot = this.foots.shift(); // get one by one from this.foots was deep-copied from  this.popSet
  //     if (opFoot === undefined) {
  //       cancelAnimationFrame(frameId);
  //       //this.optimalFootprint();
  //       //this.evolve();
  //       this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
  //       this.grid1.displayCells(opFoot.validFootprintMatrix, 1, "black");
  //       //this.createMatingPool(); //todo replace
  //       console.log(`what?`);
  //       this.createMatingPoolByRouletteWheel(); //todo replace
  //       //this.reproduce();
  //     } else {
  //       this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
  //       this.grid1.displayCells(opFoot.validFootprintMatrix, 1, "black");
  //     }
  //     // let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
  //     // let outGeneration = qry('#out-generation');
  //     // outGeneration.value = opFoot.generation;
  //   }

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
  drawTemp() {
    const numGen = qId("numGeneration").value;
    if (this.generation > numGen) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.cur < this.popSize) {
      this.drawFootprint();
      this.frameId = requestAnimationFrame(this.drawTemp.bind(this));
      this.cur += 1;
    }
    this.evolve();
    this.cur += 0;
    // this.drawBest()
    //this.displayGeneration(floor);
  }

  draw_save() {
    this.frameId = requestAnimationFrame(this.draw.bind(this));
    const numGen = qId("numGeneration").value;
    let pause = false;
    if (this.generation >= numGen) {
      //end evolve (when generation length is over)
      // todo generation change
      cancelAnimationFrame(this.frameId);
    }
    if (this.cur < params.popSize) {
      this.drawFootprint(); //draw every individuals
      this.cur += 1;
    } else {
      //test
      //let bestSet = this.getBestSet(); //만약 두 개 이상의 child가 똑같은 fitness를 가질 때 두 개 다 표시하고 싶다. 그런 경우 별로 없는 듯
      //test end
      let best = this.getBestFootprint(); //draw best of generation
      this.displayOptimalFootprint(best);
      this.evolve();
      this.cur = 0;
    }
    // this.drawBest()
    // this.displayGeneration(floor);
  }

  drawFootprint() {
    this.backgroundGrid();
    let foot = this.foots[this.cur]; //current individual
    this.grid1.displayCells(foot.validFootprintMatrix, 1, "black");
  }
  showAvgFitDebugInfo() {
    const fits = this.popSet.map((ind) => ind.attr.lenAreaRatio);
    console.log(`fits.getAverage(fits)`, getAverage(fits));
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
  }
  getOptimalChildren() {
    let maxIdx = 0;
    //let min = this.popSet[0].attr.lenAreaRatio; //todo parameterise for fitness
    let max = 0;
    for (let i = 0; i < this.popSet.length; i++) {
      if (this.popSet[i].attr.lenAreaRatio >= max) {
        max = this.popSet[i].attr.lenAreaRatio;
        maxIdx = i;
      }
    }
    const optimalSolutions = this.popSet.filter(
      (ind) => ind.attr.lenAreaRatio === max
    );
    //console.log(`optimalSolutions`, optimalSolutions);
    return optimalSolutions;
  }
  //   drawBest(betFootMat) {
  //     drawOnCanvas("canvas-generation", parcel.vertices, "#999");
  //     let color = "black";
  //     //let grid2 = new Grid('canvas-generation', parcel.bbox.min, parcel.bbox.max, CELL_SIZE) //constructor 자체에서initDisplayGrid를 호출한다. 이 떄문에 원본이 초기화되어 안보이게 되는 것이다. 이것을 픽스하려면 grid2를 대대적으로 손보던가 여기 클래스에서 필요한 부분만duplicate하ㅣ던가 해야한다.
  //     for (let col in [...new Array(this.grid2.cols).keys()]) {
  //       for (let row in [...new Array(this.grid2.rows).keys()]) {
  //         if (betFootMat[col][row] == 1) {
  //           displayCell("canvas-generation", col, row, parcel.bbox.min, color);
  //         }
  //       }
  //     }
  //   }
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
    // console.log(`selectedFootprint`, selectedFootprint);
    selectedFootprint.displayGridCells(opFoot.validFootprintMatrix);
    qry("#out-generation").value = opFoot.generation;
    qry("#out-individual").value = opFoot.id;
    qry("#out-parcel-area").value = opFoot.attr.area;
    qry("#out-faRatio").value = opFoot.attr.faRatio;
    qry("#out-boundary-length").value = opFoot.attr.boundaryLength;
    console.log(
      "optimalFoot: gen, faRatio, boundaryLength",
      opFoot.generation,
      opFoot.attr.faRatio,
      opFoot.attr.boundaryLength
    );
    return opFoot;
  }
  displayOptimalFootprints(ops) {
    //console.log(opFoot, minIndex);
    ops.forEach((opFoot) => {
      let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
      // console.log(`selectedFootprint`, selectedFootprint);
      selectedFootprint.displayGridCells(opFoot.validFootprintMatrix);
      qry("#out-generation").value = opFoot.generation;
      qry("#out-individual").value = opFoot.id;
      qry("#out-parcel-area").value = opFoot.attr.area;
      qry("#out-faRatio").value = opFoot.attr.faRatio;
      qry("#out-boundary-length").value = opFoot.attr.boundaryLength;
      // console.log(
      //   "optimalFoot: gen, faRatio, boundaryLength",
      //   opFoot.generation,
      //   opFoot.attr.faRatio,
      //   opFoot.attr.boundaryLength,
      //   opFoot.attr.lenAreaRatio
      // );
    });
  }
  //not using right now
  getBestSet() {
    let arryBLength = this.popSet.map((item) => item.attr.boundaryLength);
    let minVal = Math.min(...arryBLength);
    let bestSet = this.popSet.filter(
      (ind) => ind.attr.boundaryLength <= minVal
    );
    // console.log(`bestSet`, bestSet);
    return bestSet;
  }

  animate_save() {
    frameId = requestAnimationFrame(this.animate.bind(this));
    this.displayFootprint(frameId);
  }
}
