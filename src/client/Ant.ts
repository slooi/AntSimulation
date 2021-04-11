export default class Ant {
    x: any;
    y: any;
    hasFood: boolean;
    constructor({ x, y }: Point) {
        this.x = x;
        this.y = y;
        this.hasFood = false;
    }
    update() {}
    render() {
        // returns render info
    }
}
