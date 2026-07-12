// Ocean surface shading: Fresnel sky-mix, deep→crystal depth colour, sun
// specular + fine sparkle, and distance fog that dissolves into the sky so the
// horizon is seamless. `cameraPosition` is a three.js built-in uniform.

precision highp float;

uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uSky;
uniform vec3 uSunColor;
uniform vec3 uSunDir;
uniform float uFogNear;
uniform float uFogFar;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vHeight;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 L = normalize(uSunDir);

  // Depth colour: crest = crystal, trough = deep ocean.
  float depthMix = clamp(vHeight * 0.6 + 0.5, 0.0, 1.0);
  vec3 water = mix(uDeep, uShallow, depthMix);

  // Fresnel reflectance toward the sky.
  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  vec3 col = mix(water, uSky, fres * 0.65);

  // Sun specular highlight + tighter glint. Exponents kept moderate: very high
  // powers (>500) break down in mediump/precision-limited GPUs and produce
  // black speckles, so we stay in a safe range and lean on bloom for sparkle.
  vec3 H = normalize(L + V);
  float ndh = max(dot(N, H), 0.0);
  col += uSunColor * pow(ndh, 110.0) * 1.1;
  col += uSunColor * pow(ndh, 360.0) * 1.3;

  // Subtle subsurface glow on the sun-facing slopes.
  float sss = max(dot(N, L), 0.0);
  col += uShallow * sss * 0.06;

  // Distance fog into the sky colour for a seamless horizon.
  float dist = length(cameraPosition - vWorldPos);
  float fog = smoothstep(uFogNear, uFogFar, dist);
  col = mix(col, uSky, fog);

  gl_FragColor = vec4(col, 1.0);
}
