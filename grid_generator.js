import { shuffle } from './utils.js';

export const gridGen = (rows, columns) => {
    return {
        grid: Array(rows).fill(false).map(() => Array(columns).fill(false)),
        verticals: Array(rows).fill(false).map(() => Array(columns-1).fill(false)),   
        horizontals: Array(rows-1).fill(false).map(() => Array(columns).fill(false)),
        createPath(row=0, column=0) {
            if (this.grid[row][column]) {
                return;
            }
            this.grid[row][column] = true;
            const neighbors = [];
            for (let cell of [[row-1, column, 'up'], [row+1, column, 'down'], [row, column-1, 'left'], [row, column+1, 'right']]) {
                if (cell[0]>=0 && cell[0]<rows) {
                    if (cell[1]>=0 && cell[1]<columns) {
                        if (this.grid[cell[0]][cell[1]] === false) {
                            neighbors.push(cell);
                        }
                    }
                }
            }
            const shuffledNeighbors = shuffle(neighbors);
            for (let neighbor of shuffledNeighbors) {
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