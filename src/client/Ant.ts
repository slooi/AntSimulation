import Grid from "./Grid";
import Cell from "./Cell";
import globalValues from "./globalValues";
import { PheromoneType } from "./globalEnums";

const numOfDirections = 24;
const diaSizeHalf = globalValues.diaSize * 0.5;
const initialPStrength = 200;

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
    pStrenth: number;
    constructor(grid: Grid, { x, y }: Point) {
        this.x = x;
        this.y = y;
        this.oldX = this.x;
        this.oldY = this.y;
        this.grid = grid;
        this.dir = Math.random() * 2 * Math.PI; //!@#!@#!@#
        this.speed = globalValues.diaSize;
        this.hasFood = false;
        this.pStrenth = initialPStrength;
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

        // this.dir += (-5 / 180) * Math.PI + (10 / 180) * Math.PI * Math.random();	//!@#!@#
        const cDir = Math.cos(this.dir);
        const sDir = Math.sin(this.dir);

        // Find the = cells infront of it to weight turn left/right/straight
        this.calcTurningAmount(cDir, sDir, this.hasFood);

        this.x += this.speed * cDir;
        this.y += this.speed * sDir;

        // if (Math.random() > 0.9) {
        //     this.dir += 1 + Math.random() * -2;
        // }
        // if (this.dir < 0) {
        //     this.dir = numOfDirections + this.dir;
        // } else {
        //     this.dir %= numOfDirections;
        // }
        // this.x += this.speed * angleXY[~~this.dir][0];
        // this.y += this.speed * angleXY[~~this.dir][1];

        // renders info into grid
        const newCell = this.grid.getCell(this.x, this.y);
        if (newCell === -1) {
            // Outside grid
            this.x = this.oldX;
            this.y = this.oldY;

            this.dir += 3.1416;
            // this.dir += numOfDirections * 0.5;
            // this.dir %= numOfDirections;
        } else {
            // Inside grid
            if (newCell !== this.parentCell) {
                // Update old parentCell
                this.parentCell.reduceAnt();

                // replace old parentCell and update new parentCell
                this.parentCell = newCell;
                this.parentCell.addAnt();

                /* NOTE THIS WILL CAUSE PROBLEMS (only initially/if the map is only 1 pixel which it wouldn't be) */
                /* - if the nest is made on food the food won't be collected until later */
                /* Nah, it's fine */
                if (!this.hasFood) {
                    this.hasFood = this.parentCell.hasFood();
                    if (this.hasFood) {
                        this.parentCell.takeFood();
                        this.pStrenth = initialPStrength;
                    } else {
                        this.parentCell.addPheromones(PheromoneType.TOHOME, ~~this.pStrenth);
                    }
                } else {
                    this.parentCell.addPheromones(PheromoneType.TOFOOD, ~~this.pStrenth);
                }
                if (this.parentCell.isNest) {
                    if (this.hasFood) {
                        this.returnedFood();
                    }
                    // optimize this later
                    this.pStrenth = initialPStrength;
                }
            }
        }
        if (this.pStrenth > 0) {
            this.pStrenth -= 1;
        }
    }
    returnedFood() {
        this.hasFood = false;
    }
    calcTurningAmount(cDir: number, sDir: number, hasFood: boolean) {
        const [leftCell, frontCell, rightCell] = this.findFrontCells(cDir, sDir);
        // if (leftCell !== -1 || rightCell !== -1) {
        //     console.log("IT WORKS!");
        // }
        // if (rightCell !== -1) {
        //     rightCell.isNest = true;
        // }
        const pheromoneType = hasFood === true ? PheromoneType.TOHOME : PheromoneType.TOFOOD;

        const pheromoneConcentration = getFrontPheromones(
            leftCell,
            frontCell,
            rightCell,
            pheromoneType
        );

        const totalPheromone =
            pheromoneConcentration[0] + pheromoneConcentration[1] + pheromoneConcentration[2];

        // !@#!@#!@#!@#!@#  THIS SHOULD BE TRIGGER BY THE
        // ant who picked up food
        // ants who trying to find food when they touch line

        if (Math.random() < 1 / (1 + totalPheromone)) {
            //!@#!@#!@# hyperparam
            // Wander
            this.dir += (-15 / 180) * Math.PI + (30 / 180) * Math.PI * Math.random();
        } else {
            // Lots of pheromones, follow A trail
            // console.log("MEEP");
            const random = Math.random() * totalPheromone;
            if (random < pheromoneConcentration[0]) {
                // console.log("<<<< LEFT");
                // LEFT
                // if (leftCell !== -1) {
                //     this.x = leftCell.x;
                //     this.y = leftCell.y;
                // }
                this.dir -= (5 / 180) * Math.PI;
            } else if (random > pheromoneConcentration[0] + pheromoneConcentration[1]) {
                // console.log("RIGHT >>>>");
                // RIGHT
                // if (rightCell !== -1) {
                //     this.x = rightCell.x;
                //     this.y = rightCell.y;
                // }
                this.dir += (5 / 180) * Math.PI;
            } else {
                // console.log("MIDDLE");
                // MIDDLE
            }
        }
    }
    findFrontCells(cDir: number, sDir: number): Array<Cell | -1> {
        // Finds the cells infront of the direction the ant is facing

        // WATCH OUT FOR OUT OF GRID OR WALLS or food?
        // globalValues.diaSize;
        const frontCellIndices = this.grid.getPotentialIndices(
            this.parentCell.x + globalValues.diaSize * cDir,
            this.parentCell.y + globalValues.diaSize * sDir
        );
        const diff: [number, number] = [
            frontCellIndices[0] - (this.parentCell.x - diaSizeHalf),
            frontCellIndices[1] - (this.parentCell.y - diaSizeHalf),
        ];

        const hasZeroOnX = diff[0] === 0;
        const hasZeroOnY = diff[1] === 0;
        let relativePositions: [number[], number[]] = [
            [diff[0], diff[1]],
            [diff[0], diff[1]],
        ];

        // Find left and right cells relative to front
        if (hasZeroOnX) {
            // Has zero 0th index (x)
            relativePositions[0][0] = 1 * diff[1];
            relativePositions[1][0] = -1 * diff[1];
        } else if (hasZeroOnY) {
            // Has zero 1st index (y)
            relativePositions[0][1] = -1 * diff[0];
            relativePositions[1][1] = 1 * diff[0];
        } else {
            // Doesn't have zero
            if (diff[0] * diff[1] === 1) {
                relativePositions[0][1] = 0;
                relativePositions[1][0] = 0;
            } else {
                relativePositions[0][0] = 0;
                relativePositions[1][1] = 0;
            }
        }

        // Retrive potential cell
        const frontCell = this.grid.getCellFromIndices(frontCellIndices[0], frontCellIndices[1]);
        const leftCell = this.grid.getCellFromIndices(
            frontCellIndices[0] + relativePositions[0][0],
            frontCellIndices[1] + relativePositions[0][1]
        );
        const rightCell = this.grid.getCellFromIndices(
            frontCellIndices[0] + relativePositions[1][0],
            frontCellIndices[1] + relativePositions[1][1]
        );

        return [leftCell, frontCell, rightCell];
    }
}

function getFrontPheromones(
    leftCell: Cell | -1,
    frontCell: Cell | -1,
    rightCell: Cell | -1,
    type: PheromoneType
): [number, number, number] {
    return [
        getSinglePheromone(leftCell, type),
        getSinglePheromone(frontCell, type),
        getSinglePheromone(rightCell, type),
    ];
}

function getSinglePheromone(cell: Cell | -1, type: PheromoneType) {
    return cell === -1 ? 0 : cell.getPheromones(type);
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
