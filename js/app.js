import {TOOL_BRUSH, TOOL_BUCKET, TOOL_CIRCLE, TOOL_LINE, TOOL_PEN, TOOL_POLYGON, TOOL_RECT, TOOL_TRI} from './Tools.js'
import Paint from './Paint.js'
import {addGAParamEventHandle, registerFootPrintHandle} from './handleDomElements.js'
import { qAll,qry, qAllClick } from './alias.js';

Node.prototype.on = Node.prototype.addEventListener;
export const paint = new Paint("canvas")
paint.init();
paint.activeTool = TOOL_PEN;


let canvas = document.getElementById('canvas')
let parcel ;
// document.querySelectorAll('[data-command]').forEach(
//     el =>{
//         el.addEventListener('click', e=>{
//             console.log(el.getAttribute('data-command'));
//         })
//     }
// );
// qAll('[data-command]').forEach(el=>{
//     el =>{
//         el.addEventListener('click', e=>{
//             console.log(el.getAttribute('data-command'));
//         })
//     }
// })



qAll('[data-tool]').forEach(
    el=>{
        el.addEventListener('click', e=>{
            qry('[data-tool].active').classList.toggle('active');
            el.classList.toggle('active');
            const selected = el.getAttribute('data-tool');
            paint.activeTool = selected;
            switch(selected){
                case TOOL_PEN:                
                case TOOL_RECT :
                case TOOL_LINE :
                case TOOL_CIRCLE :
                case TOOL_TRI :                    
                case TOOL_POLYGON :
                    qry('.group.pen').style.display = 'block';
                    qry('.group.brush').style.display = 'none';
                    break;
                case TOOL_BRUSH :
                    qry('.group.pen').style.display = 'none';
                    qry('.group.brush').style.display = 'block';
                    break;
                case TOOL_BUCKET:
                    console.log('bucket selected in the app')
                    break;
                default  : 
                    qry('.group.pen').style.display = 'none';
                    qry('.group.brush').style.display = 'none';
                break;
            }
        })    
    }
);

qAll('[data-line-width]').forEach(
    el=>{
        el.addEventListener('click', e=>{
            qry('[data-line-width].active').classList.toggle('active');
            el.classList.toggle('active');            
            let linewidth = el.getAttribute('data-line-width');
            paint.lineWidth =  linewidth;
            console.log('linewidth', linewidth  );
        })
    }
);

qAll('[data-brush-size]').forEach(
    el=>{
        el.addEventListener('click', e=>{
            qry('[data-brush-size].active').classList.toggle('active');
            el.classList.toggle('active');
            let brushsize = el.getAttribute('data-brush-size');
            console.log('from html brushsize:',  brushsize );
            paint.brushSize=brushsize;
        })
    }
);

qAll('[data-color]').forEach(
    el=>{
        el.addEventListener('click',e=>{
            qry('[data-color].active').classList.toggle('active');
            el.classList.toggle("active");
            let color = el.getAttribute('data-color');
            paint.selectColor = color;
            console.log('color', color );
        } )
    }
);

registerFootPrintHandle();
addGAParamEventHandle();
