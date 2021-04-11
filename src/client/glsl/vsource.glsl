attribute vec2 a_Position;
attribute vec4 a_Color;

varying vec4 v_Color;

void main(){
	v_Color =a_Color;
	gl_PointSize = 10.0;
	gl_Position = vec4(a_Position,0,1);
}