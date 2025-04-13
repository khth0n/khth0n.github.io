import { DoubleSide, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Texture, TextureLoader } from "three";


function createHeightmap() {

    //const geometry = new PlaneGeometry(500, 500, 257, 257);
    const geometry = new PlaneGeometry(500, 500, 200, 200);
    geometry.rotateX( -Math.PI / 2 );

    const loader = new TextureLoader();

    const texture = loader.load('/rock_texture.png');
    const heightmap = loader.load('/testmap5.png');

    const max_delta = -100;

    const material = new MeshStandardMaterial({
        color: 'gray',
        map: texture,
        displacementMap: heightmap,
        displacementScale: max_delta,
        //side: DoubleSide,
        //wireframe: true
    });

    geometry.translate(0, -max_delta, 0);

    let mesh = new Mesh(geometry, material);
    return mesh;
}

export default createHeightmap;