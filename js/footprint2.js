import {floorAreaRatio} from "./gaParams.js";
import Cell from './cell2.js'
import {matrixValCount} from './ga/fitness.js'
import {geneToColor, matrixPerimeter, to2DArray} from './utils.js'
import matrix from './libs/matrix-js/lib/index.js'
import {grid, parcel} from "./ProcessParcel.js";
import {qry} from "./alias.js";
import {CELL_SIZE} from "./global.js";
//original

export default class Footprint {

    constructor(dna, id) {
        this.dna = dna;
        this.id = id;
        this.activeCell = 0;
        this.fitness = {
            area: 0,
            faRatio: 0,
            boundaryLength : 0
        }
        this.matFootprint = to2DArray(grid.cols, grid.rows);
        this.validFootprintMatrix = this.buildFootprint();
        this.calculateFitness();
        this.displayDomInfo();
    //    this.displayPreview(); //todo handle later
    }
    displayDomInfo(){
        let outIndividual = document.querySelector('#out-individual');
        let outFaRatio = document.querySelector('#out-faRatio');
        let outBoundaryLength = document.querySelector('#out-boundary-length');
        let outParcelArea = qry('#out-parcel-area');
        outIndividual.value = this.id;
        outFaRatio.value = this.fitness.faRatio + "%";
        outBoundaryLength.value = this.fitness.boundaryLength;
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
        this.initNewFootprint()
        let cur = new Cell(Math.floor(grid.cols / 2), Math.floor(grid.rows / 2));
        if (cur === undefined) return false;
        this.activeCell += 1;
        //let curnitro = cur.nitrobasis;
        grid.arr2d[cur.col][cur.row] = cur; //active grid cell에 cell 정보 할당.
        grid.clearGrid();
        //grid.displayCell(cur.col, cur.row, geneToColor(cur.nitrobasis)); //todo  whattodo displayCell 을 따로 빼? remove
        for (let i = 0; i < this.dna.dnaLen; i++) { //setFootprintMatrixPrint from grid2.js
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
        this.displayCells(grid.matCellInside, 0, 'rgb(120,120,160,0.2)');
        grid.initDisplayGrid();
        let validFootprintMatrix = matrix(this.matFootprint).and(matrix(grid.matCellInside));
        this.displayCells(validFootprintMatrix, 1, "black")
        return validFootprintMatrix;
    }
    calculateFitness(){
        let validCellCount = matrixValCount(matrix(this.matFootprint).and(matrix(grid.matCellInside)), 1) ;
        this.fitness.area = validCellCount * CELL_SIZE * CELL_SIZE;
        this.fitness.faRatio = Math.round((floorAreaRatio(parcel.area, this.fitness.area) + Number.EPSILON)* 10000)/100;
        this.fitness.boundaryLength = matrixPerimeter(this.validFootprintMatrix) * 30;
    }


    //todo 주어진 1/0 array 에서 1만 출력
    displayCells(arr, id=1, color='red'){
        for (let col in [...new Array(grid.cols).keys()]){
            for(let row in [...new Array(grid.rows).keys()]){
                if(arr[col][row] === id){
                    grid.displayCell(col, row, color);
                }
            }}

    }

    checkMatriies(){
        console.log('matFootprint', this.matFootprint);
        console.log('matCellInside', grid.matCellInside);
    }

    //decide next cell and fill the ogject in [col, row] the grid
    setNextCellActive(cell, iter) {
        let col = +cell.col;
        let row = +cell.row;
        let next;
        const arr2d = (col, row) => grid.arr2d[col][row];
        switch (cell.nitrobasis) {
            case '00' : //East
                col = col === this.cols - 1 ? col : col + 1;
                while (arr2d(col, row) && col < this.cols - 1) {
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
                row = row === this.rows - 1 ? row : row + 1;
                while (arr2d(col, row) && row < this.rows - 1) {
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

        next = new Cell(col, row, this.dna.gene[iter + 1]);
        grid.arr2d[col][row] = next;
        return next;
    }


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