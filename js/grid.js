export default class Grid{
    constructor(min, max, size){
        this.size = size;
        this.min = min;
        this.max = max;   
        this.cols = Math.floor((max.y - min.y) / size);
        this.rows = Math.floor((max.x - min.x) / size);
    }

    set gridSize(newSize) {
        if(this.size){
            this.newSize
        }
    } 

    get gridSize(){
        return this.size;
    }

    to2DArray(){
        console.log(this.cols, this.rows)
        let arr = new Array(this.cols);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(this.rows);
        }
        return arr;
    }

    createGrid(){
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let footprint = this.to2DArray(this.cols, this.rows)
        let size = this.size;
        for (let col in [...new Array(this.cols).keys()]){
            for(let row in [...new Array(this.rows).keys()]){
                //footprint[col][row] = Math.random()*255;
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'lightblue';
                console.log(col, row, size)
                ctx.strokeRect(row*size, col*size, size, size);
            }
        }

        //todo paint object 가 있나 확인 거기서  ctx 를 가져와야 한다.

        
    }
}