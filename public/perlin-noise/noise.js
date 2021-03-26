"use strict";
var canvas = document.getElementById('data');
var table = document.getElementById('data-table');
var context = canvas.getContext('2d');
const height = canvas.height;
const width = canvas.width;
function keyFn(value) {
    return value % 13;
}
function valueFn(value) {
    value += 89;
    return (value << (value ^ 13)) ^ value + 1;
}
function* generator(start) {
    let key = keyFn(start);
    let hashMap = {};
    hashMap[key] = valueFn(start);
    while (true) {
        let current = keyFn(hashMap[key]);
        hashMap[current] = valueFn(hashMap[key]);
        key = current;
        yield 0.5 * Math.sin(hashMap[key]) + 0.5;
    }
}
var NoiseTypes;
(function (NoiseTypes) {
    NoiseTypes[NoiseTypes["WHITE"] = 0] = "WHITE";
    //PINK,
    NoiseTypes[NoiseTypes["RED"] = 1] = "RED";
    NoiseTypes[NoiseTypes["BLUE"] = 2] = "BLUE";
    NoiseTypes[NoiseTypes["LAST"] = 3] = "LAST";
})(NoiseTypes || (NoiseTypes = {}));
var noiseType = NoiseTypes.WHITE;
document.getElementById('card-header').innerHTML = `${NoiseTypes[noiseType]} Noise`;
var Colors;
(function (Colors) {
    Colors["RED"] = "rgb(255, 0, 0)";
    Colors["ORANGE"] = "rgb(255, 69, 0)";
    Colors["YELLOW"] = "rgb(255, 255, 0)";
    Colors["GREEN"] = "rgb(0, 255, 0)";
    Colors["BLUE"] = "rgb(0, 0, 255)";
    Colors["INDIGO"] = "rgb(111, 0, 255)";
    Colors["VIOLET"] = "rgb(221, 160, 221)";
    Colors["WHITE"] = "rgb(255, 255, 255)";
    Colors["GRAY"] = "rgb(220, 220, 220)";
    Colors["BLACK"] = "rgb(0, 0, 0)";
    Colors["BROWN"] = "rgb(101, 67, 33)";
    Colors["LIME"] = "rgb(194, 255, 52)";
    Colors["TURQUOISE"] = "rgb(52, 255, 225)";
    Colors["LIGHT_BLUE"] = "rgb(71, 172, 255)";
    Colors["NAVY"] = "rgb(0, 0, 128)";
    Colors["HAY"] = "rgb(211, 204, 163)";
    Colors["FOREST_GREEN"] = "rgb(34, 139, 34)";
})(Colors || (Colors = {}));
class MonochromeColors {
    getFillStyle(value) {
        return `rgb(0, 0, 0, ${value})`;
    }
}
class IslandColors {
    getFillStyle(value) {
        if (value <= 0.4) {
            return Colors.NAVY;
        }
        else if (value <= 0.5) {
            return Colors.BLUE;
        }
        else if (value <= 0.55) {
            return Colors.HAY;
        }
        else if (value <= 0.7) {
            return Colors.GREEN;
        }
        else if (value <= 0.75) {
            return Colors.BROWN;
        }
        else if (value <= 0.8) {
            return Colors.GRAY;
        }
        else {
            return Colors.WHITE;
        }
    }
}
class LandColors {
    getFillStyle(value) {
        if (value <= 0.1) {
            return Colors.HAY;
        }
        else if (value <= 0.3) {
            return Colors.LIME;
        }
        else if (value <= 0.4) {
            return Colors.GREEN;
        }
        else if (value <= 0.6) {
            return Colors.FOREST_GREEN;
        }
        else if (value <= 0.7) {
            return Colors.BROWN;
        }
        else if (value <= 0.8) {
            return Colors.GRAY;
        }
        else {
            return Colors.WHITE;
        }
    }
}
class TestColors {
    getFillStyle(value) {
        if (value <= 0.1) {
            return Colors.VIOLET;
        }
        else if (value <= 0.2) {
            return Colors.INDIGO;
        }
        else if (value <= 0.3) {
            return Colors.BLUE;
        }
        else if (value <= 0.4) {
            return Colors.GREEN;
        }
        else if (value <= 0.5) {
            return Colors.YELLOW;
        }
        else if (value <= 0.6) {
            return Colors.ORANGE;
        }
        else if (value <= 0.7) {
            return Colors.RED;
        }
        else if (value <= 0.8) {
            return Colors.BLACK;
        }
        else if (value <= 0.9) {
            return Colors.GRAY;
        }
        else {
            return Colors.WHITE;
        }
    }
}
var ColorSchemes;
(function (ColorSchemes) {
    ColorSchemes[ColorSchemes["MONOCHROME"] = 0] = "MONOCHROME";
    ColorSchemes[ColorSchemes["TEST"] = 1] = "TEST";
    ColorSchemes[ColorSchemes["ISLAND"] = 2] = "ISLAND";
    ColorSchemes[ColorSchemes["LAND"] = 3] = "LAND";
    ColorSchemes[ColorSchemes["LAST"] = 4] = "LAST";
})(ColorSchemes || (ColorSchemes = {}));
var colorScheme = new MonochromeColors();
var colorSchemeNum = 0;
var seed = 0;
var persistence = 0.5;
var octaves = 1;
var noiseData = generateWhiteNoise();
displayGrid(noiseData);
var isPerlin = false;
function displayGrid(values) {
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const value = values[i][j];
            context.fillStyle = colorScheme.getFillStyle(value);
            context.fillRect(i, j, 1, 1);
        }
    }
    generateTable();
}
function generateTable() {
    table.deleteTHead();
    let thead = table.createTHead();
    let colorSchemeRow = thead.insertRow();
    let seedRow = thead.insertRow();
    colorSchemeRow.innerHTML = 'Color Scheme: ';
    seedRow.innerHTML = 'Seed: ';
    appendToRow(colorSchemeRow, document.createElement('th'), document.createTextNode(`${ColorSchemes[colorSchemeNum]}`));
    appendToRow(seedRow, document.createElement('th'), document.createTextNode(`${seed}`));
    if (!isPerlin)
        return;
    let persistRow = thead.insertRow();
    let octaveRow = thead.insertRow();
    persistRow.innerHTML = 'Persistence: ';
    octaveRow.innerHTML = 'Octaves: ';
    appendToRow(persistRow, document.createElement('th'), document.createTextNode(`${persistence}`));
    appendToRow(octaveRow, document.createElement('th'), document.createTextNode(`${octaves}`));
}
function appendToRow(row, th, value) {
    row.appendChild(addValueToTableHead(th, value));
}
function addValueToTableHead(th, value) {
    return th.appendChild(value);
}
var isNextNoise = false;
function generateCurrentNoise() {
    switch (noiseType) {
        //case NoiseTypes.PINK:
        //break;
        case NoiseTypes.RED:
            noiseData = generateRedNoise();
            break;
        case NoiseTypes.BLUE:
            noiseData = generateBlueNoise();
            break;
        default:
            noiseData = generateWhiteNoise();
    }
    if (!isNextNoise)
        displayGrid(noiseData);
}
function nextNoise() {
    changeNoise();
    isPerlin = true;
    document.getElementById('card-header').innerHTML = `Perlin Noise using ${NoiseTypes[noiseType]} Noise`;
    displayGrid(generatePerlinNoise(noiseData));
}
function changeColorScheme() {
    colorSchemeNum = ++colorSchemeNum % ColorSchemes.LAST;
    switch (colorSchemeNum) {
        case ColorSchemes.ISLAND:
            colorScheme = new IslandColors();
            break;
        case ColorSchemes.LAND:
            colorScheme = new LandColors();
            break;
        case ColorSchemes.TEST:
            colorScheme = new TestColors();
            break;
        default:
            colorScheme = new MonochromeColors();
    }
    if (!isPerlin)
        document.getElementById('card-header').innerHTML = `${NoiseTypes[noiseType]} Noise`;
    if (!isPerlin) {
        displayGrid(noiseData);
    }
    else {
        displayGrid(generatePerlinNoise(noiseData));
    }
}
function changeSeed() {
    document.getElementById('card-header').innerHTML = `${NoiseTypes[noiseType]} Noise`;
    context.clearRect(0, 0, width, height);
    seed = Math.floor((Math.random() * 2049) - 1024);
    isPerlin = false;
    generateCurrentNoise();
}
function changeNoise() {
    noiseType = ++noiseType % NoiseTypes.LAST;
    document.getElementById('card-header').innerHTML = `${NoiseTypes[noiseType]} Noise`;
    isPerlin = false;
    generateCurrentNoise();
}
function convertToPerlin() {
    document.getElementById('card-header').innerHTML = `Perlin Noise using ${NoiseTypes[noiseType]} Noise`;
    isPerlin = true;
    displayGrid(generatePerlinNoise(noiseData));
    console.log('Completed!');
}
function increasePersist() {
    if (persistence < 0.9) {
        persistence += 0.1;
    }
    convertToPerlin();
}
function decreasePersist() {
    if (persistence > 0.1) {
        persistence -= 0.1;
    }
    convertToPerlin();
}
function increaseOctave() {
    octaves++;
    convertToPerlin();
}
function decreaseOctave() {
    if (octaves > 0) {
        octaves--;
    }
    convertToPerlin();
}
function generateWhiteNoise() {
    let gen = generator(seed);
    let noiseArr = [];
    for (let i = 0; i < height; i++) {
        noiseArr[i] = [];
        for (let j = 0; j < width; j++) {
            noiseArr[i][j] = gen.next().value;
        }
    }
    return noiseArr;
}
function generateRedNoise() {
    let noise = generateWhiteNoise();
    let outputNoise = [];
    for (let y = 0; y < height; y++) {
        outputNoise[y] = [];
        for (let x = 0; x < width; x++) {
            outputNoise[y][x] = noise[y][x];
            let total = 1;
            if (y > 0 && y < height - 1) {
                outputNoise[y][x] += noise[y + 1][x] + noise[y - 1][x];
                total += 2;
            }
            else if (y === 0) {
                outputNoise[y][x] += noise[y + 1][x];
                total++;
            }
            else {
                outputNoise[y][x] += noise[y - 1][x];
                total++;
            }
            if (x > 0 && x < width - 1) {
                outputNoise[y][x] += noise[y][x + 1] + noise[y][x - 1];
                total += 2;
            }
            else if (x === 0) {
                outputNoise[y][x] += noise[y][x + 1];
                total++;
            }
            else {
                outputNoise[y][x] += noise[y][x - 1];
                total++;
            }
            outputNoise[y][x] /= total;
        }
    }
    return outputNoise;
}
function generateBlueNoise() {
    let noise = generateWhiteNoise();
    let outputNoise = [];
    for (let y = 0; y < height; y++) {
        outputNoise[y] = [];
        for (let x = 0; x < width; x++) {
            outputNoise[y][x] = noise[y][x];
            let total = 1;
            if (y > 0 && y < height - 1) {
                outputNoise[y][x] -= noise[y + 1][x] - noise[y - 1][x];
                total += 2;
            }
            else if (y === 0) {
                outputNoise[y][x] -= noise[y + 1][x];
                total++;
            }
            else {
                outputNoise[y][x] -= noise[y - 1][x];
                total++;
            }
            if (x > 0 && x < width - 1) {
                outputNoise[y][x] -= noise[y][x + 1] - noise[y][x - 1];
                total += 2;
            }
            else if (x === 0) {
                outputNoise[y][x] -= noise[y][x + 1];
                total++;
            }
            else {
                outputNoise[y][x] -= noise[y][x - 1];
                total++;
            }
            outputNoise[y][x] = Math.abs(outputNoise[y][x]);
            outputNoise[y][x] /= total;
        }
    }
    return outputNoise;
}
function interpolate(x1, x2, alpha) {
    return x1 * (1 - alpha) + alpha * x2;
}
function generateSmoothNoise(whiteNoise, octave) {
    let smoothNoiseArr = [];
    const period = 1 << octave;
    const frequency = 1 / period;
    for (let y = 0; y < height; y++) {
        const sampleY = Math.trunc(y / period) * period;
        const wrapY = (sampleY + period) % width;
        const verticalBlend = (y - sampleY) * frequency;
        smoothNoiseArr[y] = [];
        for (let x = 0; x < width; x++) {
            const sampleX = Math.trunc(x / period) * period;
            const wrapX = (sampleX + period) % width;
            const horizontalBlend = (x - sampleX) * frequency;
            const top = interpolate(whiteNoise[sampleY][sampleX], whiteNoise[sampleY][wrapX], horizontalBlend);
            const bottom = interpolate(whiteNoise[wrapY][sampleX], whiteNoise[wrapY][wrapX], horizontalBlend);
            smoothNoiseArr[y][x] = interpolate(top, bottom, verticalBlend);
        }
    }
    return smoothNoiseArr;
}
function generatePerlinNoise(whiteNoise) {
    let smoothNoise = [];
    for (let i = 0; i < octaves; i++) {
        smoothNoise[i] = generateSmoothNoise(whiteNoise, i);
    }
    let perlinNoiseArr = [];
    let amplitude = 1;
    let totalAmplitude = 0;
    for (let octave = octaves - 1; octave >= 0; octave--) {
        //for(let octave = 0; octave <  octaves; octave++){
        amplitude *= persistence;
        totalAmplitude += amplitude;
        for (let i = 0; i < height; i++) {
            if (!perlinNoiseArr[i])
                perlinNoiseArr[i] = [];
            for (let j = 0; j < width; j++) {
                if (!perlinNoiseArr[i][j])
                    perlinNoiseArr[i][j] = 0;
                perlinNoiseArr[i][j] += smoothNoise[octave][i][j] * amplitude;
            }
        }
    }
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            perlinNoiseArr[i][j] /= totalAmplitude;
        }
    }
    return perlinNoiseArr;
}
