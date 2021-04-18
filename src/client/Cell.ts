import { PheromoneType } from "./globalEnums";

const maxPheromones = 2000;
const normaliseTo255 = 255 / maxPheromones;

export default class Cell {
    x: number;
    y: number;
    food: number; // 0=> 255
    pheromones: number[]; // 0 => 2000
    isWall: boolean;
    isNest: boolean;
    numOfAnts: number;
    constructor(x: number, y: number, food: number, isNest: boolean) {
        this.x = x;
        this.y = y;
        this.food = food;
        this.pheromones = [0, 0];
        this.isWall = false;
        this.isNest = isNest;
        this.numOfAnts = 0;
        if (isNest === true) {
            console.log(this.x, this.y);
        }
    }
    hasAnt() {
        return this.numOfAnts > 0 ? true : false;
    }
    getAnts() {
        const val = this.numOfAnts * 50;
        if (val > maxPheromones) {
            return maxPheromones;
        }
        return val;
    }
    reduceAnt() {
        this.numOfAnts--;
        if (this.numOfAnts < 0) {
            throw new Error("ERROR: this.numOfAnts is < 0 somehow!");
        }
    }
    addAnt() {
        this.numOfAnts++;
    }

    addPheromones(type: PheromoneType, amount: number) {
        this.pheromones[type] += amount;
        if (this.pheromones[type] > maxPheromones) {
            this.pheromones[type] = maxPheromones;
        }
    }
    getPheromones(type: PheromoneType) {
        return ~~(this.pheromones[type] * normaliseTo255);
    }
    reducePheromones(): [number, number] {
        const reduceAmounts: [number, number] = [0, 0];
        for (let i = 0; i < this.pheromones.length; i++) {
            const reduceAmount = 1; //this.pheromones[i] / 1000;
            this.pheromones[i] -= reduceAmount; //+ 0.01;
            if (this.pheromones[i] < 0) {
                this.pheromones[i] = 0;
            } else {
                reduceAmounts[i] = reduceAmount;
            }
        }
        return reduceAmounts;
    }
    dissipate(pReduced: [number, number]) {
        for (let i = 0; i < this.pheromones.length; i++) {
            this.pheromones[i] += pReduced[i] / 10;
            if (this.pheromones[i] > maxPheromones) {
                this.pheromones[i] = maxPheromones;
            }
        }
    }
    hasFood() {
        return this.food > 0;
    }
    takeFood() {
        // this.food -= 5;
        if (this.food < 0) {
            throw new Error("ERROR: Cell somehow has negative food!");
        }
    }
}
