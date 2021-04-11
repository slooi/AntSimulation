import Ant from "./Ant";
import Grid from "./Grid";
import Renderer from "./Renderer";

export default class ObjectManager {
    ants: Ant[];
    grid: Grid;
    renderer: Renderer;
    constructor(widthHeight: WidthHeight, renderer: Renderer) {
        this.ants = [];
        this.grid = new Grid(widthHeight);
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
    render() {
        this.grid.forEachRender(
            (x: number, y: number, r: number, g: number, b: number, size: number) => {
                this.renderer.addData(x, y, r, g, b, size);
            }
        );
    }
    getNumberOfCells() {
        return this.grid.getNumberOfCells();
    }

    // !@#!@#!@#!#@ REMEMBER, JUST GET THE GRIDS TO RENDER
}
