import better from "better-color-tools";
import postcss from "postcss";
import postcssOklabFunction from "@csstools/postcss-oklab-function";
// @ts-expect-error untyped module
import postcssMinify from "postcss-minify";
import { type Hue, type Mode, type Color } from "./color";
import { oklch } from "./oklch";

const createHueModeMap = (hue: Hue, mode: Mode) => {
  const map = oklch[mode];
  const res = {} as Record<Color, string>;
  Object.entries(map).forEach(([name, lightnessAndChroma]) => {
    res[name as keyof typeof res] = `oklch(${lightnessAndChroma} ${hue})`;
  });
  return res;
};

const createCSSVars = (map: Record<Color, string>) => {
  let vars = Object.entries(map)
    .map(([name, color]) => `--color-accent-${name}: ${color};`)
    .join("");
  vars += `accent-color: var(--color-accent-primary);`;
  return vars;
};

export const createStyles = (hue: Hue) => {
  const lightStyles = createCSSVars(createHueModeMap(hue, "light"));
  const darkStyles = createCSSVars(createHueModeMap(hue, "dark"));
  const styles = `
  [data-hue="${hue}"] { ${lightStyles} }
  @media (prefers-color-scheme: dark) {
    [data-hue="${hue}"] { ${darkStyles} }
  }
  body[data-mode="light"][data-hue="${hue}"],
  body[data-mode="light"] [data-hue="${hue}"] { ${lightStyles} }
  body[data-mode="dark"][data-hue="${hue}"],
  body[data-mode="dark"] [data-hue="${hue}"] { ${darkStyles} }
  `;
  return postcss(postcssOklabFunction(), postcssMinify()).process(styles).css;
};

export const getStyle = (hue: Hue, mode: Mode, color: Color) => {
  const lightnessAndChroma = oklch[mode][color];
  return better.from(`oklch(${lightnessAndChroma} ${hue})`).hex;
};

export const getStyleFromVar = (color: Color) => {
  const colorVar = getComputedStyle(document.body).getPropertyValue(
    `--color-accent-${color}`
  );
  return better.from(colorVar).hex;
};

export const updateThemeColor = () => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const accentColor = getComputedStyle(document.body).accentColor;
  if (!accentColor) return;
  const activeColor = better.from(accentColor).hex;
  themeColorMeta?.setAttribute("content", activeColor);

  const svg = getSvg(activeColor);
  faviconToPng(svg, 32, (imageData) => {
    const link = document.querySelector('link[rel="icon"][sizes="any"]');
    link?.setAttribute("href", imageData);
  });
  faviconToPng(svg, 180, (imageData) => {
    const link = document.querySelector('link[rel="apple-touch-icon"]');
    link?.setAttribute("href", imageData);
  });
  const link = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  link?.setAttribute("href", svg);
};

const getSvg = (color: string) => {
  return `<svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path stroke="${color}" stroke-width="10" stroke-linejoin="round" d="M82.2059 34.035C81.2467 36.4076 82.3676 39.1111 84.7244 40.1086C87.5232 41.2934 89.5266 42.1584 91.0061 42.8787C92.5344 43.6229 93.1535 44.0508 93.3965 44.267C97.2846 47.7246 97.2846 53.8273 93.3965 57.285C93.1535 57.501 92.5348 57.9287 91.0072 58.6725C89.5287 59.3926 87.5264 60.257 84.7293 61.4412C82.3727 62.4387 81.2516 65.1422 82.2107 67.5147C83.2623 70.116 84.0039 72.0012 84.4986 73.4494C85.0096 74.9447 85.1369 75.642 85.1566 75.9447C85.4996 81.2104 81.1484 85.5334 75.9586 85.1803C75.6621 85.16 74.9777 85.0334 73.5076 84.5242C72.0828 84.0305 70.2295 83.291 67.6693 82.2406C65.284 81.2621 62.5564 82.3936 61.5639 84.7729C60.4129 87.5326 59.5715 89.5102 58.8713 90.9715C58.1477 92.4824 57.732 93.0971 57.523 93.3379C54.0824 97.3041 47.9547 97.3041 44.5141 93.3379C44.3049 93.0969 43.8891 92.482 43.165 90.9703C42.4646 89.508 41.6229 87.5293 40.4711 84.768C39.4787 82.3885 36.7508 81.2572 34.3656 82.2357C31.8014 83.2879 29.9455 84.0285 28.5186 84.5231C27.0465 85.0332 26.3613 85.16 26.0645 85.1803C20.8746 85.5334 16.5234 81.2104 16.8663 75.9447C16.8861 75.6422 17.0134 74.9455 17.5237 73.4516C18.0179 72.0049 18.7585 70.1215 19.809 67.5231C20.7682 65.1504 19.6471 62.4471 17.2903 61.4494C14.4865 60.2627 12.4797 59.3965 10.9978 58.675C9.46684 57.9297 8.84689 57.5014 8.60348 57.285C4.71551 53.8273 4.71551 47.7246 8.60348 44.267C8.84699 44.0504 9.46725 43.6219 10.9991 42.8762C12.4818 42.1545 14.4897 41.2879 17.2952 40.1004C19.652 39.1029 20.773 36.3994 19.8138 34.0268C18.7617 31.4242 18.0198 29.5383 17.5248 28.0895C17.0136 26.5934 16.8861 25.8959 16.8663 25.593C16.5234 20.3274 20.8746 16.0043 26.0645 16.3575C26.3664 16.3781 27.0633 16.5082 28.5662 17.0313C30.0219 17.538 31.917 18.2965 34.5391 19.3731C36.9236 20.3522 39.6512 19.2222 40.6447 16.8436C41.7436 14.2134 42.5516 12.325 43.2254 10.9281C43.9215 9.48573 44.324 8.89434 44.5256 8.66206C47.9662 4.69598 54.0939 4.69598 57.5346 8.66206C57.7359 8.89405 58.1381 9.48467 58.8332 10.9248C59.5062 12.3195 60.3131 14.2048 61.41 16.8307C62.4035 19.2091 65.1311 20.3391 67.5156 19.3601C70.127 18.288 72.015 17.5327 73.4654 17.0282C74.9629 16.5075 75.6574 16.378 75.9586 16.3575C81.1484 16.0043 85.4996 20.3274 85.1566 25.593C85.1369 25.8961 85.0092 26.5941 84.4975 28.0916C84.002 29.5418 83.2592 31.4297 82.2059 34.035Z" />
</svg>`;
};

const faviconToPng = (
  svg: string,
  dimensions: number,
  callback: (imageData: string) => void
) => {
  const svgUrl = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml" })
  );
  const img = document.createElement("img");
  img.id = "faviconImg";
  img.src = svgUrl;
  document.body.appendChild(img);
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = dimensions;
    canvas.height = dimensions;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    callback(imageData);
    URL.revokeObjectURL(svgUrl);
    document.body.removeChild(img);
  };
};
