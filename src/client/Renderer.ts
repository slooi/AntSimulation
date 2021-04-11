import vsource from "./glsl/vsource.glsl";
import fsource from "./glsl/fsource.glsl";

export default class Renderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    data: number[];
    dataBuffer: WebGLBuffer;
    constructor(canvas: HTMLCanvasElement) {
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

        const buffer = new ArrayBuffer(4 + 4 + 4);
        const float = new Float32Array(buffer);
        const uint = new Uint8Array(buffer);

        float[0] = 0.5; // 4 bytes
        float[1] = 0.5; // 4 bytes
        // float[2] = 123123123123; // 4 bytes
        console.log(float);
        uint[2 * 4 + 0] = 0; // 1 byte
        uint[2 * 4 + 1] = 255; // 1 byte
        uint[2 * 4 + 2] = 255; // 1 byte
        uint[2 * 4 + 3] = 255; // 1 byte
        console.log(uint);

        // buffer
        this.dataBuffer = buildBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.dataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, float, gl.STATIC_DRAW);

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
            attribLocations.a_Color,
            4,
            gl.UNSIGNED_BYTE,
            false,
            Uint8Array.BYTES_PER_ELEMENT * 12,
            Uint8Array.BYTES_PER_ELEMENT * 8
        );
        gl.enableVertexAttribArray(attribLocations.a_Color);

        // draw
        gl.drawArrays(gl.POINTS, 0, this.data.length / 2);

        // texture

        // framebuffer
    }
    render(data: number) {}
    setup() {}
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
