import { World } from './world';

const container = document.querySelector('#scene-container') as HTMLDivElement;

const world = new World(container);


function render() {

    world.render();

    requestAnimationFrame(render);
}

render();