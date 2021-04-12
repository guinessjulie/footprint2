import {floorAreaRatio} from "./gaParams.js";
import Cell from './cell2.js'
import {matrixValCount} from './ga/fitness.js'
import {geneToColor, matrixPerimeter, to2DArray} from './utils.js'
import matrix from './libs/matrix-js/lib/index.js'
import {grid, parcel} from "./ProcessParcel.js";
import {qry} from "./alias.js";
import {CELL_SIZE} from "./global.js";

export default class Footprint {

    constructor(gene, id) {
        this.gene = gene;
        this.id = id;
        this.activeCell = 0;
        this.attr = {
            area: 0,
            faRatio: 0,
            boundaryLength : 0
        }
        this.matFootprint = to2DArray(grid.cols, grid.rows);
        this.validFootprintMatrix = this.buildFootprint();
        this.calcLandAttributes();
        this.displayDomInfo();
    //    this.displayPreview(); //todo handle later
    }
    displayDomInfo(){
        let outIndividual = document.querySelector('#out-individual');
        let outFaRatio = document.querySelector('#out-faRatio');
        let outBoundaryLength = document.querySelector('#out-boundary-length');
        let outParcelArea = qry('#out-parcel-area');
        outIndividual.value = this.id;
        outFaRatio.value = this.attr.faRatio + "%";
        outBoundaryLength.value = this.attr.boundaryLength;
        outParcelArea.value = parcel.area;
    }


    displayPreview() {
        parcel.draw();
    }

    initNewFootprint() {
        this.activeCell = 0;
        grid.initializeFootprint();
    }
    //matFootprint matrix is set from grid.arr2d
    //so when footprint evaluation is over grid.arr2d and this.matFootprint, grid.matCellInside should all initialized
    // and  canvas also cleared
    // this.checkMatriies() //for debug
    buildFootprint() {
        this.initNewFootprint() //initialize grid.arr2d foot nitro 
        let cur = new Cell(Math.floor(grid.cols / 2), Math.floor(grid.rows / 2), this.gene.dna[0]);//temp doing
        //let cur = new Cell(1,1, this.dna.gene[0]);//temp doing
        if (cur === undefined) return false;
        this.activeCell += 1;
        //let curnitro = cur.nitrobasis;
        grid.arr2d[cur.col][cur.row] = cur; //active grid cell에 cell 정보 할당.
        for (let i = 0; i < this.gene.genLen; i++) { //setFootprintMatrixPrint from grid2.js
            let next = this.setNextCellActive(cur, i);
            if (next) {
                this.activeCell += 1;
                cur = next;
            } else break;
        } //Cell object Allocated into the grid.arr2d, and grid.arr2d is depend on dna
        for (let row in [...new Array(grid.rows).keys()]) {
            for (let col in [...new Array(grid.cols).keys()]) {
                if (grid.arr2d[col][row] === undefined) {
                    this.matFootprint[col][row] = 0;
                }
                else {
                    this.matFootprint[col][row] = 1;
                }
            }
        }
        let validFootprintMatrix = matrix(this.matFootprint).and(matrix(grid.matCellInside));
        return validFootprintMatrix;
    }
    displayFoot(validFootprintMatrix){
        grid.displayCells(grid.matCellInside, 1, "white");
        grid.displayCells(validFootprintMatrix, 1, "black")//doing
    }
    calcLandAttributes(){
        let validCellCount = matrixValCount(matrix(this.matFootprint).and(matrix(grid.matCellInside)), 1) ;
        this.attr.area = validCellCount * CELL_SIZE * CELL_SIZE;
        this.attr.faRatio = Math.round((floorAreaRatio(parcel.area, this.attr.area) + Number.EPSILON)* 10000)/100;
        this.attr.boundaryLength = matrixPerimeter(this.validFootprintMatrix) * CELL_SIZE;
    }


    //todo 주어진 1/0 array 에서 1만 출력
    //doing move to grid class for accessing from footprints and footprint both
    displayCells(arr, id=1, color='red'){
        for (let col in [...new Array(grid.cols).keys()]){
            for(let row in [...new Array(grid.rows).keys()]){
                if(arr[col][row] === id){
                    grid.displayCell(col, row, color);
                }
            }}

    }

    setNextCellActive(cell, iter) {
        let col = +cell.col;
        let row = +cell.row;
        const arr2d = (col, row) => grid.arr2d[col][row]
        switch (cell.nitrobasis) {
            case '00' : //East
                //col = col === this.cols - 1 ? col : col + 1; //doing : when col is right-most, stay in there
                col = col === grid.cols - 1 ? col : col+1;
                while (arr2d(col, row) && col < grid.cols - 1) { //if grid.arr2d[col][row] aleady exists and not hit the wall, go to one cell more east direction
                    col += 1;
                }
                break;
            case '10' : //West
                col = col === 0 ? col : col - 1;
                while (arr2d(col, row) && col > 0) {
                    col -= 1;
                }
                break;
            case '01' : //South
                row = row !== grid.rows -1 ? row : row + 1; // goto 1 step South if not wall 
                while (arr2d(col, row) && row < grid.rows - 1) {
                    row += 1;
                }
                break;
            case '11' : //North
                row = row === 0 ? row : row - 1;
                while (arr2d(col, row) && row > 0) {
                    row -= 1;
                }
                break;
            default:
                break;
        }

        let next = new Cell(col, row, this.gene.dna[iter + 1]);
        grid.arr2d[col][row] = next;
        return next;
    }

    // setNextCellActive_save(cell, iter) {
    //     let col = +cell.col;
    //     let row = +cell.row;
    //     const arr2d = (col, row) => grid.arr2d[col][row]
    //     const findEmptyCell = (cell) =>{
    //         switch(cell.nitrobasis){
    //             case '00': //-->when it hits East side, put it in the West side.
    //                 do {
    //                     col = col -1;
    //                 } while(grid.arr2d[col][row])
    //                 break;
    //             case '10': //<--West it hits West side, put it in the East side.
    //                 do{
    //                     col = col + 1;
    //                 } while(grid.arr2d[col][row])
    //                 break;
    //             case '11' : // when hit up wall, put it i the lower side
    //                 do {
    //                     row = row -1;
    //                 } while(grid.arr2d[col][row]) //until no array is exists
    //                 break;
    //             case '01': //south when it hits south wall go up until it meets empty cell
    //                 do { 
    //                     row = row + 1;
    //                 } while(grid.arr2d[col][row])
    //                 break;
    //             default:
    //                 break;
    //         }
    //         return col;
    //     }
    //     switch (cell.nitrobasis) {
    //         case '00' : //East
    //             //col = col === this.cols - 1 ? col : col + 1; //doing : when col is right-most, stay in there
    //             if(col === grid.cols -1){
    //                 findEmptyCell(cell) //if it is not the last column stay there, otherwise findEmptyCell
    //             } else{
    //                 col = col === grid.cols - 1 ? col : col+1;
    //                 while (arr2d(col, row) && col < grid.cols - 1) { //if grid.arr2d[col][row] aleady exists and not hit the wall, go to one cell more east direction
    //                     col += 1;
    //                 }
    //             }
    //             break;
    //         case '10' : //West
    //             if(col === 0) {
    //                 findEmptyCell(cell)
    //             }else{
    //                 col = col === 0 ? col : col - 1;
    //                 while (arr2d(col, row) && col > 0) {
    //                     col -= 1;
    //                 }
    //             }
    //             break;
    //         case '01' : //South
    //             row = row !== grid.rows -1 ? row : row + 1; // goto 1 step South if not wall 
    //             while (arr2d(col, row) && row < grid.rows - 1) {
    //                 row += 1;
    //             }
    //             row = row !== grid.rows ? row : findEmptyCell(cell)
    //             break;
    //         case '11' : //North
    //             row = row === 0 ? row : row - 1;
    //             while (arr2d(col, row) && row > 0) {
    //                 row -= 1;
    //             }
    //             row = row !== 0 ? row : findEmptyCell(cell);
    //             break;
    //         default:
    //             break;
    //     }

    //     let next = new Cell(col, row, this.dna.gene[iter + 1]);
    //     grid.arr2d[col][row] = next;
    //     return next;
    // }

    // parallelbuildFootPrint() {
    //     for (const dna of this.dnas) {
    //         let parcelFootprintMatrix = buildFootPrint(dna);
    //         this.candidateFootprint.push(parcelFootprintMatrix);
    //     }
    // }

    //todo 주어진 1/0 array 에서 1만 출력
    // parcelValidateFootprint() {
    //     if (matrixValCount(this.grid.foot, 1) === 0
    //         || matrixValCount(this.grid.validGrid === 0)) {
    //         let area = calcParcelArea(this.parcel.vertices)
    //     }
    //     this.parcel.draw();
    //     this.grid.onPreview(this.parcel.vertices);
    //
    // }
    // displayValidCell() {
    //     // for (let col in [...new Array(this.cols).keys()]){
    //     //     for(let row in [...new Array(this.rows).keys()]){
    //     //         if(this.validGrid[col][row] === 0){
    //     //             this.displayCell(col, row, 'rgb(20,20,20,0.2');
    //     //         }
    //     // }}
    //     this.displayCells(this.matCellInside, 0, 'rgb(20, 20, 20, 0.2')
    //     this.validFootprint(vertices)
    // }

}