import {qry} from './alias.js';
import {onParcel, onGrid, onFootPrint, onValidate, onParcelFootprint, onPopulate}  from './ProcessParcel.js';
export function registerFootPrintHandle(){
    qry('.parcel').on('click',onParcel);
    qry('.validate').on('click', onValidate);
    qry('.grid').on('click', onGrid)
    qry('.footprint').on('click', onFootPrint)
    qry('.parcel-footprint').on('click', onParcelFootprint)
    qry('.populate').on('click', onPopulate)
}