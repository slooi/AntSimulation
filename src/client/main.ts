import Game from "./Game";

console.log("Main.ts loaded");

/* DEPENDENCIES */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/* MAIN CODE */
const game = new Game({ canvas });

window.addEventListener("keydown", (e) => {
    if (e.key === "w") {
        game.speed = 10;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "w") {
        game.speed = 1;
    }
});
