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
    oldX: number;
    oldY: number;
    constructor(grid: Grid, { x, y }: Point, dir: number) {
        this.x = x;
        this.y = y;
        this.oldX = this.x;
        this.oldY = this.y;
        this.grid = grid;
        this.dir = Math.random() * 24; //!@#!@#!@#
        this.speed = globalValues.diaSize;
        this.hasFood = false;
        const parentCell = this.grid.getCell(this.x, this.y);
        if (parentCell === -1) {
            throw new Error("ERROR: you can't spawn ants outside boundary!");
        }
        this.parentCell = parentCell;
        this.parentCell.addAnt();
    }
    update() {
        // Update position
        this.oldX = this.x;
        this.oldY = this.y;

        // this.dir += Math.PI * 2 * Math.random();
        // this.x += this.speed * Math.cos(this.dir);
        // this.y += this.speed * Math.sin(this.dir);

        if (Math.random() > 0.9) {
            this.dir += 1 + Math.random() * -2;
        }
        if (this.dir < 0) {
            this.dir = 24 + this.dir;
        } else {
            this.dir %= 24;
        }
        this.x += this.speed * angleXY[~~this.dir][0];
        this.y += this.speed * angleXY[~~this.dir][1];

        // renders info into grid
        const newCell = this.grid.getCell(this.x, this.y);
        if (newCell === -1) {
            // Outside grid
            this.x = this.oldX;
            this.y = this.oldY;

            // this.dir += 3.1416;
            this.dir += 12;
            this.dir %= 24;
        } else {
            // Inside grid
            if (newCell !== this.parentCell) {
                // Update old parentCell
                this.parentCell.reduceAnt();

                // replace old parentCell and update new parentCell
                this.parentCell = newCell;
                this.parentCell.addAnt();
            }
        }
    }
}

const angleXY = [
    [1.0, 0.0],
    [0.9659258262890683, 0.2588190451025207],
    [0.8660254037844387, 0.4999999999999999],
    [0.7071067811865476, 0.7071067811865476],
    [0.5000000000000001, 0.8660254037844386],
    [0.2588190451025207, 0.9659258262890683],
    [0.0000000000000001, 1.0],
    [-0.2588190451025209, 0.9659258262890683],
    [-0.4999999999999998, 0.8660254037844387],
    [-0.7071067811865475, 0.7071067811865476],
    [-0.8660254037844387, 0.4999999999999999],
    [-0.9659258262890682, 0.258819045102521],
    [-1.0, 0.0000000000000001],
    [-0.9659258262890684, -0.2588190451025204],
    [-0.8660254037844386, -0.5000000000000001],
    [-0.7071067811865477, -0.7071067811865475],
    [-0.5000000000000004, -0.8660254037844385],
    [-0.2588190451025206, -0.9659258262890683],
    [-0.0000000000000002, -1.0],
    [0.2588190451025203, -0.9659258262890684],
    [0.5000000000000001, -0.8660254037844386],
    [0.7071067811865474, -0.7071067811865477],
    [0.8660254037844384, -0.5000000000000004],
    [0.9659258262890683, -0.2588190451025207],
];
// 360

// 0=>6.28
