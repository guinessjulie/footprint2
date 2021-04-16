import {calcDnaLength, params, range} from "./gaParams.js";
import Gene from "./ga/dna.js";
import Footprint from "./footprint.js";
import {grid, parcel} from "./ProcessParcel.js";
import {qId, qry} from "./alias.js";
import OptimalFootprint from "./optimalFootprint.js";
import {onParcel} from "./ProcessParcel.js"
import {drawOnCanvas, displayCell} from "./utils.js";
import Grid from "./grid2.js";
export let frameId  ;
export default class Footprints { //todo move footprint class to here and separates individuals and population
    constructor() {
        this.populFoots = [];
        this.gridSize = {
            cols: grid.arr2d.length,
            rows: grid.arr2d[0].length
        }
        this.generation = 0;
        this.parcel = onParcel();
        this.grid1 = new Grid('canvas', parcel);
        this.grid2 = new Grid('canvas-generation', parcel);
        this.nextFoot = 0;
        this.popSet = [];
        this.cur = 0;
        //this.matingPool = []; //todo remove later becuase this has useless verbose attrib
        this.matingPoolA= [];
        this.populateDNA(params.popSize) //fill array of this.dnas[]
        this.displayDomInformation()
        this.draw();        
    }
    displayDomInformation() {
        this.popSet.forEach( el => {
            qry('#out-generation').value = el.generation; //todo when evolving process started this will be needed don't worry mr. code reviewer
        });
    }
    initDisplayGrid(){
        this.disableOutsideParcel();
        this.grid1.initCanvasGrid(); 
    }
    disableOutsideParcel(){
        this.grid1.displayCells(this.grid1.matCellInside, 0, 'rgb(120,120,160,0.2)');//parcel 바깥에 있는 셀들을 disable시켜라
    }

    evolve(){
        this.generation +=1;
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
            this.popSet.push(indInfo) ;         
        }
        this.foots = [...this.popSet]
    }

//todo display dom info of footprints generation


    createMatingPool(){
        const landAttrs = this.popSet;
        let minB = landAttrs.reduce((acc, info)=> Math.min(acc, info.attr.boundaryLength), Number.MAX_SAFE_INTEGER);        
        let maxB = landAttrs.reduce((acc, info)=>Math.max(acc, info.attr.boundaryLength), Number.MIN_SAFE_INTEGER);

        for (let i = 0; i < landAttrs.length; i++) {
            const boundary = landAttrs[i].attr.boundaryLength;
            let fitnessBoundary = 1 - range(minB, maxB, 0, 1, boundary);
            let n = fitnessBoundary * 100;
            for (let j = 0; j < n; j++) {
                //this.matingPool.push(landAttrs[i])   //todo : matingPool has useless attributes let's remove later
                this.matingPoolA.push(landAttrs[i].id)   
            }
        }
    }
    select(){
        let newPop = [];
        for (let i = 0; i < params.popSize; i++) {
            let selectedIdx = Math.floor(Math.random()*this.matingPoolA.length);
            let selectedAttr = this.popSet[this.matingPoolA[selectedIdx]];
            let indInfo = {
                id: i,
                gene:selectedAttr.gene,
                attr : selectedAttr.attr,
                validFootprintMatrix: selectedAttr.validFootprintMatrix,
                generation:selectedAttr.generation+1, //to implement
            } //need crossover and mutation

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
        this.foots = [...this.popSet]
    }
    reproduce(){
        this.popSet = [];
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
            this.popSet.push(indInfo);
        }

        this.foots = [...this.popSet]
    }
      
    displayFootprint(frameId){        
        //this.evolve();
        let opFoot = this.foots.shift(); // get one by one from this.foots was deep-copied from  this.popSet
        if (opFoot === undefined){
             cancelAnimationFrame(frameId)
             //this.optimalFootprint();
             //this.evolve();
             this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
             this.grid1.displayCells(opFoot.validFootprintMatrix, 1, "black");
             this.createMatingPool();
             //this.reproduce();
        }else{
             this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
             this.grid1.displayCells(opFoot.validFootprintMatrix, 1, "black")
        }
        // let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
        // let outGeneration = qry('#out-generation');
        // outGeneration.value = opFoot.generation;
    
    }

    displayGeneration(floor){
        if(floor > 0){
            this.grid1.displayCells(this.grid1.matCellInside, 1, "white");
            this.grid1.displayCells(floor.validFootprintMatrix, 1, "black")
        }
        if(this.frameId == undefined) {
            cancelAnimationFrame(frameId);
        }
    }
    backgroundGrid(){
        this.grid1.displayCells(grid.matCellInside, 1, "white"); 
    }
    draw(){
        console.log(this.cur);
        this.frameId = requestAnimationFrame(this.draw.bind(this));
        if(this.generation === 10){
            cancelAnimationFrame(this.frameId);
        }
        if(this.cur < params.popSize){
            this.drawFootprint()
            this.cur +=1;
        }else{
            let best = this.getBestFootprint()
            this.displayOptimalFootprint(best);
            this.evolve();
            this.cur = 0;
        }
        // this.drawBest()
        // this.displayGeneration(floor);   
    }
    drawFootprint(){
        this.backgroundGrid();
        let foot = this.foots[this.cur];
        this.grid1.displayCells(foot.validFootprintMatrix, 1, "black");
    }
    drawIndividual(){ //obsolute
        this.backgroundGrid();
        let foot = this.foot[this.cur];
        if(this.foots.length > 0) {
            let foot = this.foots.shift()
            this.grid1.displayCells(foot.validFootprintMatrix, 1, "black")   
        }else{
            cancelAnimationFrame(frameId);            
            this.evolve();
            // let bestFootMat = this.getBestFootprint();
            // this.drawBest(bestFootMat)
        }
    }
    getBestFootprint(){
        let minIdx = 0;
        let min = this.popSet[0];
        for (let i = 0; i < this.popSet.length; i++) {
            const indv = this.popSet[i];
            if (this.popSet[i].attr.boundaryLength < min){
                min = this.popSet[i].attr.boundaryLength ;
                minIdx = i
            }
        }
        return this.popSet[minIdx];
    }
    drawBest(betFootMat){
        drawOnCanvas('canvas-generation', parcel.vertices, "#35e664");
        let color = 'red';
        //let grid2 = new Grid('canvas-generation', parcel.bbox.min, parcel.bbox.max, CELL_SIZE) //constructor 자체에서initDisplayGrid를 호출한다. 이 떄문에 원본이 초기화되어 안보이게 되는 것이다. 이것을 픽스하려면 grid2를 대대적으로 손보던가 여기 클래스에서 필요한 부분만duplicate하ㅣ던가 해야한다.
        for (let col in [...new Array(this.grid2.cols).keys()]){
            for(let row in [...new Array(this.grid2.rows).keys()]){
                if(betFootMat[col][row] == 1){
                    displayCell('canvas-generation', col, row, parcel.bbox.min, color);
                }
            }
        }
    }
    getOptimalFootprint(){
        let min = this.popSet[0].attr.boundaryLength;
        let minIdx = 0;
        for (let i = 1 ; i < this.popSet.length ; i++) {
            const current = this.popSet[i].attr.boundaryLength;
            if (current < min ) {
                min = current;
                minIdx = i;
            }            
        }
        let opFoot = this.popSet[minIdx]; 
        return opFoot;
    }

    displayOptimalFootprint(opFoot){
        //console.log(opFoot, minIndex);
        let selectedFootprint = new OptimalFootprint(opFoot.validFootprintMatrix); //todo
        selectedFootprint.displayGridCells(opFoot.validFootprintMatrix);
        qry('#out-generation').value = opFoot.generation ;
        qry('#out-individual').value = opFoot.id;
        qry('#out-parcel-area').value = opFoot.attr.area;
        qry('#out-faRatio').value = opFoot.attr.faRatio;
        qry('#out-boundary-length').value = opFoot.attr.boundaryLength;
        return opFoot;
    }
    animate_save(){
        
        frameId = requestAnimationFrame(this.animate.bind(this));
        this.displayFootprint(frameId);
    }
}

