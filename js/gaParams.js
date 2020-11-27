//Rerenced https://www.trysmudford.com/blog/linear-interpolation-functions/

const lerp = (x, y, a) => x * (1 - a) + y * a; //x와 y의 범위가 주어졌을 때 a ratio면 얼마가 되겠느냐 하는 것
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a)); //a 가 x와 y의 맥스 값을 넘지 않도록, 넘으면  x y중  max값 리턴
const invlerp = (x, y, a) => clamp((a - x) / (y - x)); // a가 x 와  y 사이의 몇분율에 해당하는지를 구함
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a)); //p5의  map 과 동일


//용적률
export function floorAreaRatio(aParcel, aFootPrint) {
    return aFootPrint / aParcel ;    
}
//fitness function based on floorAreaRatio
export function fitnessFaRatio(allowance, faRatio){
    if(allowance > faRatio){
        return -1;
    }
    max = allowance;
    min = 0;
    diff = allowanced - faRatio;
    fitArea = invlerp(min, max, diff);
    return fitArea;
}



