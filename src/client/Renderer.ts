import vsource from "./glsl/vsource.glsl";
import fsource from "./glsl/fsource.glsl";

export default class Renderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    data: number[];
    dataBuffer: WebGLBuffer;
    offset: number;
    buffer: ArrayBuffer;
    float: Float32Array;
    uint: Uint8Array;
    constructor(canvas: HTMLCanvasElement) {
        this.offset = 0;

        canvas.width = 500;
        canvas.height = 500;
        this.canvas = canvas;
        const gl = canvas.getContext("webgl");
        if (!gl) {
            throw new Error("ERROR: gl === null");
        }
        this.gl = gl;

        // viewport
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // programs
        const program = buildProgram(gl);
        gl.useProgram(program);

        // locations
        const attribLocations: { [key: string]: number } = {};
        for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES); i++) {
            const attrib = gl.getActiveAttrib(program, i);
            if (!attrib) {
                throw new Error(`ERROR: attrib is undefined. i ${i}`);
            }
            const attribName = attrib.name;
            attribLocations[attribName] = gl.getAttribLocation(program, attribName);
        }

        const uniformLocations: { [text: string]: WebGLUniformLocation } = {};
        for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {
            const uniform = gl.getActiveUniform(program, i);
            if (!uniform) {
                throw new Error(`ERROR: attrib is undefined. i ${i}`);
            }
            const uniformName = uniform.name;
            const loc = gl.getUniformLocation(program, uniformName);
            if (!loc) {
                throw new Error(`ERROR: loc is null. i is ${i}`);
            }
            uniformLocations[uniformName] = loc;
        }

        // data
        this.data = [
            //X	Y
            0,
            0.5,
        ];

        this.buffer = new ArrayBuffer(4 + 4 + 4);
        this.float = new Float32Array(this.buffer);
        this.uint = new Uint8Array(this.buffer);

        this.float[0] = 0.5; // 4 bytes
        this.float[1] = 0.5; // 4 bytes
        // float[2] = 123123123123; // 4 bytes
        console.log(this.float);
        this.uint[2 * 4 + 0] = 0; // 1 byte
        this.uint[2 * 4 + 1] = 255; // 1 byte
        this.uint[2 * 4 + 2] = 255; // 1 byte
        this.uint[2 * 4 + 3] = 255; // 1 byte
        console.log(this.uint);

        // buffer
        this.dataBuffer = buildBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.dataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.float, gl.STATIC_DRAW);

        // pointer
        gl.vertexAttribPointer(
            attribLocations.a_Position,
            2,
            gl.FLOAT,
            false,
            Uint8Array.BYTES_PER_ELEMENT * 12,
            Uint8Array.BYTES_PER_ELEMENT * 0
        );
        gl.enableVertexAttribArray(attribLocations.a_Position);
        gl.vertexAttribPointer(
            attribLocations.a_ColorNSize,
            4,
            gl.UNSIGNED_BYTE,
            false,
            Uint8Array.BYTES_PER_ELEMENT * 12,
            Uint8Array.BYTES_PER_ELEMENT * 8
        );
        gl.enableVertexAttribArray(attribLocations.a_ColorNSize);

        // draw
        gl.drawArrays(gl.POINTS, 0, this.data.length / 2);

        // texture

        // framebuffer
    }
    resetBuffer(vertices: number) {
        this.buffer = new ArrayBuffer(vertices * 12);
        this.float = new Float32Array(this.buffer);
        this.uint = new Uint8Array(this.buffer);
        this.offset = 0;
    }
    addData(x: number, y: number, r: number, g: number, b: number, size: number) {
        this.float[this.offset] = x;
        this.float[this.offset + 4] = y;
        this.float[this.offset + 8] = r;
        this.float[this.offset + 9] = g;
        this.float[this.offset + 10] = b;
        this.float[this.offset + 11] = size;

        this.offset += 12;
    }
    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.POINTS, 0, this.offset / 12);
    }
}

/* 

*/
function buildBuffer(gl: WebGLRenderingContext) {
    const buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error("ERROR: during createBuffer.");
    }
    return buffer;
}

function buildShader(gl: WebGLRenderingContext, source: string, type: number) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error(`ERROR: error during createShader.`);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
            `ERROR: compiling shader with source: ${source}. Info: ${gl.getShaderInfoLog(shader)}`
        );
    } else {
        console.log("Shader compiled properly!");
    }
    return shader;
}

function buildProgram(gl: WebGLRenderingContext) {
    const program = gl.createProgram();
    if (!program) {
        throw new Error(`ERROR: error during createProgram.`);
    }
    gl.attachShader(program, buildShader(gl, vsource, gl.VERTEX_SHADER));
    gl.attachShader(program, buildShader(gl, fsource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`ERROR: linking program. Info: ${gl.getProgramInfoLog(program)}`);
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        throw new Error(`ERROR: validate program. Info: ${gl.getProgramInfoLog(program)}`);
    }
    return program;
}
