import * as Config from './config.js';
import { gridGen } from './grid_generator.js';

const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create();

// Disable gravity
engine.world.gravity.y = 0;

const { world } = engine;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: Config.width,
        height: Config.height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Add borders to canvas

const walls = [
    Bodies.rectangle(Config.width/2, 0, Config.width, 2*Config.margin, {isStatic: true}),
    Bodies.rectangle(Config.width/2, Config.height, Config.width, 2*Config.margin, {isStatic: true}),
    Bodies.rectangle(0, Config.height/2, 2*Config.margin, Config.height, {isStatic: true}),
    Bodies.rectangle(Config.width, Config.height/2, 2*Config.margin, Config.height, {isStatic: true}),
];

World.add(world, walls);

// Generate grid

const grid = gridGen(Config.cellsHorizontal, Config.cellsVertical);
grid.createPath();

grid.horizontals.forEach((row, rowIndex) => {
    row.forEach((pass, columnIndex) => {
        if (!pass) {
            const wall = Bodies.rectangle(
                (columnIndex+0.5)*((Config.width-2*Config.margin)/Config.cellsVertical)+Config.margin,
                (rowIndex+1)*((Config.height-2*Config.margin)/Config.cellsHorizontal)+Config.margin,
                (Config.width-2*Config.margin)/Config.cellsVertical,
                3,
                {
                    isStatic: true,
                    label: 'wall',
                }
            );
            World.add(world, wall);
        }
    })
})

grid.verticals.forEach((row, rowIndex) => {
    row.forEach((pass, columnIndex) => {
        if (!pass) {
            const wall = Bodies.rectangle(
                (columnIndex+1)*((Config.width-2*Config.margin)/Config.cellsVertical)+Config.margin,
                (rowIndex+0.5)*((Config.height-2*Config.margin)/Config.cellsHorizontal)+Config.margin,
                3,
                (Config.height-2*Config.margin)/Config.cellsHorizontal,
                {
                    isStatic: true,
                    label: 'wall',
                }
            );
            World.add(world, wall);
        }
    })
})

// Draw goal

const goal = Bodies.circle(
    (Config.width-2*Config.margin)/Config.cellsVertical*(Config.cellsVertical-0.5)+Config.margin,
    (Config.height-2*Config.margin)/Config.cellsHorizontal*(Config.cellsHorizontal-0.5)+Config.margin,
    Math.min(
        0.4*(Config.width-2*Config.margin)/Config.cellsVertical,
        0.4*(Config.height-2*Config.margin)/Config.cellsHorizontal
    ),
    {
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green'
        }
    }
);

World.add(world, goal);

// Draw player

const player = Bodies.circle(
    (Config.width-2*Config.margin)/Config.cellsVertical*0.5+Config.margin,
    (Config.height-2*Config.margin)/Config.cellsHorizontal*0.5+Config.margin,
    Math.min(
        0.4*(Config.width-2*Config.margin)/Config.cellsVertical,
        0.4*(Config.height-2*Config.margin)/Config.cellsHorizontal
    ),
    {
        label: 'player',
        render: {
            fillStyle: 'red'
        }
    }
);

World.add(world, player);

document.addEventListener('keydown', event => {
    const { x, y } = player.velocity;
    switch(event.code) {
        case 'KeyD':
            const a = Math.min(x+2, 5);
            Body.setVelocity(player, { x: a, y });
            break;
        case 'KeyS':
            const b = Math.min(y+2, 5);
            Body.setVelocity(player, { x, y: b });
            break;
        case 'KeyW':
            const c = Math.max(y-2, -5);
            Body.setVelocity(player, { x, y: c });
            break;
        case 'KeyA':
            const d = Math.max(x-2, -5);
            Body.setVelocity(player, { x: d, y });
            break;
    };
    if (x>5) Body.setVelocity(player, { x: 5, y });
    if (y>5) Body.setVelocity(player, { x, y: 5 });
});

// Win indetification

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['player', 'goal'];
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    })
})