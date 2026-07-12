// Procedural ocean — Gerstner wave summation with analytic normals.
// Plane is authored in local XY (flat), displaced along local +Z (up), then the
// mesh is rotated -90deg X so local +Z maps to world +Y. All lighting is done
// in the fragment shader from the interpolated world normal.

uniform float uTime;
uniform float uAmplitude;
uniform float uChoppiness;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vHeight;

const int WAVE_COUNT = 5;

void main() {
  // dir.xy, steepness, wavelength
  vec4 waves[WAVE_COUNT];
  waves[0] = vec4( 1.00,  0.35, 0.26, 34.0);
  waves[1] = vec4(-0.70,  1.00, 0.22, 19.0);
  waves[2] = vec4( 0.85, -0.55, 0.18, 11.0);
  waves[3] = vec4( 0.20,  1.00, 0.13, 6.0);
  waves[4] = vec4(-0.45, -0.85, 0.10, 3.4);

  vec2 p = position.xy;
  vec3 disp = vec3(0.0);
  vec3 tangent = vec3(1.0, 0.0, 0.0);
  vec3 binormal = vec3(0.0, 1.0, 0.0);

  for (int i = 0; i < WAVE_COUNT; i++) {
    vec2 dir = normalize(waves[i].xy);
    float steep = waves[i].z * uChoppiness;
    float wl = waves[i].w;
    float k = 6.28318530718 / wl;
    float c = sqrt(9.8 / k);
    float f = k * (dot(dir, p) - c * uTime);
    float a = (steep / k) * uAmplitude;
    float cosf = cos(f);
    float sinf = sin(f);

    disp.x += dir.x * (a * cosf);
    disp.y += dir.y * (a * cosf);
    disp.z += a * sinf;

    float wa = k * a;
    tangent  += vec3(-dir.x * dir.x * (wa * sinf), -dir.x * dir.y * (wa * sinf), dir.x * (wa * cosf));
    binormal += vec3(-dir.x * dir.y * (wa * sinf), -dir.y * dir.y * (wa * sinf), dir.y * (wa * cosf));
  }

  vec3 newPos = vec3(p.x + disp.x, p.y + disp.y, disp.z);
  vec3 nrm = normalize(cross(tangent, binormal));
  vHeight = disp.z;

  vec4 world = modelMatrix * vec4(newPos, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * nrm);

  gl_Position = projectionMatrix * viewMatrix * world;
}
