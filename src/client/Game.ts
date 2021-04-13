import ObjectManager from "./ObjectManager";
import Renderer from "./Renderer";

export default class Game {
    renderer: Renderer;
    objectManager: ObjectManager;
    speed: number;
    constructor({ canvas }: GameDependencies) {
        this.speed = 1;
        this.renderer = new Renderer(canvas);
        this.objectManager = new ObjectManager(
            { width: canvas.width, height: canvas.height },
            this.renderer
        );
        this.renderer.setBuffer(this.objectManager.getNumberOfCells());
        this.loopInitialiser();
    }

    loopInitialiser() {
        let oldDate = new Date();
        let fps = 0;
        const loop = () => {
            if (((new Date() as unknown) as number) - ((oldDate as unknown) as number) > 1000) {
                console.log("fps:", fps);
                oldDate = new Date();
                fps = 0;
            }
            this.renderer.clear();
            this.renderer.resetBuffer();
            for (let i = 0; i < this.speed; i++) {
                this.objectManager.update();
            }
            this.objectManager.render();
            this.renderer.render();
            fps++;

            requestAnimationFrame(loop);
        };
        loop();
        // setInterval(loop, 25);
    }
}
