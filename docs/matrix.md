# Footprint 
- constructor : this.matFootprint = to2DArray(...)
- set : 
    - new Footprint
        - buildFootprint
            - for (row)
                - for (col)
                    - from :  grid.setMatFootprint(col, row)
                    - to : this.setMatrixFootprint(col, row)


for (let col = 0; col < this.arr2d.length; col++) {
                for (let row = 0; row < this.arr2d[col].length; row++) {
                    this.setFootprintMatrix(col, row);
                }
            }