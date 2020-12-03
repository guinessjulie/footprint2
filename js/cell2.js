export const mapGeno = { '00': 'e', '01':'s', '10':'w', '11':'n'};
import {rand} from './utils.js'
export default class Cell{
    constructor(col=undefined, row=undefined, nitrobasis, color='#444', ){ //col, row is always defined before instanciated
        this.col = col;
        this.row = row;
        this.nitrobasis = nitrobasis;
        this.valid= this.validation();
    }  
    validation(){
        return true;
    }

}