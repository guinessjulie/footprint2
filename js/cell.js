 export const mapGeno = { '00': 'e', '01':'s', '10':'w', '11':'n'};
import {rand} from './utils.js'
export default class Cell{
    constructor(col=undefined, row=undefined, color='#444'){ //col, row is always defined before instanciated
        this.col = col;
        this.row = row;
        this.geno = Math.floor(Math.random()*4).toString(2).padStart(2,'0');
        this.occupied=false;
        this.valid= this.validation();
    }  
    validation(){
        return true;
    }

}