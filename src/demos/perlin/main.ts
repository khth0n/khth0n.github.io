import { generate2DPerlinNoise } from "./Perlin";

const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const data = imageData.data;

document.body.appendChild(canvas);

function showHeightmap(noise: Float64Array) {

    let alpha: number;
    let currentPixelIndex: number;
    for(let i = 0; i < noise.length; i++) {

        alpha = 255 * noise[i];

        currentPixelIndex = i * 4

        ///*
        data[currentPixelIndex + 0] = alpha;
        data[currentPixelIndex + 1] = alpha;
        data[currentPixelIndex + 2] = alpha;
        //*/

        /*
        if(noise[i] < 0.5) {

            [
                data[currentPixelIndex + 0],
                data[currentPixelIndex + 1],
                data[currentPixelIndex + 2]
            ] = [0, 0, 255]
        } else if(noise[i] < 0.7) {

            [
                data[currentPixelIndex + 0],
                data[currentPixelIndex + 1],
                data[currentPixelIndex + 2]
            ] = [0, 255, 0]
        } else if(noise[i] < 0.9) {

            [
                data[currentPixelIndex + 0],
                data[currentPixelIndex + 1],
                data[currentPixelIndex + 2]
            ] = [160, 160, 160]
        }
        */

        data[currentPixelIndex + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}

const sampleNoise = generate2DPerlinNoise(canvas.width, canvas.height, 1, 8, 1, 0.005, 0.5, 2);
showHeightmap(sampleNoise);