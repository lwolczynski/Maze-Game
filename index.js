const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;
const margin = 0;

const engine = Engine.create();

const { world } = engine;

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const gridGen = (rows, columns) => {
    return {
        grid: Array(rows).fill(false).map(() => Array(columns).fill(false)),
        verticals: Array(rows).fill(false).map(() => Array(columns-1).fill(false)),   
        horizontals: Array(rows-1).fill(false).map(() => Array(columns).fill(false)),
        createPath(row=0, column=0) {
            if (this.grid[row][column]) {
                return;
            }
            this.grid[row][column] = true;
            console.log(row, column)
            const neighbors = [];
            for (cell of [[row-1, column, 'up'], [row+1, column, 'down'], [row, column-1, 'left'], [row, column+1, 'right']]) {
                if (cell[0]>=0 && cell[0]<rows) {
                    if (cell[1]>=0 && cell[1]<columns) {
                        if (this.grid[cell[0]][cell[1]] === false) {
                            neighbors.push(cell);
                        }
                    }
                }
            }
            const shuffledNeighbors = shuffle(neighbors);
            for (neighbor of shuffledNeighbors) {
                if (!this.grid[neighbor[0]][neighbor[1]]) {
                       switch(neighbor[2]) {
                        case 'up':
                            this.horizontals[row-1][column] = true;
                            break;
                        case 'down':
                            this.horizontals[row][column] = true;
                            break;
                        case 'left':
                            this.verticals[row][column-1] = true;
                            break;
                        case 'right':
                            this.verticals[row][column] = true;
                            break;
                    }
                }
                this.createPath(neighbor[0], neighbor[1]);
            }
        }
    }
}

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

// Borders
const walls = [
    Bodies.rectangle(width/2, 0, width, 2*margin, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 2*margin, {isStatic: true}),
    Bodies.rectangle(0, height/2, 2*margin, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 2*margin, height, {isStatic: true}),
];

World.add(world, walls);

cellsHorizontal = 30;
cellsVertical = 30;

const grid = gridGen(cellsHorizontal, cellsVertical);
grid.createPath();

grid.horizontals.forEach((row, rowIndex) => {
    row.forEach((pass, columnIndex) => {
        if (!pass) {
            const wall = Bodies.rectangle(
                (columnIndex+0.5)*(height/cellsHorizontal),
                (rowIndex+1)*(height/cellsHorizontal),
                height/cellsHorizontal,
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
                (columnIndex+1)*(width/cellsVertical),
                (rowIndex+0.5)*(width/cellsVertical),
                1,
                width/cellsVertical,
                {isStatic: true}
            );
            World.add(world, wall);
        }
    })
})

