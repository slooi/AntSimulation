/* 
Each cell of the grid wil have these properties:
1) pheromone 
2) ants
3) food
NOT colony

*/

import Ant from "./Ant";

export default class Grid {
    width: number;
    height: number;
    grid: Cell[][];
    cellWidth: number;
    cellHeight: number;
    constructor(widthHeight: WidthHeight, cellWidthHeight: WidthHeight) {
        this.width = widthHeight.width;
        this.height = widthHeight.height;
        this.cellWidth = cellWidthHeight.width;
        this.cellHeight = cellWidthHeight.height;
        this.grid = createGrid(widthHeight, { width: this.cellWidth, height: this.cellHeight });
    }
    getNumberOfCells() {
        return (this.width / this.cellWidth) * (this.height / this.cellHeight);
    }
}

function createGrid({ width, height }: WidthHeight, cellWidthHeight: WidthHeight): Cell[][] {
    // Check inputs are valid
    if (width % cellWidthHeight.width !== 0) {
        throw new Error("ERROR: invalid width and cell width");
    }
    if (height % cellWidthHeight.height !== 0) {
        throw new Error("ERROR: invalid height and cell height");
    }

    // Create grid
    // prettier-ignore
    const grid = new Array(height / cellWidthHeight.height)
        .fill(0)
        .map(
			(val) => new Array(width / cellWidthHeight.width).fill(0).map(
				(val) => new Cell()
			)
		);

    return grid;
}

class Cell {
    food: number;
    ants: Ant[];
    pheromones: number;
    isWall: boolean;
    constructor() {
        this.food = 0;
        this.ants = [];
        this.pheromones = 0;
        this.isWall = false;
    }
}
