export default class Cell {
    x: number;
    y: number;
    food: number; // 0=> 255
    pheromones: number; // 0 => 255
    isWall: boolean;
    numOfAnts: number;
    constructor(x: number, y: number, food: number) {
        this.x = x;
        this.y = y;
        this.food = food;
        this.pheromones = 0;
        this.isWall = false;
        this.numOfAnts = 0;
    }
    hasAnt() {
        return this.numOfAnts > 0 ? true : false;
    }
    getAnts() {
        const val = this.numOfAnts * 50;
        if (val > 255) {
            return 255;
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

    addPheromones() {
        this.pheromones += 1;
        if (this.pheromones > 255) {
            this.pheromones = 255;
        }
    }
    reducePheromones() {
        if (this.pheromones > 0) {
            this.pheromones--;
        }
    }
    hasFood() {
        return this.food > 0;
    }
    takeFood() {
        this.food -= 5;
        if (this.food < 0) {
            throw new Error("ERROR: Cell somehow has negative food!");
        }
    }
}
