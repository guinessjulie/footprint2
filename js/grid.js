import {mapGeno} from './cell.js'
import Cell from './cell.js'
import {rand, geneToColor} from './utils.js'

export default class Grid{
    constructor(min, max, size){
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.min = min;
        this.max = max;   
        this.cols = Math.floor((max.x - min.x) / size);
        this.rows = Math.floor((max.y - min.y) / size);
        this.grid = this.to2DArray(this.rows, this.cols )
        //this.initDisplayGrid(size);
        this.initDisplayGrid(size);
        this.chromosome = ''
    }
    to2DArray(){
        let arr = new Array(this.cols);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(this.rows-1);
        }
        return arr;
    }
    initDisplayGrid(size){
        
        for (let col in [...new Array(this.cols).keys()]){
            for(let row in [...new Array(this.rows).keys()]){;
                this.ctx.save()
                this.ctx.fillStyle = '#cef'
                this.ctx.strokeStyle = '#333';
                let loc = {col, row, size};
                let x = this.tr(loc).x ;//this.min.x+col*size;
                let y = this.tr(loc).y ;//this.min.y+row*size;
                let w = this.tr(loc).w;
                this.ctx.translate(x, y)
                this.ctx.fillRect(0, 0, w, w);
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(0, 0, w, w);
                this.ctx.font = '9px mono';
                let num = col.toString() + ' '+row.toString();
                this.ctx.strokeText(num, 3, (size/2) )
                this.ctx.restore()
            }
        }   
    }
    

    tr(loc){
        return{
            x: this.min.x + loc.col*loc.size,
            y: this.min.y + loc.row*loc.size,
            w : loc.size - 3

        }
    }
    startFootPrint(iter){
        this.initCell(iter);
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

    initCell(iter){
        let cur = new Cell(Math.floor(this.cols/2), Math.floor(this.rows/2));
        this.chromosome += cur.geno;
        cur.occupied = true;
        this.grid[cur.col][cur.row] = cur;
        this.displayCell(cur.col, cur.row, geneToColor(cur.geno));
        this.createFootPrint(cur,iter);
  //      this.createFootprintTest(cur);
    }

    nextState(cell){
        let col = +cell.col;
        let row = +cell.row;
        let next;
        const grid = (col, row)=>this.grid[col][row];
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
        this.grid[col][row] = next;
        return next;
    }

    createFootPrint(cur,iter){
        console.log('iter',iter)
        for (let i = 0; i < iter; i++) {
            console.log('i', i, 'chromosome', this.chromosome);     
            let next = this.nextState(cur)
            console.log('next cell' ,this.grid[next.col][next.row])
            this.chromosome += ' '+ cur.geno;
            if(next) {
                next.occupied=true;
                this.displayCell(next.col, next.row, geneToColor(next.geno));
                console.log('next grid', this.grid[next.col][next.row]);
                cur = next; 
            }
            else break;    
            
        }
    }


}

