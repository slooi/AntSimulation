import Game from "./Game";

console.log("Main.ts loaded");

/* DEPENDENCIES */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/* MAIN CODE */
const game = new Game({ canvas });

window.addEventListener("keydown", (e) => {
    // Note pheromones dissapear only in render stage
    // game.speed does NOT make the rander stage run more. So pheromones won't be reduced as much per tick
    if (e.key === "w") {
        if (game.speed === 1) {
            game.speed = 100;
            console.log("FAST FORWARDS!");
        } else {
            game.speed = 1;
            console.log("BACK TO NORMAL");
        }
    }
});
