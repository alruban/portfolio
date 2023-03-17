/* Images */
declare module "*.jpg";
declare module "*.png";

/* Favicon Data */
declare module "*.ico";
declare module "*.webmanifest";
declare module "*.xml";

/* Dependencies */
declare module "@rubancorp/react-translate-json";
declare module "@rubancorp/react-translate-json/react";

/* SVG imports */
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}