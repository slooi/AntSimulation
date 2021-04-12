/* 
Each cell of the grid wil have these properties:
1) pheromone 
2) ants
3) food
NOT colony

*/
import globalValues from "./globalValues";
import Ant from "./Ant";

export default class Grid {
    width: number;
    height: number;
    grid: Cell[][];
    cellWidth: number;
    cellHeight: number;
    numCellsX: number;
    numCellsY: number;
    constructor(widthHeight: WidthHeight) {
        this.width = widthHeight.width;
        this.height = widthHeight.height;
        this.numCellsX = this.width / globalValues.diaSize;
        this.numCellsY = this.height / globalValues.diaSize;
        this.cellWidth = globalValues.diaSize;
        this.cellHeight = globalValues.diaSize;
        this.grid = createGrid(widthHeight, { width: this.cellWidth, height: this.cellHeight });
    }
    getNumberOfCells() {
        return (this.width / this.cellWidth) * (this.height / this.cellHeight);
    }
    forEachRender(
        func: (x: number, y: number, r: number, g: number, b: number, size: number) => void
    ) {
        for (let y = 0; y < this.numCellsY; y++) {
            for (let x = 0; x < this.numCellsX; x++) {
                func(
                    x * this.cellWidth + this.cellWidth * 0.5,
                    y * this.cellHeight + this.cellHeight * 0.5,
                    Math.random() * 255,
                    Math.random() * 255,
                    Math.random() * 255,
                    255
                ); //!@#!@#!@# hardcoded
            }
        }
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
