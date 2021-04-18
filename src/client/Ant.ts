import Grid from "./Grid";
import Cell from "./Cell";
import globalValues from "./globalValues";
import { PheromoneType } from "./globalEnums";

const numOfDirections = 24;
const diaSizeHalf = globalValues.diaSize * 0.5;
const initialPStrength = 300;

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
    searchForPheromones: PheromoneType;
    constructor(grid: Grid, { x, y }: Point, dir: number) {
        this.x = x - 5; //!@#!@#!@# remove later
        this.y = y - 5;
        this.oldX = this.x;
        this.oldY = this.y;
        this.grid = grid;
        this.dir = Math.PI * 2 * Math.random() || (45 / 180) * Math.PI || dir; //!@#!@#!@#
        this.speed = globalValues.diaSize * 1;
        this.hasFood = false;
        this.searchForPheromones = PheromoneType.TOFOOD;
        this.pStrenth = 0;

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

        // Recalcu

        this.updatePosition();
        // this.searchForPheromones = this.hasFood === true ? PheromoneType.TOHOME : PheromoneType.TOFOOD;

        // this.dir += (-5 / 180) * Math.PI + (10 / 180) * Math.PI * Math.random();	//!@#!@#

        // this.calcTurningAmount(this.hasFood);

        // Find the = cells infront of it to weight turn left/right/straight

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
                        this.searchForPheromones = PheromoneType.TOHOME;
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
        this.decreasePStrength();
    }
    decreasePStrength() {
        this.pStrenth -= 1.1;
        if (this.pStrenth < 0) {
            this.pStrenth = 0;
        }
    }
    returnedFood() {
        this.hasFood = false;
        this.searchForPheromones = PheromoneType.TOFOOD;
    }
    calcTurningAmount(hasFood: boolean) {
        this.searchForPheromones = hasFood === true ? PheromoneType.TOHOME : PheromoneType.TOFOOD;

        let cDir = Math.cos(this.dir);
        let sDir = Math.sin(this.dir);
        const [leftCell, frontCell, rightCell, relativePositions] = this.findFrontCells(cDir, sDir);
        // if (leftCell !== -1 || rightCell !== -1) {
        //     console.log("IT WORKS!");
        // }
        // if (rightCell !== -1) {
        //     rightCell.isNest = true;
        // }

        const pheromoneConcentration = getFrontPheromones(
            leftCell,
            frontCell,
            rightCell,
            this.searchForPheromones
        );

        const totalPheromone =
            pheromoneConcentration[0] + pheromoneConcentration[1] + pheromoneConcentration[2];

        // !@#!@#!@#!@#!@#  THIS SHOULD BE TRIGGER BY THE
        // ant who picked up food
        // ants who trying to find food when they touch line

        if (Math.random() < 1 / (1 + totalPheromone)) {
            // !@#!@#!@# the max of this is 255*3
            //!@#!@#!@# hyperparam
            // Wander
            // if (Math.random() < 0.01) {
            this.dir += (-15 / 180) * Math.PI + (30 / 180) * Math.PI * Math.random();
            // }

            cDir = Math.cos(this.dir);
            sDir = Math.sin(this.dir);

            this.x += this.speed * cDir;
            this.y += this.speed * sDir;
            // !@#!@#!@# add back in
        } else {
            // Lots of pheromones, follow A trail
            // console.log("MEEP");

            if (
                pheromoneConcentration[1] > pheromoneConcentration[0] &&
                pheromoneConcentration[1] > pheromoneConcentration[2]
            ) {
                // straight
                this.x += this.speed * cDir;
                this.y += this.speed * sDir;
            } else if (pheromoneConcentration[0] < pheromoneConcentration[2]) {
                // turn
                // right > left
                this.dir += (10 / 180) * Math.PI;
                cDir = Math.cos(this.dir);
                sDir = Math.sin(this.dir);

                this.x += this.speed * cDir;
                this.y += this.speed * sDir;
            } else if (pheromoneConcentration[2] < pheromoneConcentration[0]) {
                // turn
                // left > right
                this.dir -= (10 / 180) * Math.PI;
                cDir = Math.cos(this.dir);
                sDir = Math.sin(this.dir);

                this.x += this.speed * cDir;
                this.y += this.speed * sDir;
            } else {
                this.x += this.speed * cDir;
                this.y += this.speed * sDir;
            }

            // const random = Math.random() * totalPheromone;
            // if (random < pheromoneConcentration[0]) {
            //     console.log("<<<< LEFT");
            //     // LEFT CELL SELECTED
            //     // if (leftCell !== -1) {
            //     //     this.x = leftCell.x;
            //     //     this.y = leftCell.y;
            //     // }
            //     this.dir -= -(5 / 180) * Math.PI;

            //     cDir = Math.cos(this.dir);
            //     sDir = Math.sin(this.dir);

            //     // if(){
            //     // 	this.dir -= (15 / 180) * Math.PI;
            //     // 	cDir = Math.cos(this.dir);
            //     // 	sDir = Math.sin(this.dir);
            //     // }
            //     // if(Math.abs(relativePositions[0][0]) === 1 && Math.abs(relativePositions[0][1]) === 1){
            //     // 	// corners
            //     // }else{
            //     // 	// directly horizontal/vertical
            //     // }
            //     if (leftCell !== -1) {
            //         if (
            //             dis2(this.x, this.y, leftCell.x, leftCell.y) <
            //             dis2(this.x + cDir, this.y + sDir, leftCell.x, leftCell.y)
            //         ) {
            //             // console.log("LEFT BOOP");
            //             this.dir -= (15 / 180) * Math.PI;
            //             cDir = Math.cos(this.dir);
            //             sDir = Math.sin(this.dir);
            //         }
            //         this.x = leftCell.x;
            //         this.y = leftCell.y;

            //         this.dir = Math.atan2(leftCell.y - this.y, leftCell.x - this.x);
            //     }
            // } else if (random > pheromoneConcentration[0] + pheromoneConcentration[1]) {
            //     // RIGHT CELL SELECTED
            //     console.log("RIGHT >>>>");
            //     // if (rightCell !== -1) {
            //     //     this.x = rightCell.x;
            //     //     this.y = rightCell.y;
            //     // }
            //     this.dir += -(5 / 180) * Math.PI;

            //     cDir = Math.cos(this.dir);
            //     sDir = Math.sin(this.dir);

            //     // !@#!@#!@# might not be necessary
            //     if (rightCell !== -1) {
            //         if (
            //             dis2(this.x, this.y, rightCell.x, rightCell.y) <
            //             dis2(this.x + cDir, this.y + sDir, rightCell.x, rightCell.y)
            //         ) {
            //             // console.log("RIGHT BOOP");
            //             this.dir += (15 / 180) * Math.PI;
            //             cDir = Math.cos(this.dir);
            //             sDir = Math.sin(this.dir);
            //         }
            //         this.x = rightCell.x;
            //         this.y = rightCell.y;
            //         this.dir = Math.atan2(rightCell.y - this.y, rightCell.x - this.x);
            //     }
            // } else {
            //     console.log("MIDDLE");
            //     // MIDDLE
            // }
        }
    }
    updatePosition() {
        // PURPOSE: Updates steering AND x/y position

        // Get pheromones used to determine steering
        const pheromoneSum = this.getPheromones();

        // !@#!@#!@# Removed random chance
        // !@# Remember to actually call this function

        if (Math.random() < 0.1) {
            this.dir += (20 / 180) * Math.PI - (40 / 180) * Math.PI * Math.random();
        } else {
            // const pheromoneMag =
            //     pheromoneSum[0] * pheromoneSum[0] +
            //     pheromoneSum[1] * pheromoneSum[1] +
            //     pheromoneSum[2] * pheromoneSum[2];
            // const rand = pheromoneMag * Math.random();
            // if (rand < pheromoneSum[0] * pheromoneSum[0]) {
            //     this.dir -= ((2 + Math.random() * 20) / 180) * Math.PI;
            // } else if (
            //     rand >
            //     pheromoneSum[0] * pheromoneSum[0] + pheromoneSum[1] * pheromoneSum[1]
            // ) {
            //     this.dir += ((2 + Math.random() * 20) / 180) * Math.PI;
            // } else {
            // }
            if (pheromoneSum[1] > pheromoneSum[0] && pheromoneSum[1] < pheromoneSum[2]) {
                // forwards
            } else if (pheromoneSum[0] > pheromoneSum[2]) {
                // turn left
                this.dir -=
                    ((2 + Math.random() * 14) / 180) * Math.PI +
                    (5 / 180) * Math.PI -
                    (10 / 180) * Math.PI * Math.random();
            } else if (pheromoneSum[2] > pheromoneSum[0]) {
                // turn right
                this.dir +=
                    ((2 + Math.random() * 14) / 180) * Math.PI +
                    (5 / 180) * Math.PI -
                    (10 / 180) * Math.PI * Math.random();
            }
        }
        this.x += this.speed * Math.cos(this.dir);
        this.y += this.speed * Math.sin(this.dir);
    }

    getPheromones() {
        const frontIndices = this.getThreeOffsetsIndices();
        let pheromoneGroups = this.getThreeGroupsPheromones(frontIndices, this.searchForPheromones);
        // if (pheromoneGroups[0] + pheromoneGroups[1] + pheromoneGroups[2] < 1) {
        //     pheromoneGroups = this.getThreeGroupsPheromones(
        //         frontIndices,
        //         this.searchForPheromones === PheromoneType.TOFOOD
        //             ? PheromoneType.TOHOME
        //             : PheromoneType.TOFOOD
        //     );
        // }
        return pheromoneGroups;
    }
    getThreeGroupsPheromones(
        [leftIndices, frontIndices, rightIndices]: [
            [number, number],
            [number, number],
            [number, number]
        ],
        searchForPheromones: PheromoneType
    ): [number, number, number] {
        const leftPheromoneSum = this.getCellGroupPheromonesFromIndices(
            leftIndices,
            searchForPheromones
        );
        const fronPheromoneSum = this.getCellGroupPheromonesFromIndices(
            frontIndices,
            searchForPheromones
        );
        const rightPheromoneSum = this.getCellGroupPheromonesFromIndices(
            rightIndices,
            searchForPheromones
        );

        return [leftPheromoneSum, fronPheromoneSum, rightPheromoneSum];
    }
    getCellGroupPheromonesFromIndices(
        position: [number, number],
        searchForPheromones: PheromoneType
    ): number {
        // Given input indices ([xPosition,yPosition])
        // Returns 9 cells (8 surrounding cells, 1 cell including itself)
        let pheromoneSum: number = 0;
        for (let y = -4; y < 5; y++) {
            for (let x = -4; x < 5; x++) {
                const potentialCell = this.grid.getCellFromIndices(
                    position[0] + x,
                    position[1] + y
                );
                const pheromones =
                    potentialCell === -1 ? 0 : potentialCell.getPheromones(searchForPheromones);
                // console.log(this.searchForPheromones);
                pheromoneSum += pheromones;
            }
        }
        return pheromoneSum;
    }
    getThreeOffsetsIndices(): [[number, number], [number, number], [number, number]] {
        // Returns 3 2d coordinates
        const leftIndices = this.getOffsetIndices(this.dir-70/180*Math.PI,	5.75*globalValues.diaSize); // prettier-ignore
        const frontIndices = this.getOffsetIndices(this.dir, 				3 * globalValues.diaSize); // prettier-ignore
        const rightIndices = this.getOffsetIndices(this.dir+70/180*Math.PI,	5.75*globalValues.diaSize); // prettier-ignore
        return [leftIndices, frontIndices, rightIndices]; // [left,front,right]
    }
    getOffsetIndices(rads: number, offset: number) {
        return this.grid.getPotentialIndices(
            this.x + offset * Math.cos(rads),
            this.y + offset * Math.sin(rads)
        );
    }

    findFrontCells(
        cDir: number,
        sDir: number
    ): [Cell | -1, Cell | -1, Cell | -1, [number[], number[]]] {
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

        return [leftCell, frontCell, rightCell, relativePositions];
    }
}

// type Reoccur<T,Num,C = [] extends number[]> = C extends Num ? : ()

type Re<T, Num, C extends number[]> = T | (C extends Num ? never : Re<T, Num, [0, ...C]>);

function dis2(x1: number, y1: number, x2: number, y2: number) {
    return (x2 - x1) ** 2 - (y2 - y1) ** 2;
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
