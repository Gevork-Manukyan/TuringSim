/// <reference types="vite/client" />

// Ambient declarations so TypeScript accepts style side-effect imports
// (`import "./X.scss"`) under moduleResolution: "bundler". vite/client already
// provides these; these explicit fallbacks guarantee it across TS versions.
declare module "*.scss";
declare module "*.css";
