/* 
Each cell of the grid wil have these properties:
1) pheromone 
2) ants
3) food
NOT colony

*/
import globalValues from "./globalValues";
import Ant from "./Ant";
import Cell from "./Cell";
import { PheromoneType } from "./globalEnums";

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
                const cell = this.grid[y][x];

                // prettier-ignore
                if (cell.isWall){
					func(
						cell.x, 
						cell.y, 
						0.8,
						0.8,
						0.8,
						255
					); //!@#!@#!@# hardcoded
				}else{
					func(
						cell.x, 
						cell.y, 
						clampTo255((cell.hasAnt() as unknown as number)*255+(cell.isNest as unknown as number)*255), 
						cell.food, 
						(cell.getPheromones(PheromoneType.TOHOME) as unknown as number), 
						(cell.getPheromones(PheromoneType.TOFOOD) as unknown as number)
					); //!@#!@#!@# hardcoded
				}
                cell.reducePheromones();
            }
        }
    }
    getCell(x: number, y: number): Cell | -1 {
        // Converts x and y positions into cell index x and y
        /* 
			RETURNS:
				-1 => outside grid
				Cell => cell ant is inside
		*/

        const [xIndex, yIndex] = this.getPotentialIndices(x, y);
        if (xIndex < 0 || yIndex < 0 || xIndex >= this.numCellsX || yIndex >= this.numCellsY) {
            return -1;
        }
        return this.grid[yIndex][xIndex];
    }
    getPotentialIndices(x: number, y: number): [number, number] {
        return [Math.floor(x / this.cellWidth), Math.floor(y / this.cellHeight)];
    }
    getCellFromIndices(xIndex: number, yIndex: number) {
        if (xIndex < 0 || yIndex < 0 || xIndex >= this.numCellsX || yIndex >= this.numCellsY) {
            return -1;
        }
        return this.grid[yIndex][xIndex];
    }
}

function clampTo255(x: number) {
    return x > 255 ? 255 : x;
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
    const numCellsX = width / cellWidthHeight.width;
    const numCellsY = height / cellWidthHeight.height;
    const cellWidth = cellWidthHeight.width;
    const cellHeight = cellWidthHeight.height;

    const nestX = ~~(width / 2);
    const nestY = ~~(height / 2);
    const nestW = 10;
    const nestH = 10;

    const foodX = nestX + 20;
    const foodY = nestY + 20;
    const foodW = 10;
    const foodH = 10;

    const grid: Cell[][] = new Array(numCellsY).fill(0);
    for (let y = 0; y < numCellsY; y++) {
        grid[y] = new Array(numCellsX);
        for (let x = 0; x < numCellsX; x++) {
            const xPos = x * cellWidth + cellWidth * 0.5;
            const yPos = y * cellHeight + cellHeight * 0.5;
            if (x > nestX && y > nestY && x < nestX + nestW && y < nestH + nestY) {
                // Optimize by taking out later

                grid[y][x] = new Cell(xPos, yPos, 0, true);
            } else {
                if (x > foodX && y > foodY && x < foodX + foodW && y < foodY + foodH) {
                    grid[y][x] = new Cell(xPos, yPos, 255, false);
                } else {
                    grid[y][x] = new Cell(xPos, yPos, 0, false);
                }
            }
        }
    }

    // const grid = new Array(height / cellWidthHeight.height)
    //     .fill(0)
    //     .map((val) => new Array(width / cellWidthHeight.width).fill(0).map((val) => new Cell()));

    return grid;
}
