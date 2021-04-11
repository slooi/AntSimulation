precision mediump float;

varying vec4 v_Color;

void main(){


	gl_FragColor = vec4(v_Color.xyz,1.0);
}