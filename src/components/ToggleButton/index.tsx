import React, { useState } from "react";

interface IToggleButton {
  activeColor: "base" | "primary" | "secondary" | "tertiary";
  isDisabled?: boolean;
}

function generateButtonColor(activeColor: string) {
  switch (activeColor) {
    case "base":
      return "#C9C9C9";
    case "primary":
      return "#2DBA4F";
    case "secondary":
      return "#FF8E00";
    case "tertiary":
      return "#3348A4";
  }
}

export const ToggleButton: React.FC<IToggleButton> = ({
  activeColor,
  isDisabled,
}) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn((prevState) => !prevState);
  };

  return (
    <button
      disabled={isDisabled}
      className={`button-wrapper ${isOn ? "on" : "off"}`}
      style={{
        backgroundColor: isOn ? generateButtonColor(activeColor) : "#C9C9C9",
      }}
      onClick={handleToggle}
    >
      <div className="toggler"></div>
    </button>
  );
};
