import {TOOL_ERASER,
    TOOL_BRUSH,
    TOOL_BUCKET, 
    TOOL_PEN,
    TOOL_RECT,
    TOOL_LINE, 
    TOOL_CIRCLE, 
    TOOL_TRI,
    TOOL_POLYGON} from './Tools.js'

import Point from './Point.js'    
import Paint from './Paint.js'
import Parcel from './Parcel.js'
import Polygon from './Polygon.js';
import {qry} from './alias.js'
import { registerFootPrintHandle } from './footMass.js'

Node.prototype.on = Node.prototype.addEventListener;
export const paint = new Paint("canvas")
paint.init();
paint.activeTool = TOOL_PEN;


let canvas = document.getElementById('canvas')
let parcel ;
document.querySelectorAll('[data-command]').forEach(
    el =>{
        el.addEventListener('click', e=>{
            console.log(el.getAttribute('data-command'));
        })
    }
);

document.querySelectorAll('[data-tool]').forEach(
    el=>{
        el.addEventListener('click', e=>{
            document.querySelector('[data-tool].active').classList.toggle('active');
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
                    document.querySelector('.group.pen').style.display = 'block';
                    document.querySelector('.group.brush').style.display = 'none';
                    break;
                case TOOL_BRUSH :
                    document.querySelector('.group.pen').style.display = 'none';
                    document.querySelector('.group.brush').style.display = 'block';
                    break;
                case TOOL_BUCKET:
                    console.log('bucket selected in the app')
                    break;
                default  : 
                    document.querySelector('.group.pen').style.display = 'none';
                    document.querySelector('.group.brush').style.display = 'none';
                break;
            }
        })    
    }
);

document.querySelectorAll('[data-line-width]').forEach(
    el=>{
        el.addEventListener('click', e=>{
            document.querySelector('[data-line-width].active').classList.toggle('active');
            el.classList.toggle('active');            
            let linewidth = el.getAttribute('data-line-width');
            paint.lineWidth =  linewidth;
            console.log('linewidth', linewidth  );
        })
    }
);

document.querySelectorAll('[data-brush-size]').forEach(
    el=>{
        el.addEventListener('click', e=>{
            document.querySelector('[data-brush-size].active').classList.toggle('active');
            el.classList.toggle('active');
            let brushsize = el.getAttribute('data-brush-size');
            console.log('from html brushsize:',  brushsize );
            paint.brushSize=brushsize;
        })
    }
);

document.querySelectorAll('[data-color]').forEach(
    el=>{
        el.addEventListener('click',e=>{
            document.querySelector('[data-color].active').classList.toggle('active');
            el.classList.toggle("active");
            let color = el.getAttribute('data-color');
            paint.selectColor = color;
            console.log('color', color );
        } )
    }
);

registerFootPrintHandle();
