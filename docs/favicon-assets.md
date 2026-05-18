# Favicon and platform icon assets

## Requirement

The project needs project-specific favicon assets that support common browser sizes and platform integrations. The icon set must use a black-and-white visual style, with no blue or purple tones.

## What changed

- Added a black-and-white SVG source icon at `public/favicon.svg`.
- Generated browser favicon assets:
  - `public/favicon.ico` with 16, 32, and 48 pixel variants.
  - `public/icons/favicon-16x16.png`.
  - `public/icons/favicon-32x32.png`.
  - `public/icons/favicon-48x48.png`.
- Added platform icons:
  - `public/apple-touch-icon.png` for iOS and iPadOS home-screen bookmarks.
  - `public/icons/android-chrome-192x192.png` and `public/icons/android-chrome-512x512.png` for Android and Chromium install surfaces.
  - `public/icons/maskable-icon-192x192.png` and `public/icons/maskable-icon-512x512.png` for maskable PWA icon contexts.
  - `public/safari-pinned-tab.svg` for Safari pinned tabs.
  - `public/icons/mstile-*` assets and `public/browserconfig.xml` for Microsoft tile metadata.
- Added `public/site.webmanifest` with the generated Android and maskable icons.
- Updated `src/layouts/BaseLayout.astro` so every page advertises the favicon, SVG icon, Apple touch icon, web manifest, Safari mask icon, theme color, and Microsoft tile configuration.

## Design rationale

The icon uses only white and near-black (`#111111`). The near-black rounded square fills the full icon canvas instead of sitting inside an outer white background, and the simplified white presentation screen keeps the mark relevant to the HTML PPT presentation use case while staying legible at small favicon sizes.

The SVG remains the source-of-truth shape for future icon regeneration. PNG and ICO files are generated outputs for browser and operating-system surfaces that do not consume SVG favicons consistently.

## Regenerating icons

ImageMagick was used to export the PNG and ICO assets from `public/favicon.svg`.

```sh
mkdir -p public/icons
for size in 16 32 48; do
  magick -background none public/favicon.svg -resize "${size}x${size}" "public/icons/favicon-${size}x${size}.png"
done

magick -background none public/favicon.svg -resize 180x180 public/apple-touch-icon.png
magick -background none public/favicon.svg -resize 192x192 public/icons/android-chrome-192x192.png
magick -background none public/favicon.svg -resize 512x512 public/icons/android-chrome-512x512.png
magick -background none public/favicon.svg -resize 192x192 public/icons/maskable-icon-192x192.png
magick -background none public/favicon.svg -resize 512x512 public/icons/maskable-icon-512x512.png
magick public/icons/favicon-16x16.png public/icons/favicon-32x32.png public/icons/favicon-48x48.png public/favicon.ico
```

Microsoft tile assets were generated from the same SVG. If ImageMagick crashes while composing the wide tile directly from SVG input, first render a temporary PNG and compose from that PNG.

## Open issues

No open implementation issues are known. If the project later receives final brand guidelines, replace `public/favicon.svg` first, regenerate the derived PNG and ICO files, and keep the color palette aligned with the approved brand colors.
