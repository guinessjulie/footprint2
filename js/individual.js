import ??? from ???  //calcFitness
export default class Individual{
    constructor(dna){
        this.dna = dna;
        this.fitness = calcFitness(dna);
    }
}