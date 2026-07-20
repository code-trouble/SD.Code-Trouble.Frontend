/**
 * Inserts on-the-fly delivery transforms into a Cloudinary URL so images are
 * served in a modern format, auto-quality, and (optionally) downscaled instead
 * of at their original upload resolution (a 2.6MB avatar -> a few KB).
 *
 * Safe by design:
 * - non-Cloudinary URLs are returned untouched;
 * - URLs that already carry transforms are left as-is (no double-applying);
 * - the transform segment is inserted before the version, which is where
 *   Cloudinary expects it.
 *
 * If "Strict transformations" is ever enabled on the account, callers still
 * fall back to the original URL via onError, so nothing breaks.
 */
const UPLOAD_MARKER = "/image/upload/";

interface CldOptions {
  /** Target display width in px (use ~2x for retina). Omit to keep full size. */
  w?: number;
  /** Target display height in px. */
  h?: number;
  /**
   * Square-crop to a fixed size centered on the face (for avatars). Uses `w`
   * as the side length; makes the image's intrinsic ratio match a circular
   * display, fixing the "incorrect aspect ratio" audit.
   */
  square?: boolean;
}

export const cld = (
  url: string | null | undefined,
  { w, h, square }: CldOptions = {},
): string | undefined => {
  if (!url || !url.includes("res.cloudinary.com")) return url ?? undefined;

  const idx = url.indexOf(UPLOAD_MARKER);
  if (idx === -1) return url;

  const after = url.slice(idx + UPLOAD_MARKER.length);

  // Already transformed? (first segment contains a known transform token)
  if (/^[^/]*(?:f_|q_|w_|h_|c_|dpr_)/.test(after)) return url;

  const transforms = ["f_auto", "q_auto"];
  if (square && w) {
    transforms.push(`w_${w}`, `h_${w}`, "c_fill", "g_face");
  } else {
    if (w) transforms.push(`w_${w}`);
    if (h) transforms.push(`h_${h}`);
    if (w || h) transforms.push("c_limit"); // only downscale, never upscale
  }

  return `${url.slice(0, idx + UPLOAD_MARKER.length)}${transforms.join(",")}/${after}`;
};
