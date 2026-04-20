// Bump SPLINE_VERSION after re-publishing any scene in Spline to bust the CDN cache.
const SPLINE_VERSION = "1";

const scenes = {
  heroLight: "https://prod.spline.design/JY2cfwfllYa7FSve/scene.splinecode",
  heroDark: "https://prod.spline.design/X5b6ec1AfF1VBtXh/scene.splinecode",
  contactLight: "https://prod.spline.design/p0mZprPwlZ2CJwpI/scene.splinecode",
  contactDark: "https://prod.spline.design/TIEvLLUQbEXBkhx7/scene.splinecode",
} as const;

// process.env.NODE_ENV is safe in client modules — Next.js replaces it at
// build time via DefinePlugin (no NEXT_PUBLIC_ prefix needed).
function withCacheBust(url: string): string {
  const v =
    process.env.NODE_ENV === "development" ? Date.now() : SPLINE_VERSION;
  return `${url}?v=${v}`;
}

export const splineScenes = {
  heroLight: () => withCacheBust(scenes.heroLight),
  heroDark: () => withCacheBust(scenes.heroDark),
  contactLight: () => withCacheBust(scenes.contactLight),
  contactDark: () => withCacheBust(scenes.contactDark),
};
