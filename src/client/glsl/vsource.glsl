attribute vec2 a_Position;
attribute vec4 a_ColorNSize;

varying vec4 v_ColorNSize;

void main(){
	v_ColorNSize =a_ColorNSize;
	gl_PointSize = 10.0;
	gl_Position = vec4(a_Position,0,1);
}