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
    this.frameId = requestAnimationFrame(this.draw.bind(this));
    const numGen = qId("numGeneration").value;
    let pause = false;
    if (this.generation >= numGen) {
      // todo generation change
      cancelAnimationFrame(this.frameId);
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
    // this.drawBest()
    //this.displayGeneration(floor);
  }
  evolve() {
    this.generation += 1;
    qry("#out-generation").value = this.generation;
    //let matingPool = this.createMatingPoolByRouletteWheel();
    let matingPool = this.createMatingPoolByLenAreaRatio();
    this.selectReproduce(matingPool);
  }
  reproduce_test(matingPool, idxA, idxB, parentAIdx, parentBIdx) {
    let objA = {};
    let objB = {};
    objA = JSON.parse(JSON.stringify(this.popSet[parentAIdx].gene)); //for deep copy
    objB = JSON.parse(JSON.stringify(this.popSet[parentBIdx].gene)); //for deep copy
    console.log(`=>=>=>A`, parentAIdx, objA.dna);
    console.log(`=>=>=>B`, parentBIdx, objB.dna);
    let childGene = objA.crossoverRandomPoint(objB);
    this.popSet.map((pop, idx) => {
      console.log(`=>=>=>after crossoverRandomPoint`, idx, pop.gene.dna);
    });
    const mutRate = qId("pMutateIn").value;
    const newGene = childGene.mutate(mutRate);
    // console.log(`childGene, newGene`, childGene, newGene);
    return newGene;
  }
  reproduce(matingPool, idxA, idxB, parentAIdx, parentBIdx) {
    // console.log(`=>=>=>inside the reproduce(): before`);
    let geneA = this.popSet[parentAIdx].gene; //여기까지 this.popSet as it was before
    let geneB = this.popSet[parentBIdx].gene;
    //이렇게 하면  geneA 값이 변경되면 this.popSet 값이 같이 변경된다 병신같아

    // let fitA = this.popSet[matingPool[idxA]].attr.lenAreaRatio;
    // let fitB = this.popSet[matingPool[idxB]].attr.lenAreaRatio;
    // console.log(`fitA, fitB`, fitA, fitB);

    //childGene = geneA.crossoverRandomPoint(geneB);
    let dnaA = JSON.parse(JSON.stringify(geneA.dna));
    let dnaB = JSON.parse(JSON.stringify(geneB.dna));

    let newDNA = Gene.crossoverDNA(dnaA, dnaB);
    console.log(`=>=>=>A`, parentAIdx, dnaA);
    console.log(`=>=>=>B`, parentBIdx, dnaB);
    console.log(`=>=>=>newDNA`, newDNA);
    // this.popSet.map((pop, idx) => {
    //   console.log(`=>=>=>after crossoverRandomPoint`, idx, pop.gene.dna);
    // });
    // console.log(`childGene.dna`, childGene.dna);
    const mutRate = qId("pMutateIn").value;
    const mutDNA = Gene.mutate(newDNA, mutRate);
    console.log(`=>=>=>mutDNA`, mutDNA);
    let childGene = new Gene(this.gridSize, mutDNA.length);
    childGene.dna = [...mutDNA];
    console.log(`=>=>=>mutated childGene.dna`, childGene.dna);
    return childGene;
  }
  createNewCrossoverGene(geneA, geneB) {
    let newGene = new Gene(this.gridSize, geneA.dna.length);
    let newDNA = [];
    let splitPoint = Math.floor(
      Math.random() * (Math.min(geneA.dna.length, geneB.dna.length) - 1) + 1
    );
    for (let i = 0; i < splitPoint; i++) {
      newDNA.push(geneA.dna[i]);
    }
    for (let j = splitPoint; j < geneB.dna.length; j++) {
      newDNA.push(geneB.dna[j]);
    }
    newGene.dna = newDNA;
    return newGene;
  }

  selectReproduce(matingPool) {
    let newPop = [];
    // console.log(`=>selectReproduce: `);
    for (let i = 0; i < params.popSize; i++) {
      let childNode;
      let idxA = Math.floor(Math.random() * matingPool.length);
      let idxB = Math.floor(Math.random() * matingPool.length);
      let parentAIdx = matingPool[idxA];
      let parentBIdx = matingPool[idxB];
      let childGene;
      console.log(
        `=>=>pop[${i}] A, B`,
        parentAIdx,
        this.popSet[parentAIdx].gene.dna,
        parentBIdx,
        this.popSet[parentBIdx].gene.dna
      );
      if (parentAIdx === parentBIdx) {
        //같은 부모를 가리키면 그냥 아무거나 하나 넣는다.
        childNode = this.popSet[parentAIdx];
      } else {
        childGene = this.reproduce(
          matingPool,
          idxA,
          idxB,
          parentAIdx,
          parentBIdx
        );
        childNode = this.generateChild(childGene, i);
      } //end else
      console.log(`childNode`, childNode.gene.dna);
      newPop.push(childNode);
    } //for this.popSize
    const fitLenAreaRatio = newPop.map((pop, idx) => {
      console.log(`${idx}=>newPop`, pop.gene.dna, pop.attr.lenAreaRatio);
      return pop.attr.lenAreaRatio;
    });
    const avgFit = getAverage(fitLenAreaRatio);
    console.log(`=>average fitness of newPop`, avgFit);
    this.popSet = newPop;
    this.foots = [...this.popSet];
  }

  selectReproduce_debug_crossoverchance(matingPool) {
    let newPop = [];

    for (let i = 0; i < params.popSize; i++) {
      let childNode;
      let idxA = Math.floor(Math.random() * matingPool.length);
      let idxB = Math.floor(Math.random() * matingPool.length);
      let parentAIdx = matingPool[idxA];
      let parentBIdx = matingPool[idxB];

      if (parentAIdx === parentBIdx) {
        //같은 부모를 가리키면 그냥 아무거나 하나 넣는다.
        childNode = this.popSet[parentAIdx];
      }

      console.log(`parentA, parentB`, parentAIdx, parentBIdx);
      let geneA = this.popSet[parentAIdx].gene;
      let geneB = this.popSet[parentBIdx].gene;
      //todo change fitness from boundaryLength
      //choose better parent when it is belower than crossover chances
      console.log(
        `this.popSet[matingPool[idxA]].attr.lenAreaRatio`,
        this.popSet[matingPool[idxA]].attr.lenAreaRatio
      );
      console.log(
        `this.popSet[matingPool[idxB]].attr.lenAreaRatio`,
        this.popSet[matingPool[idxB]].attr.lenAreaRatio
      );
      let fitA = this.popSet[matingPool[idxA]].attr.boundaryLength;
      let fitB = this.popSet[matingPool[idxB]].attr.boundaryLength;
      console.log(`boundaryLength of FitA and FitB`, fitA, fitB);

      //when fitness is the same, just toss the coin
      let betterGene;
      let betterGeneIdx;
      let betterFit;
      if (fitA === fitB) {
        if (Math.floor(Math.random()) > 0.5) {
          betterFit = fitA;
          betterGene = geneA;
          betterGeneIdx = parentAIdx;
        } else {
          betterFit = fitB;
          betterGene = geneB;
          betterGeneIdx = parentBIdx;
        }
      } else {
        betterFit = fitA < fitB ? fitA : fitB;
        betterGene = fitA < fitB ? geneA : geneB;
        betterGeneIdx = fitA < fitB ? parentAIdx : parentBIdx;
      }
      console.log(
        `betterGeneIdx, better Fitness`,
        betterGeneIdx,
        betterFit,
        betterGene
      );

      let childGene;
      const crossoverChance = params.pCrossOut;
      // console.log(`betterGene`, betterGene);
      // console.log(`params.pCrossOut`, crossoverChance);
      // let better = this.popSet[matingPool[idxA]].attr.
      let roll = Math.random();
      // console.log(`roll:pCrossOut`, roll, crossoverChance);
      if (roll < crossoverChance) {
        //if the roll lower than a chance
        // console.log(`childGene is betterGene`);
        childGene = betterGene;
        console.log(betterGeneIdx + `is selected`);
      } else {
        // console.log(`ChildGene is produced by crossover`);
        childGene = geneA.crossoverRandomPoint(geneB);
        console.log(`GeneA crossovered with GeneB`);
        console.log(`childGene.dna`, childGene.dna);
      }
      childNode = this.generateChild(childGene, i);
      newPop.push(childNode);
    }
    this.popSet = newPop.slice();
    this.foots = [...this.popSet];
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

  selectReproduceWithLog(matingPool) {
    console.log(`this.popSet`, this.popSet);
    console.log(`matingPool`, matingPool);
    let newPop = [];
    const dnaString = this.popSet.map((item) => {
      return item.gene.dna + ": " + item.attr.boundaryLength;
    });
    //console.log(`this.popSet`, this.popSet);
    console.log(
      `selectReproduce popSet.gene.dna: before loop(popSize)`,
      dnaString
    );
    console.log(`matingPool`, matingPool);
    for (let i = 0; i < params.popSize; i++) {
      let idxA = Math.floor(Math.random() * matingPool.length);
      let idxB = Math.floor(Math.random() * matingPool.length);
      // console.log(`idxA, idxB`, idxA, idxB);
      // console.log(`matingPool[idxA]`, `matingPool[idxB]`);
      // console.log(matingPool[idxA], matingPool[idxB]);
      // console.log(`this.popSet`, this.popSet);
      let attrA = this.popSet[matingPool[idxA]];
      let attrB = this.popSet[matingPool[idxB]];
      // console.log(`attrA, attrB`, attrA, attrB);
      let geneA = attrA.gene;
      let geneB = attrB.gene;
      // console.log(`geneA, geneB`, geneA, geneB);
      let childGene = geneA.crossoverRandomPoint(geneB);
      // console.log(`childGene`, childGene);
      // let childGene = geneA.crossoverRandomPoint(geneB);
      let foot = new Footprint(childGene, i);
      let childNode = {
        id: i,
        gene: childGene, //todo duplicate gene, attr.gene
        attr: foot.attr,
        validFootprintMatrix: foot.validFootprintMatrix,
        generation: childGene.generation + 1, //to implement
      };
      // console.log(`geneA, geneB`, geneA, geneB);
      // console.log(`childGene`, childGene);
      newPop.push(childNode);
      // console.log(`indInfo`, indInfoA, indInfoB);
    }
    this.popSet = newPop;
    const dnaString2 = this.popSet.map((item) => item.gene.dna);
    // console.log(
    //   "selectReproduce popSet.gene.dna: after loop(popSize)",
    //   dnaString2
    // );
    this.foots = [...this.popSet];
    // console.log(`this.foots`, this.foots);
  }

  select(matingPool) {
    // console.log(`this.popSet`, this.popSet);
    let newPop = [];

    for (let i = 0; i < params.popSize; i++) {
      let selectedIdx = Math.floor(Math.random() * matingPool.length);
      let selectedAttr = this.popSet[matingPool[selectedIdx]];
      let indInfo = {
        id: i,
        gene: selectedAttr.gene,
        attr: selectedAttr.attr,
        validFootprintMatrix: selectedAttr.validFootprintMatrix,
        generation: selectedAttr.generation + 1, //to implement
      }; //need crossover and mutation
      //   console.log(`newly selected individual`, indInfo);
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

    // to see average fitness value after evolved in each generation
    // const avgFit = newPop.reduce((avg, ind, _, { length }) => {
    //   return avg + ind.attr.boundaryLength / length;
    // }, 0);

    this.popSet = newPop;
    this.foots = [...this.popSet];
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
