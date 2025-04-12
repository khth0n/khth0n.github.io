

import { AmbientLight, AxesHelper, Light, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import createRenderer from './systems/renderer';
import createCamera from './components/camera';
import createScene from './components/scene';

import createHeightmap from './components/heightmap';
import { Resizer } from './systems/Resizer';
import { FPCameraController } from './systems/FPCameraController';

let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let scene: Scene;

export class World {

    constructor(container: HTMLDivElement) {

        camera = createCamera();
        renderer = createRenderer();
        scene = createScene();
        container.append(renderer.domElement);

        const controller = new FPCameraController(container, camera);

        const heightmap = createHeightmap();
        scene.add(heightmap);

        const axesHelper = new AxesHelper(512);

        scene.add(axesHelper);

        const light = new AmbientLight(0xffffff, 2);
        light.position.y = 2;

        scene.add(light);

        const resizer = new Resizer(container, camera, renderer);

        const handlePageUpdate = () => {

            resizer.resize();
        }

        window.onload = () => handlePageUpdate();

        window.onresize = () => handlePageUpdate();
    }

    render() {

        renderer.render(scene, camera);
    }
}

