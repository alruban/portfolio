/* Images */
declare module "*.jpg";
declare module "*.png";

/* Favicon Data */
declare module "*.ico";
declare module "*.webmanifest";
declare module "*.xml";

/* Dependencies */
declare module "@rubancorp/react-translate-json";

/* SVG imports */
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}