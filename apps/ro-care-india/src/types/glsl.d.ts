// Raw GLSL imported as strings (see next.config.mjs asset/source rule).
declare module "*.glsl" {
  const value: string;
  export default value;
}
declare module "*.vert" {
  const value: string;
  export default value;
}
declare module "*.frag" {
  const value: string;
  export default value;
}
