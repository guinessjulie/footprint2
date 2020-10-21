export default class Fill{
    constructor(canvas, x, y, color){
        this.ctx = canvas.getContext('2d');
        this.imageData = this.ctx.getImageData(0,0, canvas.width , canvas.height);
        console.log('color', color);
        const targetColor = this.getPixel(x, y);
        console.log('targetColor', targetColor  );

    }
    
    floodFill(point, targetColor, fillColor){

    }
    getPixel(x, y){
        console.log('x', x , ', y', y );
        const h = this.imageData.height;
        if( x < 0 || y <0 || x >= this.imageData.width || y >= this.imageData.height){
            return [-1, -1, -1, -1];            
        } else{
            const offset = (y * this.imageData.width + x) * 4;
            return [
                this.imageData.data[offset + 0],
                this.imageData.data[offset + 1],
                this.imageData.data[offset + 2],
                this.imageData.data[offset + 3]                
            ]
        }
    }
}