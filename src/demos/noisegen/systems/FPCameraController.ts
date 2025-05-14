import { PerspectiveCamera, Vector2, Vector3 } from "three";

export class FPCameraController {

    constructor(container: HTMLDivElement, camera: PerspectiveCamera) {

        this.createCrosshair(container);

        container.addEventListener('click', async () => {

            console.log('clicked!');

            if( document.pointerLockElement ) return;

            await container.requestPointerLock({
                unadjustedMovement: true
            })
        })

        const target = new Vector3();

        const updateCameraRotation = (ev: MouseEvent) => {

            const distance = 100;

            const phi = Math.atan2(ev.movementY, distance);
            const theta = Math.atan2(ev.movementX, distance);

            //target.x = camera.position.x + distance * -Math.cos(theta) * Math.sin(phi);
            //target.y = camera.position.y + distance * Math.sin(theta) *Math.sin(phi);
            //target.z = camera.position.z + distance * -Math.cos(phi);

            //camera.rotateX( -Math.atan2(ev.movementY, distance) );
            //camera.rotateY( -Math.atan2(ev.movementX, distance) );

            console.log(target);

            //camera.lookAt(target);
            camera.lookAt(0, 0, 0);

            console.log( ev.movementX, ev.movementY );
        }

        const cameraDirection = new Vector3();

        const updateCameraPosition = (ev: KeyboardEvent) => {

            const maxSpeed = 5;

            camera.getWorldDirection(cameraDirection);

            const up = new Vector3(0, 1, 0);

            let perpendicular = new Vector3();

            perpendicular.crossVectors(up, cameraDirection);

            perpendicular = perpendicular.normalize();

            if(ev.code == 'KeyW' || ev.code == 'KeyS') {

                camera.position.addScaledVector(cameraDirection, ev.code == 'KeyW' ? maxSpeed : -maxSpeed);
            }

            if(ev.code == 'KeyA' || ev.code == 'KeyD') {

                camera.translateX(ev.code == 'KeyD' ? maxSpeed : -maxSpeed)
                //camera.position.addScaledVector(perpendicular, ev.code == 'KeyA' ? maxSpeed : -maxSpeed);
            }

            console.log(ev.code);
        }

        const lockChangeAlert = () => {

            if(document.pointerLockElement === container) {

                document.addEventListener('mousemove', updateCameraRotation, false);
                document.addEventListener('keydown', updateCameraPosition, false);
            } else {

                document.removeEventListener('mousemove', updateCameraRotation, false);
                document.removeEventListener('keydown', updateCameraPosition, false);
            }
        }

        document.addEventListener('pointerlockchange', lockChangeAlert, false);
    }

    createCrosshair(container: HTMLDivElement) {

        const crosshair = document.createElement('div') as HTMLDivElement;

        crosshair.id = 'controller-crosshair';
        crosshair.textContent = '+';

        container.appendChild(crosshair);
    }

    trackLook() {


    }
}