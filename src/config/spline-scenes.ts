// Bump SPLINE_VERSION after re-publishing any scene in Spline to bust the CDN cache.
const SPLINE_VERSION = "1";

const scenes = {
  heroLight: "https://prod.spline.design/JY2cfwfllYa7FSve/scene.splinecode",
  heroDark: "https://prod.spline.design/X5b6ec1AfF1VBtXh/scene.splinecode",
  contactLight: "https://prod.spline.design/uFuxypgV5-sHPfYG/scene.splinecode",
  contactDark: "https://prod.spline.design/TIEvLLUQbEXBkhx7/scene.splinecode",
  notFoundLight: "https://prod.spline.design/p0mZprPwlZ2CJwpI/scene.splinecode",
  notFoundDark: "https://prod.spline.design/LcP3yZzPVUXLn12V/scene.splinecode",
} as const;

// Computed once per session/module-load. The previous `Date.now()` call inside
// withCacheBust ran on *every* invocation, which caused the URL to change on
// every render in dev — defeating the browser cache and forcing a full WebGL
// re-fetch on each hot reload.
const CACHE_BUST_TOKEN =
  process.env.NODE_ENV === "development" ? String(Date.now()) : SPLINE_VERSION;

function withCacheBust(url: string): string {
  return `${url}?v=${CACHE_BUST_TOKEN}`;
}

export const splineScenes = {
  heroLight: () => withCacheBust(scenes.heroLight),
  heroDark: () => withCacheBust(scenes.heroDark),
  contactLight: () => withCacheBust(scenes.contactLight),
  contactDark: () => withCacheBust(scenes.contactDark),
  notFoundLight: () => withCacheBust(scenes.notFoundLight),
  notFoundDark: () => withCacheBust(scenes.notFoundDark),
};
