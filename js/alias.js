export const qry = item => document.querySelector(item) ;
export const qId =  item => document.getElementById(item);
export const qAll = item => document.querySelectorAll(item);
export const qClass =  item => document.getElementsByClassName(item);
export const qTag =  item => document.getElementsByTagName(item);
export const qAllClick = (item, callback )=> document.querySelectorAll(item).forEach(el=>{
    el.addEventListener('click', (e)=>{
        callback(e);
    })
})
