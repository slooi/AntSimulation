precision mediump float;

varying vec4 v_ColorNSize;

void main(){


	gl_FragColor = vec4(v_ColorNSize.xyz,1.0);
}