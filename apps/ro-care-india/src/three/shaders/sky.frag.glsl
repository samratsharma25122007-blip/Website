// Abstract gradient sky with a soft sun disc + halo. Rendered on the inside of
// a large dome (BackSide). Deliberately clean and minimal — no clouds — so the
// ocean and (later) the RO remain the heroes.

precision highp float;

uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uSunColor;
uniform vec3 uSunDir;

varying vec3 vDir;

void main() {
  vec3 d = normalize(vDir);
  vec3 L = normalize(uSunDir);

  // Vertical gradient, richer toward the zenith.
  float t = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(t, 0.85));

  // Sun disc + wide atmospheric halo.
  float sun = dot(d, L);
  col += uSunColor * pow(max(sun, 0.0), 900.0) * 2.5;      // core
  col += uSunColor * pow(max(sun, 0.0), 12.0) * 0.30;      // halo
  col += uSunColor * pow(max(sun, 0.0), 3.0) * 0.08;       // bloom bed

  gl_FragColor = vec4(col, 1.0);
}
