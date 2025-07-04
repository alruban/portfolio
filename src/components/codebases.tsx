import React from "react";

/* SVGs */
import CSS from "../svgs/svg-codebase-css.svg";
import HTML from "../svgs/svg-codebase-html.svg";
import JS from "../svgs/svg-codebase-javascript.svg";
import Liquid from "../svgs/svg-codebase-liquid.svg";
import PostCSS from "../svgs/svg-codebase-postcss.svg";
import ReactJS from "../svgs/svg-codebase-react.svg";
import Remix from "../svgs/svg-codebase-remix.svg";
import Sass from "../svgs/svg-codebase-sass.svg";
import Tailwind from "../svgs/svg-codebase-tailwind.svg";
import Typescript from "../svgs/svg-codebase-typescript.svg";
import Vite from "../svgs/svg-codebase-vite.svg";

import type { JSONSchema4 } from "json-schema";

const Codebases = (data: JSONSchema4) => {
  /**
   * Generate Codebase Icons
   */
  const languages = data.codebase.split(",") ?? [];

  return (
    <ul className="flex gap-x-2">
      {languages.map((language: string, index: number) => {
        const standardisedLanguage = language.toLowerCase();
        return (
          <li className="w-4 h-4" key={index}>
            <a
              className="w-4 h-4 cursor-default"
              href="#"
              title={`${language}`}
            >
              {standardisedLanguage == "typescript" ? (
                <Typescript />
              ) : standardisedLanguage == "postcss" ? (
                <PostCSS />
              ) : standardisedLanguage == "tailwind" ? (
                <Tailwind />
              ) : standardisedLanguage == "liquid js" ? (
                <Liquid />
              ) : standardisedLanguage == "sass" ? (
                <Sass />
              ) : standardisedLanguage == "react" ? (
                <ReactJS />
              ) : standardisedLanguage == "javascript" ? (
                <JS />
              ) : standardisedLanguage == "html" ? (
                <HTML />
              ) : standardisedLanguage == "css" ? (
                <CSS />
              ) : standardisedLanguage == "remix" ? (
                <Remix />
              ) : standardisedLanguage == "vite" ? (
                <Vite />
              ) : (
                false
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Codebases;
