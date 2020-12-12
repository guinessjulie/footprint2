# OnParpulate
  
## Start : [onPopulate menu:populate](/js/ProcessParcel.js)
parcel, grid already created otherwise create
```javascript
let footprints = new Footprints(parcel, grid);
```

### Footprints constructor (parcel, grid)
```javascript
this.dnas = [];
this.populateDNA(params.numIndividuals) //... 0 
this.population = [];
this.initPopulationFootprint() //....1
this.displayDomInformation()

```
- ### 0. populateDNA(param.numIndividuals) in footprints.js
```javascript
populateDNA(numIndividual) //
{
    for (let i = 0; i < numIndividual; i++) {
        let dna = new DNA(numIndividual, this.gridSize)
        this.dnas.push(dna);
    }
}
```
### 1. initPopulationFootprint()
```javascript
 initPopulationFootprint(){
    for (let indvDna of this.dnas){
        let footprint  =new Footprint(indvDna); //....2
        this.populFoots.push(footprint);
  }
}
```
### 2. let footprint = new Footprint(parcel, grid)    
```javascript 
constructor(){
    this.dna= dna;
    this.activeCell=0;
    grid.cleanupGrid();
    this.indivFoot =this.buildFootprint(); //...3
    this.matFootprint = to2DArray(grid.cols, gird.rows); //...3 
}            
```

###3. buildFootprint() //build FootprintMatrix
```javascript
//...call nextCellActive (fill active cell on grid.arr2d)
for(let row in [...new Array(grid.rows).keys()]){
    for (let col in [...new Array(grid.cols).keys()]){
        let loc = {col, row, size};
        let arrPt = [];
        let { pt1, pt2, pt3, pt4 } = grid.getCellCorners(loc, size);
        arrPt.push(pt1, pt2, pt3, pt4);
        this.buildFootprintMatrix(col, row); //set matInsideParcel... 
        grid.setMatCellInside(col, row) // set matCellInside
        //todo matInsideParcel cellinsideParcel
        //todo matFoot to be a member of footprint
    }
}
this.displayValidCell(parcel.vertices);
onPreview();

let matFootprint = matrix(this.indivFoot).and(matrix(this.validGrid))
```
# grid.setValidGrid
## logic
1. parcel first created(existed)
2. grid is already created.
3. check random cell is inside the grid or not?

 
      
