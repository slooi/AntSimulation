export default class Ant {
    x: number;
    y: number;
    dir: number;
    hasFood: boolean;
    constructor({ x, y }: Point, dir: number) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.hasFood = false;
    }
    update() {}
    render() {
        // returns render info
    }
}
