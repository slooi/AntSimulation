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
        this.createAnts({ x: 250, y: 250 }, 100000);
    }
    createAnts(point: Point, num: number) {
        for (let i = 0; i < num; i++) {
            const ant = new Ant(this.grid, point, 0);
            this.ants[i] = ant;
        }
    }
    update() {
        // Update objects
        for (let i = 0; i < this.ants.length; i++) {
            this.ants[i].update();
        }
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
