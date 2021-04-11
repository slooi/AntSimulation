// /*
// Purpose:
// - A collection of types that will be shared among different modules.
// - Requires import in order to create the type
// */
// import createRenderer from "../client/webgl";
// import createWorld from "../client/World";
// import createNetwork from "../client/Network";
// import createInputHandler from "../client/createInputHandler";
// import createWorld from "../client/World";

// // MAIN FUNCTIONS
// type Renderer = UnwrapPromise<ReturnType<typeof createRenderer>>;
// // type MainComps = {
// //     network: UnwrapPromise<ReturnType<typeof createNetwork>>;
// //     renderer: UnwrapPromise<ReturnType<typeof createRenderer>>;
// // };
// type playerComps = {
//     network: UnwrapPromise<ReturnType<typeof createNetwork>>;
//     renderer: UnwrapPromise<ReturnType<typeof createRenderer>>;
//     inputHandler: ReturnType<typeof createInputHandler>;
//     world: UnwrapPromise<ReturnType<typeof createWorld>>;
// };

// // HELPER FUNCTIONS
// type UnwrapPromise<T> = T extends PromiseLike<infer R> ? UnwrapPromise<R> : T;
