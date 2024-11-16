import React from "react";

import { ProfessorCorrea } from "../../assets/images/svg";

function cleanName(name?: string): string {
  if (!name) return "";

  const trimmedName = name.trim();
  const [firstName, ...rest] = trimmedName.split(" ");
  const lastName = rest.length ? rest[rest.length - 1] : "";

  return `${firstName} ${lastName}`.trim();
}

interface IAvatar {
  name?: string;
  role?: string;
  sizes: "small" | "medium" | "large";
  src?: string;
}

export const Avatar: React.FC<IAvatar> = ({ name, role, sizes, src }) => {
  return (
    <main className="avatar-container">
      <img
        src={src ? src : ProfessorCorrea}
        alt="profile image"
        className={`avatar-img-${sizes}`}
      />
      <div className={`avatar-text-${sizes}`}>
        <h1 className={`avatar-name-${sizes}`}>{cleanName(name)}</h1>
        <p className={`avatar-role-${sizes}`}>{role}</p>
      </div>
    </main>
  );
};
