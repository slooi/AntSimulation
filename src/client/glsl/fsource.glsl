precision mediump float;

varying vec4 v_ColorNSize;

void main(){


	gl_FragColor = vec4(vec3(v_ColorNSize.x,v_ColorNSize.y+v_ColorNSize.w,v_ColorNSize.z),1.0);
}