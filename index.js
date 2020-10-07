import { gridGen } from './grid_generator.js';

const { Engine, Render, Runner, World, Bodies } = Matter;

const margin = 10;
const width = 600+2*margin;
const height = 600+2*margin;

const engine = Engine.create();

const { world } = engine;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Add borders to canvas
const walls = [
    Bodies.rectangle(width/2, 0, width, 2*margin, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 2*margin, {isStatic: true}),
    Bodies.rectangle(0, height/2, 2*margin, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 2*margin, height, {isStatic: true}),
];

World.add(world, walls);

const cellsHorizontal = 30;
const cellsVertical = 30;

const grid = gridGen(cellsHorizontal, cellsVertical);
grid.createPath();

grid.horizontals.forEach((row, rowIndex) => {
    row.forEach((pass, columnIndex) => {
        if (!pass) {
            const wall = Bodies.rectangle(
                (columnIndex+0.5)*((height-2*margin)/cellsHorizontal)+margin,
                (rowIndex+1)*((height-2*margin)/cellsHorizontal)+margin,
                (height-2*margin)/cellsHorizontal,
                1,
                {isStatic: true}
            );
            World.add(world, wall);
        }
    })
})

grid.verticals.forEach((row, rowIndex) => {
    row.forEach((pass, columnIndex) => {
        if (!pass) {
            const wall = Bodies.rectangle(
                (columnIndex+1)*((width-2*margin)/cellsVertical)+margin,
                (rowIndex+0.5)*((width-2*margin)/cellsVertical)+margin,
                1,
                (width-2*margin)/cellsVertical,
                {isStatic: true}
            );
            World.add(world, wall);
        }
    })
})

