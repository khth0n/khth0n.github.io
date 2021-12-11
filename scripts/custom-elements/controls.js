class Button extends HTMLButtonElement {
    constructor() {
        super();
        this.addEventListener('click', this.activate);
    }
}
class ToggleButton extends Button {
    constructor() {
        super();
        this.initialState = this.getAttribute('initial') || 'Start';
        this.toggledState = this.getAttribute('toggled') || 'Stop';
        this.toggled = false;
        this.intervalId = null;
        this.innerText = this.initialState;
    }
    activate(ev) {
        this.toggle();
    }
    toggle() {
        this.toggled = !this.toggled;
        if (this.toggled) {
            this.innerText = this.toggledState;
            this.intervalId = setInterval(this.loop, 1);
        }
        else {
            this.innerText = this.initialState;
            this.toggled = false;
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
class Slider extends HTMLInputElement {
    constructor() {
        super();
        const name = this.getAttribute('name');
        if (name) {
            this.id = name;
        }
        else {
            this.id = `slider-${Slider.instances}`;
        }
        this.classList.add('slider');
        const positions = new Map([['before', 'beforebegin'], ['after', 'afterend']]);
        const titlePosition = (positions.get(this.getAttribute('title')) || positions.get('before'));
        const valuePosition = (positions.get(this.getAttribute('value')) || positions.get('after'));
        this.type = 'range';
        this.titleText = document.createElement('label');
        this.valueText = document.createElement('label');
        this.titleText.classList.add('label-title');
        this.valueText.classList.add('label-value');
        this.titleText.htmlFor = this.valueText.htmlFor = this.id;
        this.titleText.innerText = name ? `${name}\t` : 'Slider';
        this.valueText.innerText = this.value;
        this.addEventListener('input', (ev) => {
            const recent = ev.target;
            if (recent.value != this.valueText.innerText) {
                this.valueText.innerText = this.value;
            }
        });
        this.insertAdjacentElement(titlePosition, this.titleText);
        this.insertAdjacentElement(valuePosition, this.valueText);
        Slider.instances++;
    }
}
Slider.instances = 1;
class NamedElement {
    constructor(type, defaultName, instance) {
        this.type = type;
        this.name = type.id;
        if (this.name) {
            type.id = this.name;
        }
        else {
            type.id = `${defaultName}-${instance}`;
        }
        type.classList.add(defaultName);
    }
}
class ControlField extends HTMLFieldSetElement {
    constructor() {
        super();
        const name = this.id;
        if (name) {
            this.id = name;
        }
        else {
            this.id = `control-field-${ControlField.instances}`;
        }
        this.classList.add('control-field');
        const controlLegend = document.createElement('legend');
        controlLegend.innerText = name ? name : 'Control Field';
        this.insertAdjacentElement('afterbegin', controlLegend);
        ControlField.instances++;
    }
}
ControlField.instances = 1;
export { Button, ToggleButton, Slider, ControlField };
