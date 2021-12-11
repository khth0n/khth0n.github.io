import { random_hex } from '../../custom-elements/global.js';
import { Button, ToggleButton, Cell, ScalingGrid, Slider, ControlField } from '../../custom-elements/index.js';
customElements.define('num-slider', Slider, { extends: 'input' });
customElements.define('control-field', ControlField, { extends: 'fieldset' });
class Board extends ScalingGrid {
    constructor() {
        super();
        this.display();
    }
    fillCells() {
        if (this.cells.length > 0) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.cells[i][j].color = random_hex(8);
                }
            }
            return;
        }
        for (let i = 0; i < this.rows; i++) {
            this.cells.push([]);
            for (let j = 0; j < this.cols; j++) {
                this.cells[i].push(new Cell(i * this.cellWidth, j * this.cellHeight, random_hex(8)));
            }
        }
    }
}
customElements.define('basic-grid', Board, { extends: 'canvas' });
const board = document.getElementById('board');
class ExecButton extends Button {
    constructor() {
        super();
        this.innerText = this.getAttribute('name') || 'Execute';
    }
    activate(ev) {
        board.fillCells();
        board.display();
    }
}
class GenButton extends ToggleButton {
    constructor() {
        super();
    }
    loop() {
        console.log('pinged');
    }
}
customElements.define('exec-button', ExecButton, { extends: 'button' });
customElements.define('gen-button', GenButton, { extends: 'button' });
