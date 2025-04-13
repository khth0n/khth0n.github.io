
import { Vector2, Vector3 } from 'three';
import { WolframPRNGGen } from './PRNG'

const canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const data = imageData.data;

document.body.appendChild(canvas);

const test = WolframPRNGGen(15);

const test_gen = async () => {

    let alpha: number;
    for(let i = 0; i < data.length; i += 4) {

        alpha = 255 * (await test.next()).value!

        data[i + 0] = alpha;
        data[i + 1] = alpha;
        data[i + 2] = alpha;

        data[i + 3] = 255;

        console.log(alpha)
    }

    let perlinNoise = new Uint8ClampedArray(data.length);

    const topLeftIndex = 0;
    const topRightIndex = 4 * (canvas.width - 1);
    const bottomLeftIndex = data.length - 4 * canvas.width;
    const bottomRightIndex = data.length - 4;

    const colorToGradient = (index: number) => {

        let total = 0;

        total += data[index + 0] << 16;
        total += data[index + 1] << 8;
        total += data[index + 2];

        const angle = 2 * Math.PI * (total / 0xFFFFFF);
        
        return new Vector2(
            Math.cos(angle),
            Math.sin(angle)
        )
    }

    const topLeftGradient = colorToGradient(topLeftIndex);
    const topRightGradient = colorToGradient(topRightIndex);
    const bottomLeftGradient = colorToGradient(bottomLeftIndex);
    const bottomRightGradient = colorToGradient(bottomRightIndex);

    console.log(data);

    console.log( topLeftIndex, topRightIndex, bottomLeftIndex, bottomRightIndex );

    const lerp = (a: number, b: number, t: number) => {

        return a + (b - a) * t;
    }

    const Noise2D = (x: number, y: number) => {
    }

    for(let i = 0; i < data.length; i += 4) {

        const row = Math.floor(i / 4 / canvas.width);
        const col = (i / 4) % canvas.width;

        const value = Noise2D(row * 0.01, col * 0.01);


        /*
        //console.log(row);
        //console.log(col);

        const topLeftDistance = new Vector2(row - 0, col - 0);
        const topRightDistance = new Vector2(row - 1, col - 0);
        const bottomLeftDistance = new Vector2(row - 0, col - 1);
        const bottomRightDistance = new Vector2(row - 1, col - 1);

        const topLeftInfluence = topLeftGradient.dot(topLeftDistance);
        const topRightInfluence = topRightGradient.dot(topRightDistance);
        const bottomLeftInfluence = bottomLeftGradient.dot(bottomLeftDistance);
        const bottomRightInfluence = bottomRightGradient.dot(bottomRightDistance);

        const u = 0.5;
        const v = 0.5;

        const x1 = lerp(topLeftInfluence, topRightInfluence, u);
        const x2 = lerp(bottomLeftInfluence, bottomRightInfluence, u);

        const average = Math.round(lerp(x1, x2, v) * 255);

        console.log( average ); 

        perlinNoise[i + 0] = average;
        perlinNoise[i + 1] = average;
        perlinNoise[i + 2] = average;
        perlinNoise[i + 3] = 255;
        */
    }

    for(let i = 0; i < data.length; i++) {

        //data[i] = perlinNoise[i];
    }

    //const topLeftGradient = [ ]
    //perlinNoise[]

    ctx.putImageData(imageData, 0, 0);
}

test_gen()