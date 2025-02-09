uniform sampler2D globeTexture;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 color = texture2D(globeTexture, vUv).rgb;
  float atmosphere = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
  color += vec3(0.0, 0.3, 0.7) * atmosphere; // Add blue glow
  gl_FragColor = vec4(color, 1.0);
}
