uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec4 uCorners;

varying vec2 vUv;
varying vec2 vSize;

float PI = 3.1415926535897932384626433832795;

#include './_inc/simplex4d.glsl'

void main() {
  vUv = uv;

  vec3 pos = position;

  float sine = sin(PI * uProgress);
  float waves = sine * 0.1 * sin(5.0 * length(uv) + 15.0 * uProgress);

  vec4 defaultState = modelMatrix * vec4(pos, 1.0);
  vec4 fullScreenState = vec4(pos, 1.0);

  fullScreenState.x *= uResolution.x;
  fullScreenState.y *= uResolution.y;
  fullScreenState.z += uCorners.x;

  float cornersProgress = mix(
    mix(uCorners.z, uCorners.w, uv.x),
    mix(uCorners.x, uCorners.y, uv.x),
    uv.y
  );

  vec4 finalState = mix(defaultState, fullScreenState, cornersProgress);

  vSize = mix(uQuadSize, uResolution, cornersProgress);

  gl_Position = projectionMatrix * viewMatrix * finalState;
}