attribute vec2 a_Position;
attribute vec4 a_ColorNSize;

varying vec4 v_ColorNSize;

uniform float u_DiaSize;
uniform float u_CanvasHalfSize;

void main(){
	v_ColorNSize =a_ColorNSize;
	gl_PointSize = u_DiaSize;
	gl_Position = vec4(a_Position/u_CanvasHalfSize,0,1);
}