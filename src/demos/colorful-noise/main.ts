import { WolframPRNGGen } from "../prngen/PRNG";
import { generate2DPerlinNoise } from "../perlin/Perlin";

const comparison_stack = document.getElementById('comparison') as HTMLDivElement;

const rng = WolframPRNGGen(14);

const renderNoise = (canvas: HTMLCanvasElement, noise: Uint8ClampedArray) => {

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let indexer: number;

    for(let i = 0; i < noise.length; i++) {

        indexer = 4 * i;

        data[indexer + 0] = noise[i];
        data[indexer + 1] = noise[i];
        data[indexer + 2] = noise[i];

        data[indexer + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}

const generate2DNoise = (width: number, height: number) => {

    let noiseArray = new Uint8ClampedArray(width * height);

    for(let i = 0; i < noiseArray.length; i++) {

        noiseArray[i] = 255 * (rng.next().value as number)
    }

    return noiseArray;
}

const toHeightmap = (values: Float64Array) => {

    let heightmap = new Uint8ClampedArray(values.length * 4);

    let alpha: number;
    let currentPixelIndex: number;
    for(let i = 0; i < values.length; i++) {

        heightmap[i] = 255 * values[i];
    }

    return heightmap;
}

const lowPassFilterNoise = (width: number, height: number, noise: Uint8ClampedArray) => {

    let filteredNoise = new Uint8ClampedArray(width * height);

    for(let i = 0; i < noise.length; i++) {

        const row = Math.floor(i / width);
        const col = i % width;

        const offset = 1;

        const kernel = [];

        for(let j = -offset; j <= offset; j++) {

            for(let k = -offset; k <= offset; k++) {

                const offsetRow = row + j < 0 ? height + j : (row + j) % height;
                const offsetCol = col + k < 0 ? width + k : (col + k) % width;

                const offsetIndex = offsetRow * width + offsetCol
                kernel.push(noise[offsetIndex]);

            }
        }

        let kernelSum = 0;

        for(let j = 0; j < kernel.length; j++) {

            kernelSum += kernel[j];
        }

        filteredNoise[i] = kernelSum / kernel.length;
    }

    return filteredNoise;
}

const highPassFilterNoise = (width: number, height: number, noise: Uint8ClampedArray) => {

    let filteredNoise = new Uint8ClampedArray(width * height);

    for(let i = 0; i < noise.length; i++) {

        const row = Math.floor(i / width);
        const col = i % width;

        const offset = 1;

        const kernel = [];

        for(let j = -offset; j <= offset; j++) {

            for(let k = -offset; k <= offset; k++) {

                const offsetRow = row + j < 0 ? height + j : (row + j) % height;
                const offsetCol = col + k < 0 ? width + k : (col + k) % width;

                const offsetIndex = offsetRow * width + offsetCol
                kernel.push(noise[offsetIndex]);

            }
        }

        for(let j = 0; j < kernel.length; j++) {

            kernel[j] *= -1;
        }

        kernel[4] *= -9;

        let kernelSum = 0;

        for(let j = 0; j < kernel.length; j++) {

            kernelSum += kernel[j];
        }

        filteredNoise[i] = kernelSum;
    }

    return filteredNoise;
}

const combineNoise = (noiseA: Uint8ClampedArray, noiseB: Uint8ClampedArray) => {

    if(noiseA.length != noiseB.length) throw new Error('noise map size mismatch');

    let combinedNoiseValues = new Float64Array(noiseA.length);

    let maxValue = 0;
    for(let i = 0; i < combinedNoiseValues.length; i++) {

        combinedNoiseValues[i] = noiseA[i] + noiseB[i];

        if(combinedNoiseValues[i] > maxValue) {

            maxValue = combinedNoiseValues[i];
        }
    }

    let combinedNoise = new Uint8ClampedArray(noiseA.length);
    for(let i = 0; i < combinedNoise.length; i++) {

        combinedNoise[i] = 255 * (combinedNoiseValues[i] / maxValue);
    }

    return combinedNoise;
}

/**
 * Subtract NoiseB from NoiseA
 */
const subtractNoise = (noiseA: Uint8ClampedArray, noiseB: Uint8ClampedArray) => {

    if(noiseA.length != noiseB.length) throw new Error('noise map size mismatch');

    let combinedNoise = new Uint8ClampedArray(noiseA.length);

    for(let i = 0; i < combinedNoise.length; i++) {;

        combinedNoise[i] = noiseA[i] - noiseB[i];
    }

    return combinedNoise;
}

const invertNoise = (noise: Uint8ClampedArray) => {

    let inverted = new Uint8ClampedArray(noise.length);

    for(let i = 0; i < noise.length; i++) {

        inverted[i] = 255 - noise[i];
    }

    return inverted;
}

const canvasToHeightmap = (canvas: HTMLCanvasElement) => {

    let heightmap = new Uint8ClampedArray(canvas.width * canvas.height);

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < heightmap.length; i++) {

        heightmap[i] = data[4 * i];
    }

    return heightmap;
}

const canvases: HTMLCanvasElement[] = [];

const canvas_count = 10;

for(let i = 0; i < canvas_count; i++) {

    canvases[i] = document.createElement('canvas');

    canvases[i].width = 256;
    canvases[i].height = 256;

    comparison_stack.appendChild(canvases[i]);
}


//const original_noise = generate2DNoise(canvases[0].width, canvases[0].height);
//const original_noise = toHeightmap(generate2DPerlinNoise(canvases[0].width, canvases[0].height, 0, 8, 1, 0.015, 0.5, 2));
//renderNoise(canvases[0], original_noise);

let pathImages: HTMLImageElement[] = [];
let heightmap: Promise<Uint8ClampedArray>[] = [];


for(let i = 0; i < 10; i++) {

    pathImages[i] = new Image();

    heightmap[i] = new Promise<Uint8ClampedArray>((resolve, reject) => {
        setTimeout(() => {
            resolve(new Uint8ClampedArray());
        }, 1000);
    });

    pathImages[i].onload = () => {
    
        const ctx = canvases[i].getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(pathImages[i], 0, 0);


        heightmap[i] = new Promise<Uint8ClampedArray>((resolve, reject) => {

            resolve(canvasToHeightmap(canvases[i]));
        })
    
        //console.log();
    }

    pathImages[i].src = `/sub_peak${i}.png`;
}

const test = async () => {

    console.log('pinged');

    console.log(await heightmap[0]);

    console.log('nice');

    //console.log(await Promise.all(heightmap));
}

test();