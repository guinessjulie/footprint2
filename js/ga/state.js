import { cell } from '../cell.js'
import { grid } from '../parcel.js'
export function  nextState(grid, cell){
        let col = +cell.col;
        let row = +cell.row;
        let next;
        const grid = (col, row)=> grid[col][row];
        switch(cell.geno){
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

        next = new Cell(col, row);
        grid[col][row] = next;
        return next;
    }
