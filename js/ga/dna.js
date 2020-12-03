export default class DNA{    
    constructor(dnaLen = 10, gridSize){ //gridSize = [cols, rows]
        //this.chromosome = this.populate(size)        
        this.dnaLen = dnaLen;
        this.gene = this.populate()
        this.startPos = {col:Math.floor(gridSize.cols/2), row:Math.floor(gridSize.rows/2)}
    }
    populate(){
        let nitro = [];
        for(let i=0; i< this.dnaLen; i++){
            nitro.push(Math.floor(Math.random()*4).toString(2).padStart(2,'0'));
        }
        console.log('nitro', nitro);
        return nitro;
    }

    //todo validCellCount 는 grid에서 foot이 있다면 validCount 도 있다.
    //parcel.onValidateCell에서 계산한 걸 여기로 가져오자.
    evaluate(){
        faRatio(parcel.vertices, validCellCount)
        //parcelArea = calcParcelArea(getParcel.vertices)
        //faRatio = getParcel.faRatio
    }
}