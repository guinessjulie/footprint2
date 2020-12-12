export default class DNA {
    constructor(numIndividual, gridSize, dnaLen) { //gridSize = [cols, rows]
        this.dnaLen = dnaLen;
        this.gene = this.populate()
        this.startPos = {col: Math.floor(gridSize.cols / 2), row: Math.floor(gridSize.rows / 2)}
    }

    populate() {
        let nitro = [];
        for (let i = 0; i < this.dnaLen; i++) {
            nitro.push(Math.floor(Math.random() * 4).toString(2).padStart(2, '0'));
        }
        console.log('nitro', nitro);
        return nitro;
    }
}