import { randInt } from "../utils.js";
export default class Gene {
  constructor(gridSize, genLen) {
    //gridSize = [cols, rows]
    this.genLen = genLen;
    this.gridSize = gridSize;
    //this.gene = this.populate()
    this.dna = [];
    this.startPos = {
      col: Math.floor(gridSize.cols / 2),
      row: Math.floor(gridSize.rows / 2),
    };
    this.gridColMax = gridSize.cols;
    this.gridRowMax = gridSize.rows;
    //this.populateGene();
    // console.log(`constructor before popuateGene: this.dna`, this.dna);
    this.populateGene();
    // console.log(`constructor after populateGene : this.dna`, this.dna);
  }
  static crossoverDNA(dnaA, dnaB) {
    let newDNA = [];
    let splitPoint = Math.floor(
      Math.random() * (Math.min(dnaA.length, dnaB.length) - 1) + 1
    );
    console.log(`splitPoint`, splitPoint);
    for (let i = 0; i < splitPoint; i++) {
      newDNA.push(dnaA[i]);
    }
    for (let j = splitPoint; j < dnaB.length; j++) {
      newDNA.push(dnaB[j]);
    }
    //this.printCrossoverDebugA(dnaA, dnaB, splitPoint);
    // this.printCrossoverDebugB(dnaB, splitPoint);
    return newDNA;
  }

  static createNewCrossoverGene(geneA, geneB) {
    let newGene = new Gene(this.gridSize, geneA.dna.length);
    let newDNA = [];
    let splitPoint = Math.floor(
      Math.random() * (Math.min(geneA.dna.length, geneB.dna.length) - 1) + 1
    );
    for (let i = 0; i < splitPoint; i++) {
      newDNA.push(geneA.dna[i]);
    }

    for (let j = splitPoint; j < geneB.dna.length; j++) {
      newDNA.push(geneB.dna[j]);
    }
    newGene.dna = newDNA;
    return newGene;
  }
  crossover(partner) {
    let childGene = [];
    let midPoint = Math.floor(partner.genLen / 2);

    for (let i = 0; i < midPoint; i++) {
      childGene.push(this.dna[i]); //가운데지점까지 자기자신의 진으로 채운다
    }
    for (let j = midPoint; j < this.genLen; j++) {
      childGene.push(partner.dna[j]);
    }
    this.dna = childGene;

    return this;
  }
  static mutate(dna, mutRate) {
    console.log(`mutate(dna): dna`, dna);
    let mutDNA = [];
    const possibleCodeSet = ["00", "01", "10", "11"];
    if (Math.random() < mutRate) {
      // console.log(`mutating`);
      let mutPos = Math.floor(Math.random() * dna.length);
      mutDNA = dna.map((codon, idx) => {
        // console.log(`codon, idx, mutPos`, codon, idx, mutPos);
        if (idx === mutPos) {
          let newCodon = "";
          let n = randInt(possibleCodeSet.length);
          newCodon = possibleCodeSet[n];
          // console.log(idx + `th code: `, possibleCodeSet[n]);
          if (newCodon === codon) {
            newCodon = possibleCodeSet[n % possibleCodeSet.length];
          }
          // console.log(`After Mutating`, newCodon);
          return newCodon;
        } else return codon;
      });
    } else {
      mutDNA = [...dna];
      // console.log(`not mutated`);
    }
    console.log(`mutDNA`, mutDNA);
    return mutDNA;
  }

  crossoverRandomPoint(partner) {
    let childDNA = [];
    // let startPos = {
    //   col: Math.random() * this.gridSize.cols,
    //   row: Math.random() * this.gridSize.rows,
    // };
    let splitPoint = Math.floor(Math.random() * (this.genLen - 1) + 1);
    console.log(`splitPoint`, splitPoint);
    // console.log(
    //   `this.dna, parner.dna, splitPoint`,
    //   this.dna,
    //   partner.dna,
    //   splitPoint
    // );
    for (let i = 0; i < splitPoint; i++) {
      childDNA.push(this.dna[i]);
    }
    for (let j = splitPoint; j < this.genLen; j++) {
      childDNA.push(partner.dna[j]);
    }
    this.dna = childDNA;
    // this.startPos = startPos;
    return this;
  }

  populateGene() {
    let newCode = Math.floor(Math.random() * 4)
      .toString(2)
      .padStart(2, "0");
    let possibleCodeSet = [];
    const initCodeSet = () => {
      possibleCodeSet = ["00", "01", "10", "11"];
    };
    const removeItem = (array, item) => {
      let index = array.indexOf(item);
      if (index !== -1) {
        array.splice(index, 1);
      }
    };
    const checkHitWall = (curCol, curRow) => {
      if (curCol === 0) {
        removeItem(possibleCodeSet, "10"); //cannot go further to left
      } else if (curCol === this.gridSize.cols - 1) {
        //hit the right wall
        removeItem(possibleCodeSet, "00");
      }
      if (curRow === 0) {
        removeItem(possibleCodeSet, "11");
      } else if (curRow === this.gridSize.rows - 1) {
        removeItem(possibleCodeSet, "01");
      }
    };
    let curCol = this.startPos.col;
    let curRow = this.startPos.row;
    initCodeSet();
    // for (let i = 1; i < this.genLen; i++) { //to test : to fix shrinking every generation gene size
    for (let i = 0; i < this.genLen; i++) {
      if (this.dna.length === 0) {
        this.dna.push(newCode); //first code
      } else {
        let prevCode = this.dna.slice(-1).toString();
        switch (prevCode) {
          case "00":
            removeItem(possibleCodeSet, "10");
            curCol++;
            break;
          case "10":
            removeItem(possibleCodeSet, "00");
            curCol--;
            break;
          case "01":
            removeItem(possibleCodeSet, "11");
            curRow++;
            break;
          case "11":
            removeItem(possibleCodeSet, "01");
            curRow--;
            break;
          default:
            "";
            break;
        }
        checkHitWall(curCol, curRow); //after this if possibleCodeSet remains something it goes only that direction. if it does not contain anything at all no where to go
        let n = randInt(possibleCodeSet.length);
        // if(possibleCodeSet.includes('01')){
        //     this.dna.push('01');
        // } else{
        //     this.dna.push(possibleCodeSet[n]);
        // }
        this.dna.push(possibleCodeSet[n]);
        initCodeSet();
        //console.log(this.dna);
      }
    }
    //const pickCode = possibleCodeSet[randInt(possibleCodeSet.length)];
    //console.log(`populateGene in dan.js this.dna`, this.dna);
  }
  //     populateGene(){
  //         //const curCol =  (locGene) =>{//dna's current col, row location
  //         let col = this.startPos.col;
  //         let ruleOutNext = ''
  //         let edgeCol = [0, this.startPos.col-1]
  //         let edgeRow = [0, this.startPos.row-1]
  //         let ruleOut =[]//00=>10, 10=>00 01=>11 11=>01 this sequence goes back to original position. ruled out
  //         //first nitro doesn need to have rule out anything
  // //        this.dna.push(Math.floor(Math.random() * 4).toString(2).padStart(2, '0')); //doing
  // //test
  //         this.dna.push('10')

  //         let nextNitro;
  //         for (let i = 1; i < this.genLen; i++) {
  //             switch(this.dna[i-1] ){
  //                 case '00':
  //                     ruleOutNext = '10';
  //                     break;
  //                 case '10':
  //                     ruleOutNext = '00'
  //                     break;
  //                 case '01':
  //                     ruleOutNext = '11'
  //                     break;
  //                 case '11':
  //                     ruleOutNext = '01'
  //                     break;
  //                 default:
  //                     ''
  //                     break;
  //             }
  //             console.log('this.dna', this.dna );
  //             let curCol= this.dna.filter(code => (code === "00" || code === "10"))
  //                                    .reduce((col, code)=>{
  //                                         if (code === "00") {
  //                                            col += 1
  //                                         }else if (code === "10"){
  //                                             col -=1
  //                                         }
  //                                         return col;
  //                                     }
  //                                     , this.startPos.col);
  //             let curRow = this.dna.filter(code => (code === "11" || code === "01"))
  //             .reduce((row, code)=>{
  //                     if (code === "11") {
  //                         row -= 1
  //                     }else if (code === "01"){
  //                         row +=1
  //                     }
  //                     return row;
  //                 }
  //                 , this.startPos.row);

  //             console.log('curCol', curCol , ', curRow', curRow );
  //             switch(curCol){ //end of the column wall, cannot go further that direction
  //                 case 0:
  //                     ruleOut.push('10');
  //                     break;
  //                 case this.gridColMax -1 :
  //                     ruleOut.push('00');
  //                     break;
  //                 default:
  //                     break;
  //             }
  //             switch(curRow){ //end of the row wall, cannot go further that direction
  //                 case 0:
  //                     ruleOut.push('11');
  //                     break;
  //                 case this.gridRowMax-1:
  //                     ruleOut.push('01')
  //                     break;
  //                 default:
  //                     break;
  //             }
  //             //nextNitro = Math.floor(Math.random() * 4).toString(2).padStart(2, '0') //doing test origin
  //             nextNitro =  '10'//doing test
  // //            while(nextNitro === ruleOutNext){//doing test
  // //                nextNitro = Math.floor(Math.random() * 4).toString(2).padStart(2, '0') //doing test
  // //                console.log('nextNitro', nextNitro)//doing test
  // //            }            //doing test
  //             let next= ruleOut.map((ruleOutCode, i)=>{
  //                 while(nextNitro === ruleOutNext || nextNitro === ruleOutCode){ //filtering out invalid direction or hit the wall
  //                     nextNitro = nextNitro === ruleOutCode ? Math.floor(Math.random() * 4).toString(2).padStart(2, '0'): nextNitro;
  //                 }
  //                 return nextNitro;
  //             });
  //             this.dna.push(nextNitro);
  //         }
  //         console.log(this.dna);
  //     }
}
