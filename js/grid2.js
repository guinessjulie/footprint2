//import Cell from './cell.js'
import Cell from './cell2.js'
import {geneToColor, to2DArray} from './utils.js'
import Vec2 from './Vec2.js';
import matrix from './libs/matrix-js/lib/index.js'
import {calcDnaLength, floorAreaRatio} from './gaParams.js'
import {permitFaRatio} from './global.js';
import {matrixValCount} from './ga/fitness.js';
import DNA from './ga/dna.js'
import {parcel} from './ProcessParcel.js'

//import { getParcel } from './Parcel.js'
export default class Grid{
    constructor(canvasId, min, max, CELL_SIZE){
        this.canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.size = CELL_SIZE;
        this.min = min;
        this.max = max;   
        this.cols = Math.floor((max.x - min.x) / this.size);
        this.rows = Math.floor((max.y - min.y) / this.size);
        //this.arr2d = this.to2DArray(this.rows, this.cols );
        //this.validGrid = this.to2DArray(this.rows, this.cols);
        this.arr2d = to2DArray(this.cols, this.rows );
        //this.validGrid = to2DArray(this.cols, this.rows); //did rename to matCellInside
        this.matCellInside = to2DArray(this.cols, this.rows);
        this.getCellInsideParcel();
        //this.initDisplayGrid(this.size);
        this.nitro = ''
        this.activeCell = 0; //todo this.activeCell은 매번 +1로 할당 validCellCount로 쓸 수 있을 거 같다. 
        this.foot = to2DArray(this.cols, this.rows);
    }
    //only depends on grid and parcel;
    //once set it needs not change regardless the dna
    //setValidGrid(col, row, poly){

    getCellInsideParcel() {
        for(let row in [...new Array(this.rows).keys()]){
            for (let col in [...new Array(this.cols).keys()]){
                let loc = {col, row};
                let arrPt = this.getCellCorners(loc);
                this.setMatCellInside(col, row)
            }
        }
    }

    setMatCellInside(col, row) {
        let loc = {col, row};
        let arrPt = this.getCellCorners(loc);
        this.matCellInside[col][row] = arrPt.filter(pt => parcel.poly.ptInPolygon(pt)).length == 4 ? 1 : 0;
        /* for validFootprint
        if (this.arr2d[col][row] == undefined) {
            this.matFoot[col][row] = 0;
        }
        else {
            this.matFoot[col][row] = 1;
        }*/
    }


    cleanupGrid(){

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
        let x = this.translate(loc).x; //this.min.x+col*size;
        let y = this.translate(loc).y; //this.min.y+row*size;
        let w = this.translate(loc).w;
        return { x, y, w };
    }

    translate(loc){
        return{
            x: this.min.x + loc.col*this.size,
            y: this.min.y + loc.row* this.size,
            w : this.size - 3

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
        this.arr2d[col][row] = cell;
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
        const grid = (col, row)=>this.arr2d[col][row];
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
//        this.arr2d[col][row] = next;
//        return next;
//        }

    }
    //in this step, nitro for iter number of code is completed. now we have this.nitro which is a individual
    setFootprintMatrixPrint(cur,iter, dna){
   
        for (let i = 0; i < iter; i++) {
            let next = this.nextState(cur,i, dna);
            console.log('next[', i+1,']', this.arr2d[next.col][next.row]);
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
        let dna = new DNA(dnaLen, [this.arr2d.col], [this.arr2d.row]);
        return dna;
    }
    onStartFootPrint(){
        //this.initCell(iter);
        //let parcelArea = parcel.area;
        //let dnaSize = dnaLength(parcelArea, permitFaRatio)
        //let col = this.arr2d.col;
        //let row = this.arr2d.row;
        //let dna = new DNA(dnaSize, [col, row])
        let dnaLen = calcDnaLength(parcel.area, permitFaRatio);
        let dna = this.createDNA(dnaLen);
        let cur = new Cell(Math.floor(this.cols/2), Math.floor(this.rows/2), dna.gene[0]);
        if(!cur) return false;
        this.activeCell +=1;
        this.nitro += cur.nitrobasis; //todo to move Individual
        //cur.occupied = true; //deleted for refactoring
        //this.footprint.push([cur.col, cur.row]); //refactor
        this.arr2d[cur.col][cur.row] = cur;
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
        let x = this.translate(loc).x
        let y = this.translate(loc).y;
        let w = this.translate(loc).w;
        this.ctx.translate(x, y);
        this.ctx.fillRect(0, 0, w, w);
        this.ctx.restore();
    }


    nextState(cell, iter, dna){
        let col = +cell.col;
        let row = +cell.row;
        let next;
        const grid = (col, row)=>this.arr2d[col][row];
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
        this.arr2d[col][row] = next;
        return next;
    }
    //menu > validate >
    onValidateCell(vertices){
        let size = this.size;
        let {area, poly} = this.parcelArea(vertices);
        console.log('polygon area :',  area)
        for(let row in [...new Array(this.rows).keys()]){
            for (let col in [...new Array(this.cols).keys()]){
                //let loc = {col, row, size}; //size = CELL_SIZE
                //let arrPt = [];
                //let { pt1, pt2, pt3, pt4 } = this.getCellCorners(loc, size);
                //arrPt.push(pt1, pt2, pt3, pt4);
                //this.setValidGrid(col, row, arrPt, poly);
                //this.setValidGrid(col, row, poly);
                this.setMatCellInside(col, row)
        }}
        this.displayValidCell(vertices);
        
        //todo move to costfunction
        //let validCount = this.matrixValCount(matrix(this.foot).and(matrix(this.validGrid)), 1) ; 
        //let validArea = validCount * this.size*this.size;
        //console.log('validCount', validCount,'validArea', validArea);
        //console.log('floorAreaRatio', floorAreaRatio(area, validArea))

//
    }


    //build grid.matInsideParcel
    setValidGrid_org(col, row, arrPt, poly) {
        this.matCellInside[col][row] = arrPt.filter(pt => poly.ptInPolygon(pt)).length == 4 ? 1 : 0;
    }

    getCellCorners(loc) {
        let pt1 = new Vec2(this.translate(loc).x, this.translate(loc).y);
        let pt2 = new Vec2(this.translate(loc).x, this.translate(loc).y + this.size);
        let pt3 = new Vec2(this.translate(loc).x + this.size, this.translate(loc).y + this.size);
        let pt4 = new Vec2(this.translate(loc).x + this.size, this.translate(loc).y);
        return [ pt1, pt2, pt3, pt4 ];
    }

    displayValidCell(vertices){
        // for (let col in [...new Array(this.cols).keys()]){
        //     for(let row in [...new Array(this.rows).keys()]){
        //         if(this.validGrid[col][row] === 0){
        //             this.displayCell(col, row, 'rgb(20,20,20,0.2');
        //         }
        // }}
        this.displayCells(this.matCellInside, 0, 'rgb(155, 155, 220, 0.2')
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
        let footprintMatrix = matrix(this.matFoot).and(matrix(this.matCellInside)) ;
        this.displayCells(footprintMatrix, 1, 'black');
        return footprintMatrix;
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
        console.log('this.foot', this.matFoot);
        console.log('this.validGrid', this.matCellInside);
        let validCount = matrixValCount(matrix(this.matFoot).and(matrix(this.matCellInside)), 1) ;
        let validArea = validCount * this.size*this.size;
        console.log('validArea',  validArea);
        let area = this.parcelArea(vertices).area;
        //let area = this.parcelArea(vertices).area;
        console.log('floorAreaRatio ',  floorAreaRatio(area, validArea));
    }


    toBinaryFootprint() {
//        if(this.foot == undefined){
//            this.foot = this.to2DArray();
            for (let col = 0; col < this.arr2d.length; col++) {
                for (let row = 0; row < this.arr2d[col].length; row++) {
                    this.setMatCellInside(col, row);
                }
            }
//        }
    }

    onCreateFloor(){
        let legalPlane = matrix(this.matFoot).and(matrix(this.matCellInside)) ;
        this.displayCells(legalPlane, 1, 'black');
    }


//    matrixValCount(mat, val){
//        let sum = 0;
//        for (let col = 0; col < mat.length; col++) {
//            for (let row = 0; row < mat.length; row++) {
//               const element = mat[col][row];
//               if (element === val){
//                    sum+=1;

//            }
//        }
//        return sum;
//    }
    
}

