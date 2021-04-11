import Game from "./Game";

console.log("Main.ts loaded");

/* DEPENDENCIES */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/* MAIN CODE */
const game = new Game({ canvas });
