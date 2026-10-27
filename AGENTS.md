# bluebolt-ui — agent notes

- Read `C:\Users\Shadow\Data\10_Projects\tailsmachine-ops\AGENTS.md` first (user rules, branch prefixes, only the user merges). Progress lives in tailsmachine-ops `projects/bluebolt-ui/STATUS.md`.
- `src/lib/` is the published package (Svelte 5 runes, plain JS + JSDoc, shipped as source). `src/demo/` is the showcase and imports via the package name `bluebolt-ui`.
- Every new motion must scale by `--bb-motion` (0 under reduced motion) or check `reducedMotion()`; check contrast (WCAG AA) for any new colour pairing.
- Consumers pin git tags (`github:YuutaTsubasa/bluebolt-ui#vX.Y.Z`); bump `version` and tag together. Breaking changes need a minor bump while < 1.0.
- Do not copy code or assets from the reference demo (no licence); style references only.
- Verify with `npm run build` and by opening the demo (`npm run dev`, port 5178).
