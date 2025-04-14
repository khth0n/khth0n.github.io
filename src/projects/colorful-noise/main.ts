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

        noiseArray[i] = 255 * rng.next().value!
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

const canvases = [];

const canvas_count = 10;

for(let i = 0; i < canvas_count; i++) {

    canvases[i] = document.createElement('canvas');

    canvases[i].width = 256;
    canvases[i].height = 256;

    comparison_stack.appendChild(canvases[i]);
}


//const original_noise = generate2DNoise(canvases[0].width, canvases[0].height);
const original_noise = toHeightmap(generate2DPerlinNoise(canvases[0].width, canvases[0].height, 0, 8, 1, 0.015, 0.5, 2));
renderNoise(canvases[0], original_noise);

///*
const filtered_noise = highPassFilterNoise(canvases[0].width, canvases[0].height, original_noise);
renderNoise(canvases[1], filtered_noise);

const filtered_noise_2 = lowPassFilterNoise(canvases[0].width, canvases[0].height, filtered_noise);
renderNoise(canvases[2], filtered_noise_2);

const filtered_noise_3 = highPassFilterNoise(canvases[0].width, canvases[0].height, filtered_noise_2);
renderNoise(canvases[3], filtered_noise_3);

const filtered_noise_4 = lowPassFilterNoise(canvases[0].width, canvases[0].height, filtered_noise_3);
renderNoise(canvases[4], filtered_noise_4);
//*/

const flatNoise = new Uint8ClampedArray(canvases[0].width * canvases[0].height);

for(let i = 0; i < flatNoise.length; i++) {

    flatNoise[i] = 255 * 0.3;
}

const combo_noise_2 = subtractNoise(filtered_noise_2, flatNoise);
renderNoise(canvases[5], combo_noise_2);


const combo_noise = combineNoise(combo_noise_2, filtered_noise);
renderNoise(canvases[6], combo_noise);

const combo_noise_3 = lowPassFilterNoise(canvases[0].width, canvases[0].height, combo_noise);
renderNoise(canvases[7], combo_noise_3);

const combo_noise_4 = lowPassFilterNoise(canvases[0].width, canvases[0].height, combo_noise_3);
renderNoise(canvases[8], combo_noise_4);

const combo_noise_5 = lowPassFilterNoise(canvases[0].width, canvases[0].height, combo_noise_4);
renderNoise(canvases[9], combo_noise_5);