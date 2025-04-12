
import { OrthographicCamera, PerspectiveCamera } from "three";

function createCamera() {

    const camera = new PerspectiveCamera();

    //camera.rotateX(-Math.PI / 2);
    //camera.rotateZ(-Math.PI / 4);

    //camera.position.set(0, 1, 0);

    camera.position.set(0, 1000, 0);

    camera.position.set(500, 500, 500);
    camera.lookAt(0, 0, 0);

    return camera;
}

export default createCamera;