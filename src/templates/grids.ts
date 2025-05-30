abstract class Grid extends HTMLCanvasElement {

    protected ctx: CanvasRenderingContext2D
    protected image: ImageData

    static instances = 1

    constructor() {
        super()

        const name = this.id
        
        if(name) {
            this.id = name
        } else {
            this.id = `grid-${Grid.instances}`
        }

        this.ctx = this.getContext('2d')!

        this.image = new ImageData(this.width, this.height)

        Grid.instances++
    }

    public async display() {
        const bitmap = await createImageBitmap(this.image)

        this.ctx.clearRect(0, 0, this.width, this.height)
        this.ctx.drawImage(bitmap, 0, 0)
    }
}

class Cell {

    public color: string
    public x: number;
    public y: number;

    constructor(x: number, y: number, color: string) {

        this.x = x;
        this.y = y;
        this.color = color
    }

    public show(ctx: CanvasRenderingContext2D, width: number, height: number) {

        ctx.clearRect(this.x, this.y, width, height)

        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, width, height)
    }
}

abstract class ScalingGrid extends Grid {

    protected _rows: number
    protected _cols: number

    protected cellWidth: number
    protected cellHeight: number

    protected cells: Cell[][]

    private needsResize: boolean
    private needsRegrid: boolean

    constructor() {
        super()

        this._rows = parseInt(this.getAttribute('rows') || '50')
        this._cols = parseInt(this.getAttribute('cols') || '50')

        this.cellWidth = Math.trunc(this.width / this.cols)
        this.cellHeight = Math.trunc(this.height / this.rows)

        this.width = this.cellWidth * this.cols
        this.height = this.cellHeight * this.rows

        this.cells = []
        this.fillCells()

        this.needsResize = false
        this.needsRegrid = false
    }

    public abstract fillCells(): void

    public async display() {

        await this.regrid();
        await this.resize();

        if(this.cells.length === 0) return;

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                this.cells[i][j].show(this.ctx, this.cellWidth, this.cellHeight)
            }
        }
    }

    public async regrid() {
        
        if(this.needsRegrid === false) return; 

        this.cells = []
        this.fillCells()

        this.needsRegrid = false;
    }

    get rows() { return this._rows }
    get cols() { return this._cols}

    set rows(newRows) {
        if(newRows > 0){
            this._rows = newRows
        } else {
            this._rows = 50
        }

        this.needsRegrid = true
    }

    set cols(newCols) {
        if(newCols > 0){
            this._cols = newCols
        } else {
            this._cols = 50
        }

        this.needsRegrid = true
    }

    public resize() {

        if( this.needsResize === false) return;

        this.cellWidth = Math.trunc(this.width / this.cols)
        this.cellHeight = Math.trunc(this.height / this.rows)

        this.width = this.cellWidth * this.cols
        this.height = this.cellHeight * this.rows

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {

                this.cells[i][j].x = i * this.cellWidth;
                this.cells[i][j].y = j * this.cellHeight;
            }
        }

        this.needsRegrid = false;
    }

    set gridWidth(newWidth: number) {

        this.width = newWidth;

        this.needsResize = true;
    }

    set gridHeight(newHeight: number) {

        this.height = newHeight;

        this.needsResize = true;
    }
}

abstract class DrawingGrid extends ScalingGrid {

}

export { Cell, ScalingGrid }