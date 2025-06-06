import { WolframPRNGGen } from "../prngen/PRNG";

//Original implementation credit of Raouf
//https://github.com/rtouti/rtouti.github.io/blob/gh-pages/examples/perlin-noise.html
class Vector2 {

    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    dot(other: Vector2){
        return this.x * other.x + this.y * other.y;
    }
}

let rng: Generator<number, void, unknown> | null = null;

function Shuffle(tab: number[]){
    
    //const rng = WolframPRNGGen(2)

    if( rng == null ) throw new Error('no seeded prng');
    
    for(let e = tab.length-1; e > 0; e--){

        let index = Math.round((rng.next().value as number) * (e - 1));
        let temp = tab[e];

        tab[e] = tab[index];
        tab[index] = temp;
    }
}

function MakePermutation(){
    let P = [];
    for(let i = 0; i < 256; i++){
        P.push(i);
    }
    Shuffle(P);
    for(let i = 0; i < 256; i++){
        P.push(P[i]);
    }
    
    return P;
}
let P: number[];

function GetConstantVector(v: number){
    //v is the value from the permutation table
    let h = v & 3;
    if(h == 0)
        return new Vector2(1.0, 1.0);
    else if(h == 1)
        return new Vector2(-1.0, 1.0);
    else if(h == 2)
        return new Vector2(-1.0, -1.0);
    else
        return new Vector2(1.0, -1.0);
}

function Fade(t: number){
    return ((6*t - 15)*t + 10)*t*t*t;
}

function Lerp(t: number, a1: number, a2: number){
    return a1 + t*(a2-a1);
}

function Noise2D(x: number, y: number){
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;

    let xf = x-Math.floor(x);
    let yf = y-Math.floor(y);

    let topRight = new Vector2(xf-1.0, yf-1.0);
    let topLeft = new Vector2(xf, yf-1.0);
    let bottomRight = new Vector2(xf-1.0, yf);
    let bottomLeft = new Vector2(xf, yf);
    
    //Select a value in the array for each of the 4 corners
    let valueTopRight = P[P[X+1]+Y+1];
    let valueTopLeft = P[P[X]+Y+1];
    let valueBottomRight = P[P[X+1]+Y];
    let valueBottomLeft = P[P[X]+Y];
    
    let dotTopRight = topRight.dot(GetConstantVector(valueTopRight));
    let dotTopLeft = topLeft.dot(GetConstantVector(valueTopLeft));
    let dotBottomRight = bottomRight.dot(GetConstantVector(valueBottomRight));
    let dotBottomLeft = bottomLeft.dot(GetConstantVector(valueBottomLeft));
    
    let u = Fade(xf);
    let v = Fade(yf);
    
    return Lerp(u,
        Lerp(v, dotBottomLeft, dotTopLeft),
        Lerp(v, dotBottomRight, dotTopRight)
    );
}

export function generate2DPerlinNoise(width: number, height: number, seed=0, octaves=8, initial_amplitude=1.0, initial_frequency=0.115, persistence=0.5, lacunarity=2.0) {

    rng = WolframPRNGGen(seed);

    P = MakePermutation();

    let noiseArray = new Float64Array(width * height);

    let noiseIndex: number;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){

            noiseIndex = x + y * width;

            let amplitude = initial_amplitude;
            let frequency = initial_frequency;

            for(let i = 0; i < octaves; i++) {

                noiseArray[noiseIndex] += amplitude * Noise2D(x * frequency, y * frequency);

                amplitude *= persistence;
                frequency *= lacunarity;
            }

            noiseArray[noiseIndex] += 1.0;
            noiseArray[noiseIndex] *= persistence;
        }
    }

    return noiseArray;
}
