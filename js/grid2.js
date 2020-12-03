import {mapGeno} from './cell.js'
//import Cell from './cell.js'
import Cell from './cell2.js'
import {rand, geneToColor} from './utils.js'
import Polygon from './Polygon.js';
import Vec2 from './Vec2.js';
import matrix from './libs/matrix-js/lib/index.js'
import {floorAreaRatio, fitnessFaRatio, dnaLength, params} from './gaParams.js'
import Individual from './ga/individual.js';
import { CELL_SIZE, permitFaRatio } from './global.js';
import { matrixValCount } from './ga/fitness.js';
import DNA from './ga/dna.js'
import { parcel } from './ProcessParcel.js'

//import { getParcel } from './Parcel.js'
export default class Grid{
    constructor(min, max, CELL_SIZE){
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.size = CELL_SIZE;
        this.min = min;
        this.max = max;   
        this.cols = Math.floor((max.x - min.x) / this.size);
        this.rows = Math.floor((max.y - min.y) / this.size);
        this.grid = this.to2DArray(this.rows, this.cols );
        this.validGrid = this.to2DArray(this.rows, this.cols);
        this.initDisplayGrid(this.size);
        this.nitro = ''
        this.activeCell = 0; //todo this.activeCell은 매번 +1로 할당 validCellCount로 쓸 수 있을 거 같다. 
        this.foot = this.to2DArray();
    }
    to2DArray(){
        let arr = new Array(this.cols);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(this.rows); //changed 2020-11-09
        }
        return arr;
    }
    initDisplayGrid(size, lineWidth = 1, fillStyle = '#cef', strokeStyle = '#333'){
        
        for (let col in [...new Array(this.cols).keys()]){
            for(let row in [...new Array(this.rows).keys()]){
                this.ctx.save();
                let { x, y, w } = this.toCoords(col, row, size);
                this.ctx.translate(x, y);
                this.ctx.fillStyle = fillStyle;
                this.ctx.strokeStyle = strokeStyle;
                this.ctx.fillRect(0, 0, w, w);
                this.ctx.lineWidth = lineWidth;
                this.ctx.strokeRect(0, 0, w, w);
                this.ctx.font = '9px mono';
                let num = col.toString() + ' '+row.toString();
                this.ctx.strokeText(num, 3, (size/2) );
                this.ctx.restore();
                //this.footprint = []; //refactor
            }
        }   
    }
    

    toCoords(col, row, size) {
        let loc = { col, row, size };
        let x = this.tr(loc).x; //this.min.x+col*size;
        let y = this.tr(loc).y; //this.min.y+row*size;
        let w = this.tr(loc).w;
        return { x, y, w };
    }

    tr(loc){
        return{
            x: this.min.x + loc.col*loc.size,
            y: this.min.y + loc.row*loc.size,
            w : loc.size - 3

        }
    }


    //todo seperate from onStartFootPrint to createDNA and drawFootPrint()
    dnaToFootprintMatrix(dna){
        let col = dna.startPos.col;
        let row = dna.startPos.row;
        let cur = {}
        let activeCells = []
        let gene = dna.nitro[0] // from nextState에서  geno를 새로 생성하지 않고 있는 DNA 에 따라 쉐입을 생성하자
        let cell = {col : col, row: row, active:0}
        activeCells.push(cell)
        this.grid[col][row] = cell;
        for(let i=1; i<dna.nitro.length; i++){
            gene = dna.nitro[i];
            cell = this.nextCell(cell, gene)
            activeCells.push(cell);
        }
        console.log('activeCells', activeCells);
    }

    nextCell(cell, nitro){ 
        let col = +cell.col;
        let row = +cell.row;
        let next;
        const grid = (col, row)=>this.grid[col][row];
        switch(nitro){
            case '00': //east
            col = col === this.cols - 1 ? col : col+1;
            while(grid(col,row) && col < this.cols-1){
                col +=1;
            }           
            break;
        case '10' : //West
            col = col === 0? col : col-1;
            while(grid(col,row) && col > 0){
                col -=1;
            }
            break;
        case '01' : //South
            row = row===this.rows -1 ? row : row+1;
            while(grid(col,row) && row < this.rows-1){
                row +=1;
            }
            break;
        case '11' : //North
            row = row === 0? row : row-1;
            while(grid(col, row) && row >0 ){
                row -=1;
            }
            break;
        default:
            break;
        }
        return {col:col, row:row}
//        next = new Cell(col, row);
//        this.grid[col][row] = next;
//        return next;
//        }

    }
    //in this step, nitro for iter number of code is completed. now we have this.nitro which is a individual
    setFootprintMatrixPrint(cur,iter, dna){
   
        for (let i = 0; i < iter; i++) {
            let next = this.nextState(cur,i, dna);
            console.log('next[', i+1,']', this.grid[next.col][next.row]);
            this.nitro += ' '+ next.nitrobasis;
            if(next) {
                this.activeCell+=1;
                this.displayCell(next.col, next.row, geneToColor(next.nitrobasis));
                cur = next; 
            }
            else break;    
            
        }
    }

    createDNA(dnaLen){
        let dna = new DNA(dnaLen, [this.grid.col], [this.grid.row]);
        return dna;
    }
    onStartFootPrint(){
        //this.initCell(iter);
        //let parcelArea = parcel.area;
        //let dnaSize = dnaLength(parcelArea, permitFaRatio)
        //let col = this.grid.col;
        //let row = this.grid.row;
        //let dna = new DNA(dnaSize, [col, row])
        let dnaLen = dnaLength(parcel.area, permitFaRatio);
        let dna = this.createDNA(dnaLen);
        let cur = new Cell(Math.floor(this.cols/2), Math.floor(this.rows/2), dna.gene[0]);
        if(!cur) return false;
        this.activeCell +=1;
        this.nitro += cur.nitrobasis; //todo to move Individual
        //cur.occupied = true; //deleted for refactoring
        //this.footprint.push([cur.col, cur.row]); //refactor
        this.grid[cur.col][cur.row] = cur;
        console.log('initial cell', cur)
        this.displayCell(cur.col, cur.row, geneToColor(cur.nitrobasis));
        this.setFootprintMatrixPrint(cur,dnaLen, dna);
    }
    displayGrid(col, row, color){
        this.ctx.fillStyle = color;
        let size = this.size;
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(col*size, row*size, size-3, size-3)
    }
    displayCell(col, row, color='black'){
        this.ctx.save();
        let size = this.size
        this.ctx.lineWidth = 1 ;
        this.ctx.fillStyle = color;
        let loc = {col, row, size}
        let x = this.tr(loc).x
        let y = this.tr(loc).y;
        let w = this.tr(loc).w;
        this.ctx.translate(x, y);
        this.ctx.fillRect(0, 0, w, w);
        this.ctx.restore();
    }


    nextState(cell, iter, dna){
        let col = +cell.col;
        let row = +cell.row;
        let next;
        const grid = (col, row)=>this.grid[col][row];
        switch(cell.nitrobasis){
            case '00' : //East
                col = col === this.cols -1 ? col : col+1;
                while(grid(col,row) && col < this.cols-1){
                    col +=1;
                }           
                break;
            case '10' : //West
                col = col === 0? col : col-1;
                while(grid(col,row) && col > 0){
                    col -=1;
                }
                break;
            case '01' : //South
                row = row===this.rows -1 ? row : row+1;
                while(grid(col,row) && row < this.rows-1){
                    row +=1;
                }
                break;
            case '11' : //North
                row = row === 0? row : row-1;
                while(grid(col, row) && row >0 ){
                    row -=1;
                }
                break;
            default:
                break;
        }

        next = new Cell(col, row, dna.gene[iter+1]);
        this.grid[col][row] = next;
        return next;
    }

    parcelArea(vertices) {
        let poly = new Polygon(vertices);
        let area = poly.area();
        return {area, poly};
    }

    //menu > validate >
    onValidateCell(vertices){
        let size = this.size;
        let {area, poly} = this.parcelArea(vertices);
        console.log('polygon area :',  area)
        for(let row in [...new Array(this.rows).keys()]){
            for (let col in [...new Array(this.cols).keys()]){
                let loc = {col, row, size};
                let arrPt = [];
                let { pt1, pt2, pt3, pt4 } = this.cellVertices(loc, size);
                arrPt.push(pt1, pt2, pt3, pt4);
                this.setValidGrid(col, row, arrPt, poly);
                this.setFootprintMatrix(col, row)
        }}
        this.displayValidCell(vertices);
        
        //todo move to costfunction
        //let validCount = this.matrixValCount(matrix(this.foot).and(matrix(this.validGrid)), 1) ; 
        //let validArea = validCount * this.size*this.size;
        //console.log('validCount', validCount,'validArea', validArea);
        //console.log('floorAreaRatio', floorAreaRatio(area, validArea))

//
    }


    setValidGrid(col, row, arrPt, poly) {
        this.validGrid[col][row] = arrPt.filter(pt => poly.ptInPolygon(pt)).length == 4 ? 1 : 0;
    }

    cellVertices(loc, size) {
        let pt1 = new Vec2(this.tr(loc).x, this.tr(loc).y);
        let pt2 = new Vec2(this.tr(loc).x, this.tr(loc).y + size);
        let pt3 = new Vec2(this.tr(loc).x + size, this.tr(loc).y + size);
        let pt4 = new Vec2(this.tr(loc).x + size, this.tr(loc).y);
        return { pt1, pt2, pt3, pt4 };
    }

    displayValidCell(vertices){
        // for (let col in [...new Array(this.cols).keys()]){
        //     for(let row in [...new Array(this.rows).keys()]){
        //         if(this.validGrid[col][row] === 0){
        //             this.displayCell(col, row, 'rgb(20,20,20,0.2');
        //         }
        // }}
        this.displayCells(this.validGrid, 0, 'rgb(20, 20, 20, 0.2')
        this.validFootprint(vertices)
    }
    //todo 주어진 1/0 array 에서 1만 출력
    displayCells(arr, id=1, color='red'){
        for (let col in [...new Array(this.cols).keys()]){
            for(let row in [...new Array(this.rows).keys()]){
                if(arr[col][row] === id){
                    this.displayCell(col, row, color);
                }
        }}
            
    }        

    onPreview(){
        let legalPlane = matrix(this.foot).and(matrix(this.validGrid)) ; 
        this.displayCells(legalPlane, 1, 'black');
    }

//    displayValidFoot(){
//        //todo display valid cell inside the parcel polygon
//        if(this.foot == undefined){
//            this.toBinaryFootprint();
//        }
//        for (let col in [...new Array(this.cols).keys()]){
//            for(let row in [...new Array(this.rows).keys()]){
//                if(this.foot === 1){
//                    this.displayCell(col, row, 'rgb(255,20,20,0.2');
//                }
//        }}
//
//    }

    validFootprint(vertices){
        console.log('this.foot', this.foot);
        console.log('this.validGrid', this.validGrid);
        let validCount = matrixValCount(matrix(this.foot).and(matrix(this.validGrid)), 1) ; 
        let validArea = validCount * this.size*this.size;
        console.log('validArea',  validArea);
        let area2 = this.parcelArea(vertices).area;
        let area = this.parcelArea(vertices).area;
        console.log('polygon area', area, area2)
        console.log('floorAreaRatio ',  floorAreaRatio(area, validArea));
    }


    toBinaryFootprint() {
//        if(this.foot == undefined){
//            this.foot = this.to2DArray();
            for (let col = 0; col < this.grid.length; col++) {
                for (let row = 0; row < this.grid[col].length; row++) {
                    this.setFootprintMatrix(col, row);
                }
            }
//        }
    }

    setFootprintMatrix(col, row) {
        if (this.grid[col][row] == undefined) {
            this.foot[col][row] = 0;
        }
        else {
            this.foot[col][row] = 1;
        }
    }

    onCreateFloor(){
        let legalPlane = matrix(this.foot).and(matrix(this.validGrid)) ; 
        this.displayCells(legalPlane, 1, 'black');
    }

    onPopulate(){
        for(let i=0; i<params.numIndividuals; i++){
            console.log('i', i );
            this.onStartFootPrint();
        }
    }

//    matrixValCount(mat, val){
//        let sum = 0;
//        for (let col = 0; col < mat.length; col++) {
//            for (let row = 0; row < mat.length; row++) {
//               const element = mat[col][row];
//               if (element === val){
//                    sum+=1;
//                }
//            }
//        }
//        return sum;
//    }
    
}

