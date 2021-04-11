/* 
Each cell of the grid wil have these properties:
1) pheromone 
2) ants
3) food
NOT colony

*/

export default class Grid {
    width: number;
    height: number;
    constructor({ width, height }: WidthHeight) {
        this.width = width;
        this.height = height;
    }
}
