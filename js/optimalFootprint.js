import {parcel} from "./ProcessParcel.js";
import {drawOnCanvas, displayCell} from "./utils.js";
import {CELL_SIZE} from "./global.js";
import Grid from "./grid2.js";
export default class OptimalFootprint{
    constructor(footMat){
        this.canvas = document.getElementById('canvas-generation');
        this.ctx = this.canvas.getContext("2d");
        drawOnCanvas('canvas-generation', parcel.vertices, "#35e664");
        this.displayGridCells(footMat);
    }
    displayGridCells(footMat){
        let color = 'red';
        // let grid = onGrid('canvas-generation') //this causes the grid.validFootprint matrix display all gone, need to seperate them
        let grid2 = new Grid('canvas-generation', parcel.bbox.min, parcel.bbox.max, CELL_SIZE) //constructor 자체에서initDisplayGrid를 호출한다. 이 떄문에 원본이 초기화되어 안보이게 되는 것이다. 이것을 픽스하려면 grid2를 대대적으로 손보던가 여기 클래스에서 필요한 부분만duplicate하ㅣ던가 해야한다.
        for (let col in [...new Array(grid2.cols).keys()]){
            for(let row in [...new Array(grid2.rows).keys()]){
                if(footMat[col][row] == 1){
                    displayCell('canvas-generation', col, row, parcel.bbox.min, color);
                }
            }
        }
    }
}