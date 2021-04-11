import Ant from "./Ant";
import Grid from "./Grid";
import Renderer from "./Renderer";

export default class ObjectManager {
    ants: Ant[];
    grid: Grid;
    renderer: Renderer;
    constructor(widthHeight: WidthHeight, renderer: Renderer) {
        this.ants = [];
        this.grid = new Grid(widthHeight, { width: 10, height: 10 });
        this.renderer = renderer;
    }
    createAnts(point: Point, num: number) {
        for (let i = 0; i < num; i++) {
            const ant = new Ant(point, 0);
            this.ants.push(ant);
        }
    }
    update() {
        // Update objects
        this.ants.forEach((ant) => {
            ant.update();
        });
    }
    getNumberOfCells() {
        return this.grid.getNumberOfCells();
    }

    // !@#!@#!@#!#@ REMEMBER, JUST GET THE GRIDS TO RENDER
}
