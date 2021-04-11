import ObjectManager from "./ObjectManager";
import Renderer from "./Renderer";

export default class Game {
    renderer: Renderer;
    objectManager: ObjectManager;
    constructor({ canvas }: GameDependencies) {
        this.objectManager = new ObjectManager({ width: canvas.width, height: canvas.height });
        this.renderer = new Renderer(canvas);
        this.loopInitialiser();
    }

    loopInitialiser() {
        const loop = () => {
            console.log(10);
            // requestAnimationFrame(loop);
        };
        // loop();
        setInterval(loop, 100);
    }
}
