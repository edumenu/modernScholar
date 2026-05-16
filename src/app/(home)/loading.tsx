// The home route owns its own Spline-aware loading overlay inside
// `HeroSection`. Returning null here prevents the root `app/loading.tsx`
// FullScreenLogoLoader from flashing for this segment — otherwise its wipe
// animation would play once during the route transition and then restart
// when the hero overlay mounts, which reads as "two loaders".
export default function Loading() {
  return null;
}
