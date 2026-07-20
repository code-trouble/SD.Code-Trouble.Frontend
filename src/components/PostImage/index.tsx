import React, { useEffect, useRef, useState } from "react";
import { cld } from "../../utils/cloudinary";

const TMP_FOLDER = "/tmp-post-images/";
const POST_FOLDER = "/post-images/";

/**
 * Older posts saved before the move-on-submit fix still store the temporary
 * Cloudinary URL (with a /v<version>/ and extension). When that 404s, the asset
 * may have been moved to the permanent folder — whose canonical URL drops the
 * version and the extension. Rebuild that form and retry once.
 *
 * (If the asset was never moved, it was purged by the 6h cleanup cron and is
 * gone for good — no URL recovers it; that's what `fallbackSrc` is for.)
 */
const toPermanentUrl = (url: string): string | null => {
  if (!url.includes(TMP_FOLDER)) return null;
  return url
    .replace(/\/v\d+\//, "/") // drop the stale version segment
    .replace(TMP_FOLDER, POST_FOLDER) // swap to the permanent folder
    .replace(/\.[a-zA-Z0-9]+$/, ""); // drop the extension
};

interface PostImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Shown when the original URL and the recovery attempt both fail. */
  fallbackSrc?: string;
  /** Target display width in px — applied as a Cloudinary downscale transform. */
  width?: number;
}

export const PostImage: React.FC<PostImageProps> = ({
  src,
  fallbackSrc,
  width,
  ...rest
}) => {
  // Recovery ladder: original src -> canonical permanent URL -> placeholder.
  // Cloudinary URLs get optimized (format/quality/width); others pass through.
  const buildSteps = (original?: string): (string | undefined)[] => {
    const steps: (string | undefined)[] = [cld(original, { w: width })];
    if (typeof original === "string") {
      const permanent = toPermanentUrl(original);
      if (permanent) steps.push(cld(permanent, { w: width }));
    }
    if (fallbackSrc) steps.push(fallbackSrc);
    return steps;
  };

  const stepsRef = useRef(buildSteps(src));
  const [step, setStep] = useState(0);

  useEffect(() => {
    stepsRef.current = buildSteps(src);
    setStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fallbackSrc, width]);

  const handleError = () => {
    setStep((prev) => (prev < stepsRef.current.length - 1 ? prev + 1 : prev));
  };

  return (
    <img
      src={stepsRef.current[step]}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
};
