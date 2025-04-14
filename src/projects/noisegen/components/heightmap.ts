import { DoubleSide, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Texture, TextureLoader } from "three";
import { generate2DPerlinNoise } from "../../perlin/Perlin";

function generateHeightmap(width: number, height: number) {

    const image_data = new ImageData(width, height);

    const data = image_data.data;

    const noise = generate2DPerlinNoise(width, height, 1, 8, 1, 0.005, 0.5, 2);

    let alpha: number;
    let currentPixelIndex: number;
    for(let i = 0; i < noise.length; i++) {

        alpha = 255 * noise[i];

        currentPixelIndex = i * 4

        data[currentPixelIndex + 0] = alpha;
        data[currentPixelIndex + 1] = alpha;
        data[currentPixelIndex + 2] = alpha;

        data[currentPixelIndex + 3] = 255;
    }

    return image_data;
}

function createHeightmap() {

    //const geometry = new PlaneGeometry(500, 500, 257, 257);

    const hmap_width = 256;
    const hmap_height = 256;

    const geometry = new PlaneGeometry(1000, 1000, hmap_width, hmap_height);
    geometry.rotateX( -Math.PI / 2 );

    const loader = new TextureLoader();

    const texture = loader.load('/path_texture.png');
    const heightmap = loader.load('/testmap9.png');

    //const heightmap = new Texture(generateHeightmap(hmap_width, hmap_height));
    heightmap.needsUpdate = true;

    console.log(heightmap);

    const max_delta = 10;

    geometry.translate(0, max_delta / 2, 0);

    const material = new MeshStandardMaterial({
        color: 'gray',
        map: texture,
        displacementMap: heightmap,
        displacementScale: max_delta,
        side: DoubleSide,
        //wireframe: true
    });

    geometry.translate(0, -max_delta, 0);

    let mesh = new Mesh(geometry, material);
    return mesh;
}

export default createHeightmap;