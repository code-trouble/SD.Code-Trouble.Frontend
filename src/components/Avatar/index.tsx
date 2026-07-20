import React, { useEffect, useState } from "react";
import { ProfessorCorrea } from "../../assets/images/svg/illustration";
import { cld } from "../../utils/cloudinary";

function cleanName(name?: string): string {
  if (!name) return "";

  const trimmedName = name.trim();
  const [firstName, ...rest] = trimmedName.split(" ");
  const lastName = rest.length ? rest[rest.length - 1] : "";

  return `${firstName} ${lastName}`.trim();
}

// Retina-friendly target widths per avatar size.
const SIZE_WIDTH: Record<IAvatar["sizes"], number> = {
  small: 80,
  medium: 120,
  large: 240,
};

interface IAvatar {
  name?: string;
  role?: string;
  sizes: "small" | "medium" | "large";
  src?: string;
  onClick?: VoidFunction;
}

export const Avatar: React.FC<IAvatar> = ({
  name,
  role,
  sizes,
  src,
  onClick,
}) => {
  const original = src || ProfessorCorrea;
  // NOTE: only downscale (c_limit). Deliberately NOT square-cropping: these
  // images have no object-fit in CSS, so a non-square avatar is squashed into
  // the box today — cropping it square would change how avatars look.
  const optimized = src ? (cld(src, { w: SIZE_WIDTH[sizes] }) ?? src) : original;

  // Fall back to the untransformed URL if the optimized one ever fails.
  const [imgSrc, setImgSrc] = useState(optimized);
  useEffect(() => setImgSrc(optimized), [optimized]);

  return (
    <main onClick={onClick} className="avatar-container">
      <img
        src={imgSrc}
        alt={name ? `Foto de ${cleanName(name)}` : "Foto de perfil"}
        className={`avatar-img-${sizes}`}
        loading="lazy"
        onError={() => {
          if (imgSrc !== original) setImgSrc(original);
        }}
      />
      <div className={`avatar-text-${sizes}`}>
        <h1 className={`avatar-name-${sizes}`}>{cleanName(name)}</h1>
        <p className={`avatar-role-${sizes}`}>{role}</p>
      </div>
    </main>
  );
};
