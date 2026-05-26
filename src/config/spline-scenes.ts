// Must be identical on the server (used by `<link rel="preload">`) and on the
// client (used by Spline's runtime fetch) — otherwise the preloaded bytes
// won't be matched and the runtime re-downloads the scene. Bump SPLINE_VERSION
// to bust the CDN cache when a scene is republished.
const SPLINE_VERSION = "1";

const scenes = {
  heroLight: "https://prod.spline.design/JY2cfwfllYa7FSve/scene.splinecode",
  // heroLight: "https://prod.spline.design/Kj1k4ofeduVgvtYq/scene.splinecode",
  // heroLight: "https://prod.spline.design/8yMnLuqr9vtLBD9B/scene.splinecode",
  heroDark: "https://prod.spline.design/X5b6ec1AfF1VBtXh/scene.splinecode",
  contactLight: "https://prod.spline.design/uFuxypgV5-sHPfYG/scene.splinecode",
  contactDark: "https://prod.spline.design/TIEvLLUQbEXBkhx7/scene.splinecode",
} as const;

function withCacheBust(url: string): string {
  return `${url}?v=${SPLINE_VERSION}`;
}

export const splineScenes = {
  heroLight: () => withCacheBust(scenes.heroLight),
  heroDark: () => withCacheBust(scenes.heroDark),
  contactLight: () => withCacheBust(scenes.contactLight),
  contactDark: () => withCacheBust(scenes.contactDark),
};
