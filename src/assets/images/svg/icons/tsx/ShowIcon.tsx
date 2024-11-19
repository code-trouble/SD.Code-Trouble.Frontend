import * as React from "react";
import { IIconToTsx } from "./utils";

const ShowIcon: React.FC<IIconToTsx> = ({ color = "black", width = 24, height = 24, viewBox = "0 0 24 24" }) => (
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
    d="M21 9V7h-1V6h-1V5h-2V3H7v2H5v1H4v1H3v2H1v6h2v2h1v1h1v1h2v2h10v-2h2v-1h1v-1h1v-2h2V9zm0 4h-2v2h-1v1h-1v1h-2v2H9v-2H7v-1H6v-1H5v-2H3v-2h2V9h1V8h1V7h2V5h6v2h2v1h1v1h1v2h2z"
  ></path>
</svg>
);

export default ShowIcon;