import Grid from "./Grid";
import Cell from "./Cell";
import globalValues from "./globalValues";

export default class Ant {
    x: number;
    y: number;
    dir: number;
    hasFood: boolean;
    speed: number;
    grid: Grid;
    parentCell: Cell;
    constructor(grid: Grid, { x, y }: Point, dir: number) {
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.dir = dir;
        this.speed = globalValues.diaSize / 2;
        this.hasFood = false;
        this.parentCell = this.grid.getCell(this.x, this.y);
        this.parentCell.addAnt();
    }
    update() {
        // Update position
        this.dir += -0.5 + Math.random();
        this.x += this.speed * Math.cos(this.dir);
        this.y += this.speed * Math.sin(this.dir);

        // renders info into grid
        const newCell = this.grid.getCell(this.x, this.y);
        if (newCell !== this.parentCell) {
            // Update old parentCell
            this.parentCell.reduceAnt();

            // replace old parentCell and update new parentCell
            this.parentCell = newCell;
            this.parentCell.addAnt();
        }
    }
}
