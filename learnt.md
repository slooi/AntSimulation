How to tightly pack:
https://stackoverflow.com/questions/9583426/packing-data-in-webgl-float64-int64arrays-in-chrome

```
var floatBuffer = new Float32Array(verts.length * 4);
var byteBuffer = new Uint8Array(floatBuffer); // View the floatBuffer as bytes

for(i = 0; i < verts.length; ++i) {
    floatBuffer[i * 4 + 0] = verts.x;
    floatBuffer[i * 4 + 1] = verts.y;
    floatBuffer[i * 4 + 2] = verts.z;

    // RGBA values expected as 0-255
    byteBuffer[i * 16 + 12] = verts.r;
    byteBuffer[i * 16 + 13] = verts.g;
    byteBuffer[i * 16 + 14] = verts.b;
    byteBuffer[i * 16 + 15] = verts.a;
}

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, floatBuffer, gl.STATIC_DRAW);


gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(attributes.aPosition, 3, gl.FLOAT, false, 16, 0);
gl.vertexAttribPointer(attributes.aColor, 4, gl.UNSIGNED_BYTE, false, 16, 12);
```

2ND - GMAN!!
source: https://stackoverflow.com/questions/21537721/array-buffer-not-working-with-webgl

```
var buffer = new ArrayBuffer(nbrOfVertices * 16);
var floatView = new Float32Array(buffer);
var uint8View = new Uint8Array(buffer);

for (var j = 0; j < nbrOfVertices; ++j) {
  var floatVertexOffset = j * 4;
  floatView[floatVertexOffset + 0] = meshVertexPositions[?? + 0];
  floatView[floatVertexOffset + 1] = meshVertexPositions[?? + 1];
  floatView[floatVertexOffset + 2] = meshVertexPositions[?? + 2];

  var uint8ColorOffset = j * 16 + 12;
  unit8View[uint8ColorOffset + 0] = meshVertexColors[?? + 0];
  unit8View[uint8ColorOffset + 1] = meshVertexColors[?? + 1];
  unit8View[uint8ColorOffset + 2] = meshVertexColors[?? + 2];
  unit8View[uint8ColorOffset + 3] = meshVertexColors[?? + 3];
}
```

-   Remember that Float32Array is FOUR bytes
-   Use UNSIGNED_BYTE for the color!

```
gl.vertexAttribPointer(
	attribLocations.a_Color,
	4,
	gl.UNSIGNED_BYTE,		<= UNSIGNED_BYTE, NOT BYTE, NOT SHORT
	false,
	Uint8Array.BYTES_PER_ELEMENT * 12,
	Uint8Array.BYTES_PER_ELEMENT * 8
);
gl.enable
```

-   If you are tightly packing data, REMEMBER that the index is DEPENDENT on the \_\_\_typedArray.

```
this.float[this.verticesRendered * 3 + 0] = x;		<= this.float's indices are each 32bits/4bytes
this.float[this.verticesRendered * 3 + 1] = y;
this.uint[this.verticesRendered * 12 + 8 + 0] = r;		<= this.uint's indices are each 8bits/1byte
this.uint[this.verticesRendered * 12 + 8 + 1] = g;
this.uint[this.verticesRendered * 12 + 8 + 2] = b;
this.uint[this.verticesRendered * 12 + 8 + 3] = size;
this.verticesRendered++
```
