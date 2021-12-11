var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Grid extends HTMLCanvasElement {
    constructor() {
        super();
        const name = this.id;
        if (name) {
            this.id = name;
        }
        else {
            this.id = `grid-${Grid.instances}`;
        }
        this.ctx = this.getContext('2d');
        this.image = new ImageData(this.width, this.height);
        Grid.instances++;
    }
    display() {
        return __awaiter(this, void 0, void 0, function* () {
            const bitmap = yield createImageBitmap(this.image);
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(bitmap, 0, 0);
        });
    }
}
Grid.instances = 1;
class Cell {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this._color = color;
    }
    show(ctx, width, height) {
        ctx.clearRect(this.x, this.y, width, height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, width, height);
    }
    get color() { return this._color; }
    set color(newColor) { this._color = newColor; }
}
class ScalingGrid extends Grid {
    constructor() {
        super();
        this._rows = parseInt(this.getAttribute('rows') || '50');
        this._cols = parseInt(this.getAttribute('cols') || '50');
        this.cellWidth = Math.trunc(this.width / this.cols);
        this.cellHeight = Math.trunc(this.height / this.rows);
        this.width = this.cellWidth * this.cols;
        this.height = this.cellHeight * this.rows;
        this.cells = [];
        this.fillCells();
        this.needsResize = false;
    }
    display() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.needsResize) {
                this.resize();
            }
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.cells[i][j].show(this.ctx, this.cellWidth, this.cellHeight);
                }
            }
        });
    }
    resize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cellWidth = Math.trunc(this.width / this.cols);
            this.cellHeight = Math.trunc(this.height / this.rows);
            this.width = this.cellWidth * this.cols;
            this.height = this.cellHeight * this.rows;
            this.cells = [];
            this.fillCells();
        });
    }
    get rows() { return this._rows; }
    get cols() { return this._cols; }
    set rows(newRows) {
        if (newRows > 0) {
            this._rows = newRows;
        }
        else {
            this._rows = 50;
        }
        this.needsResize = true;
    }
    set cols(newCols) {
        if (newCols > 0) {
            this._cols = newCols;
        }
        else {
            this._cols = 50;
        }
        this.needsResize = true;
    }
}
class DrawingGrid extends ScalingGrid {
}
export { Cell, ScalingGrid };
