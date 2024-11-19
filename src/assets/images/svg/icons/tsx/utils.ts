export interface IIconToTsx extends React.SVGProps<SVGSVGElement> {
  color?: string;
  width?: number;
  height?: number;
  viewBox?: string; // Adicione o viewBox como prop opcional
}