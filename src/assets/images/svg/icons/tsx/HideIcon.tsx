import * as React from "react";
import { IIconToTsx } from "./utils";

const HideIcon: React.FC<IIconToTsx> = ({ color = "black", width = 24, height = 24, viewBox = "0 0 24 24" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox={viewBox} 
  >
    <path
      fill={color}
      d="M14 9h-4v1H9v4h1v1h4v-1h1v-4h-1zm-1 4h-2v-2h2z"
    ></path>
    <path
      fill={color}
      d="M9 19v-2H7v-1H6v-1H5v-2H3v-2h2V9H1v6h2v2h1v1h1v1h2v2h8v-2zM21 9V7h-1V6h-1V5h-2V3H9v2h6v2h2v1h1v1h1v2h2v2h-2v2h4V9zM21 20v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2V8H9V6H7V4H5V2H3V1H1v3h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v1h2v-3z"
    ></path>
  </svg>
);

export default HideIcon;
