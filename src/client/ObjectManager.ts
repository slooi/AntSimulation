import Ant from "./Ant";

export default class ObjectManager {
    ants: Ant[];
    constructor() {
        this.ants = [];
    }
    createAnts(point: Point, num: number) {
        for (let i = 0; i < num; i++) {
            this.ants.push(new Ant(point));
        }
    }
}
