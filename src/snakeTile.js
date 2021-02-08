import snakeTileSrc from './snakeTile.png';

const snakeTile = {
    image: new Image(),
    size: 64,
    blank: {x: 0, y: 0},
    apple: {x: 0, y: 1},
    headRight: {x: 1, y: 0},
    headDown: {x: 2, y: 0},
    headLeft: {x: 2, y: 1},
    headUp: {x: 1, y: 1},
    tailRight: {x: 3, y: 0},
    tailDown: {x: 4, y: 0},
    tailLeft: {x: 4, y: 1},
    tailUp: {x: 3, y: 1},
    bodyTopLeft: {x: 5, y: 0},
    bodyTopRight: {x: 6, y: 0},
    bodyDownRight: {x: 6, y: 1},
    bodyLeftDown: {x: 5, y: 1},
    bodyHorizontal: {x: 7, y: 0},
    bodyVertical: {x: 7, y: 1},
}

snakeTile.image.src = snakeTileSrc;

export default snakeTile;