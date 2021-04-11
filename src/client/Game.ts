import ObjectManager from "./ObjectManager";
import Renderer from "./Renderer";

export default class Game {
    renderer: Renderer;
    objectManager: ObjectManager;
    constructor({ canvas }: GameDependencies) {
        this.renderer = new Renderer(canvas);
        this.objectManager = new ObjectManager(
            { width: canvas.width, height: canvas.height },
            this.renderer
        );
        this.loopInitialiser();
    }

    loopInitialiser() {
        let oldDate = new Date();
        const loop = () => {
            if (
                ((new Date() as unknown) as number) - ((oldDate as unknown) as number) >
                1000 / 30
            ) {
                this.renderer.clear();
                if (1) {
                    this.renderer.resetBuffer(this.objectManager.getNumberOfCells());
                    this.objectManager.update();
                    this.objectManager.render();
                } else {
                    this.renderer.resetBuffer(1);
                    this.renderer.addData(0, 0, 2, 50, 0, 10);
                    // this.renderer.addData(0, 50, 0, 255, 0, 10);
                    // this.renderer.addData(50, 50, 0, 0, 255, 10);
                }
                this.renderer.render();
                console.log("tick");

                oldDate = new Date();
            }
            requestAnimationFrame(loop);
        };
        loop();
        // setInterval(loop, 25);
    }
}
