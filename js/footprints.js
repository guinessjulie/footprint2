import {calcDnaLength, params, range} from "./gaParams.js";
import Gene from "./ga/dna.js";
import Footprint from "./footprint.js";
import {grid, parcel} from "./ProcessParcel.js";
import {qId, qry} from "./alias.js";
import OptimalFootprint from "./optimalFootprint.js";
import {delay} from "./utils.js";
export let animationId  ;
export default class Footprints { //todo move footprint class to here and separates individuals and population
    constructor() {
        this.populFoots = [];
        this.gridSize = {
            cols: grid.arr2d.length,
            rows: grid.arr2d[0].length
        }
        this.nextFoot = 0;
        this.indiSet = [];
        this.matingPool = []; //todo remove later becuase this has useless verbose attrib
        this.matingPoolA= [];
        this.initDisplayGrid();
        this.populateDNA(params.popSize) //fill array of this.dnas[]
        //this.initPopulationFootprint();
        this.displayDomInformation()
        //this.optimalFootprint();
        this.animate();
        
    }
    initDisplayGrid(){
        grid.displayCells(grid.matCellInside, 0, 'rgb(120,120,160,0.2)');//doing
        grid.initCanvasGrid(); //lets move to footprints as this is needed onlyh once. with above line
    }
    displayDomInformation() {
        this.indiSet.forEach( el => {
            qry('#out-generation').value = el.generation; //todo when evolving process started this will be needed don't worry mr. code reviewer
        });
    }
    evolve(){
        this.createMatingPool();
        this.select();
        //this.createGeneration(params.popSize);
    }
    //to implement
    createGeneration(numIndividual){
        let generation = {
            genId : 0,
            numInd : numIndividual,
            selected : [] 
        }
    }
    populateDNA(popSize) {
        let permitFaRatio = qId('input-faRatio').value;
        let geneSize = calcDnaLength(parcel.area, +permitFaRatio)
        for (let i = 0; i <params.popSize; i++) {
            let gene = new Gene(this.gridSize, geneSize)
            let foot = new Footprint(gene, i);
            let indInfo = {
                id: i,
                gene:gene,
                attr : foot.attr,
                validFootprintMatrix: foot.validFootprintMatrix,
                generation:0, //to implement
            }
            this.indiSet.push(indInfo) ;         
        }
        this.foots = [...this.indiSet]
    }

//todo display dom info of footprints generation

    optimalFootprint(){
        let min = this.indiSet[0].attr.boundaryLength;
        let minIdx = 0;
        for (let i = 1 ; i < this.indiSet.length ; i++) {
            const current = this.indiSet[i].attr.boundaryLength;
            if (current < min ) {
                min = current;
                minIdx = i;
            }            
        }
        let opFoot = this.indiSet[minIdx]; //todo get optimal one. now testing with last one right now
        //console.log(opFoot, minIndex);
        let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
        qry('#out-generation').value = opFoot.generation ;
        qry('#out-individual').value = opFoot.id;
        qry('#out-parcel-area').value = opFoot.attr.area;
        qry('#out-faRatio').value = opFoot.attr.faRatio;
        qry('#out-boundary-length').value = opFoot.attr.boundaryLength;
    }
    createMatingPool(){
        const landAttrs = this.indiSet;
        let minB = landAttrs.reduce((acc, info)=> Math.min(acc, info.attr.boundaryLength), Number.MAX_SAFE_INTEGER);        
        let maxB = landAttrs.reduce((acc, info)=>Math.max(acc, info.attr.boundaryLength), Number.MIN_SAFE_INTEGER);

        for (let i = 0; i < landAttrs.length; i++) {
            const boundary = landAttrs[i].attr.boundaryLength;
            let fitnessBoundary = 1 - range(minB, maxB, 0, 1, boundary);
            let n = fitnessBoundary * 100;
            for (let j = 0; j < n; j++) {
                this.matingPool.push(landAttrs[i])   //todo : matingPool has useless attributes let's remove later
                this.matingPoolA.push(landAttrs[i].id)   
            }
        }
    }
    select(){
        for (let i = 0; i < params.popSize; i++) {
            let selectedIdx = Math.floor(Math.random()*this.matingPoolA.length);
            let selectedAttr = this.indiSet[this.matingPoolA[selectedIdx]];
            let gene = selectedAttr.gene;
            // let gene = new Gene(this.gridSize, geneSize)
            // let foot = new Footprint(gene, i);
            // let indInfo = {
            //     id: i,
            //     gene:gene,
            //     attr : foot.attr,
            //     validFootprintMatrix: foot.validFootprintMatrix,
            //     generation:0, //to implement
            // }
            // this.indiSet.push(indInfo) ;         
        }
        this.foots = [...this.indiSet]
    }
    reproduce(){
        this.indiSet = [];
        for (let i = 0; i < params.popSize; i++) {
            let momIdx = Math.floor(Math.random()*this.matingPool.length);
            let dadIdx = Math.floor(Math.random()*this.matingPool.length);
            let momDNA = this.matingPool[momIdx];
            let dadDNA = this.matingPool[dadIdx];
            let childDNA = momDNA.crossover(dadDNA);
            let foot = new Footprint(childDNA, i);
            let indInfo = {
                id:i,
                gene:childDNA,
                attr : foot.attr,
                validFootprintMatrix: foot.validFootprintMatrix,
                generation:1,
            }
            this.indiSet.push(indInfo);
        }

        this.foots = [...this.indiSet]
    }
      
    displayFootprint(animationId){        
        this.evolve();
        let opFoot = this.foots.shift(); // get one by one from this.foots was deep-copied from  this.indiSet
        if (opFoot === undefined){
             cancelAnimationFrame(animationId)
             this.optimalFootprint();
             this.createMatingPool();
             //this.reproduce();
        }else{
             grid.displayCells(grid.matCellInside, 1, "white");
             grid.displayCells(opFoot.validFootprintMatrix, 1, "black")
        }
        // let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
        // let outGeneration = qry('#out-generation');
        // outGeneration.value = opFoot.generation;
    
    }
 
    animate(){
        animationId = requestAnimationFrame(this.animate.bind(this));
        this.displayFootprint(animationId);
    }
}

