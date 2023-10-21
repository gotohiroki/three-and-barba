varying vec2 vUv;
varying vec2 vSize;

uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float uProgress;

vec2 getUV( vec2 uv, vec2 textureSize, vec2 quadSize ) {
  vec2 tempUv = uv - vec2(0.5);

  float quadAspect = quadSize.x / quadSize.y;
  float textureAspect = textureSize.x / textureSize.y;

  if(quadAspect < textureAspect) {
    tempUv = tempUv * vec2(quadAspect / textureAspect, 1.0);
  } else {
    tempUv = tempUv * vec2(1.0, textureAspect / quadAspect);
  }

  tempUv += vec2(0.5);
  return tempUv;
}

void main() {
  vec2 correctUV = getUV(vUv, uTextureSize, vSize);
  vec4 image = texture(uTexture, correctUV);

  gl_FragColor = vec4(vUv, uProgress, 1.0);
  gl_FragColor = image;
}