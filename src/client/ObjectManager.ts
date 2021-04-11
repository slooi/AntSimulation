import Ant from "./Ant";
import Grid from "./Grid";

export default class ObjectManager {
    ants: Ant[];
    grid: Grid;
    constructor(widthHeight: WidthHeight) {
        this.ants = [];
        this.grid = new Grid(widthHeight);
    }
    createAnts(point: Point, num: number) {
        for (let i = 0; i < num; i++) {
            const ant = new Ant(point);
            this.ants.push(ant);
        }
    }
}
