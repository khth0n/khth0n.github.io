
import { Vector2, Vector3 } from 'three';
import { WolframPRNGGen } from './PRNG'

const canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const data = imageData.data;

//document.body.appendChild(canvas);

const test = WolframPRNGGen(18);

const test_gen = () => {

    let alpha: number;
    for(let i = 0; i < data.length; i += 4) {

        alpha = 255 * (test.next().value as number)

        data[i + 0] = alpha;
        data[i + 1] = alpha;
        data[i + 2] = alpha;

        data[i + 3] = 255;

        console.log(alpha)
    }

    ctx.putImageData(imageData, 0, 0);
}

test_gen()

import { Cell, ScalingGrid } from '../../templates/grids';

class Board extends ScalingGrid {

    constructor(){
        super()

        this.display()
    }

    public fillCells() {


        let alpha: number;

        if(this.cells.length > 0) {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {

                    alpha = Math.round(255 * (test.next().value as number))

                    this.cells[i][j].color = `rgba(${alpha}, ${alpha}, ${alpha}, 255)`
                }
            }
            return
        }

        for(let i = 0; i < this.rows; i++) {
            this.cells.push([])
            for(let j = 0; j < this.cols; j++) {

                alpha = Math.round(255 * (test.next().value as number))
                this.cells[i].push(new Cell(i * this.cellWidth, j * this.cellHeight, `rgba(${alpha}, ${alpha}, ${alpha}, 255)`))
            }
        }
    }

    public async copyCells(board: Board) {

        this.rows = board.rows;
        this.cols = board.cols;

        await this.regrid();
        await this.resize();

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {

                this.cells[i][j].color = board.cells[i][j].color;
            }
        }

        console.log(this.cellWidth);
    }
}

customElements.define('basic-grid', Board, { extends: 'canvas' })

const board = document.getElementById('board')! as Board

board.gridWidth = 128 * 3;
board.gridHeight = 128 * 3;

board.display();

const unscaledBoard = document.getElementById('unscaled-board') as Board

unscaledBoard.gridWidth = board.cols;
unscaledBoard.gridHeight = board.rows;

unscaledBoard.copyCells(board);

unscaledBoard.display();

