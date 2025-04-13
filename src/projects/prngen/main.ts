
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

const test_gen = () => {

    let alpha: number;
    for(let i = 0; i < data.length; i += 4) {

        alpha = 255 * test.next().value!

        data[i + 0] = alpha;
        data[i + 1] = alpha;
        data[i + 2] = alpha;

        data[i + 3] = 255;

        console.log(alpha)
    }

    ctx.putImageData(imageData, 0, 0);
}

test_gen()