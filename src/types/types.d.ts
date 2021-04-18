/* 
Purpose:
- A collection of types that will be shared among different modules.
- DOES NOT requires import in order to create the type
*/

/* 
COPY PASTE
*/
type ArrayLengthMutationKeys = "splice" | "push" | "pop" | "shift" | "unshift" | number;
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never;
type FixedLengthArray<T extends any[]> = Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>> & {
    [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>;
};

/* 
######## TYPES ##########
*/

type GameDependencies = {
    canvas: HTMLCanvasElement;
};

type Point = {
    x: number;
    y: number;
};

type WidthHeight = {
    width: number;
    height: number;
};

/* 
OLD
*/
declare module "*.glsl" {
    const text: string;
    export default text;
}
declare module "*.png";

type KeyDownType =
    | "`"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "0"
    | "-"
    | "="
    | "backspace"
    | "shift"
    | "+"
    | "_"
    | ")"
    | "("
    | "*"
    | "&"
    | "^"
    | "%"
    | "$"
    | "#"
    | "@"
    | "!"
    | "~"
    | "tab"
    | "capslock"
    | "control"
    | "meta"
    | "alt"
    | " "
    | "arrowdown"
    | "arrowup"
    | "arrowright"
    | "arrowleft"
    | "enter"
    | "\\"
    | "]"
    | "["
    | "|"
    | "}"
    | "{"
    | "q"
    | "w"
    | "e"
    | "r"
    | "t"
    | "y"
    | "u"
    | "i"
    | "o"
    | "p"
    | "a"
    | "s"
    | "d"
    | "f"
    | "g"
    | "h"
    | "j"
    | "k"
    | "l"
    | "z"
    | "x"
    | "c"
    | "v"
    | "b"
    | "n"
    | "m"
    | "|"
    | ""
    | ":"
    | "?"
    | ">"
    | "<"
    | "."
    | "/"
    | ";"
    | "numlock"
    | "pageup"
    | "home"
    | "clear"
    | "pagedown"
    | "end"
    | "insert"
    | "delete"
    | "'"
    | "escape";
