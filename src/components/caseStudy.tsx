import { Translate } from "@rubancorp/react-translate-json/react";
import React from "react";

/* SVGs */
import Close from "../svgs/svg-icon-close.svg";
import BearBrick from "../svgs/svg-project-bear-brick.svg";
import Cedar from "../svgs/svg-project-cedar.svg";
import Climpsons from "../svgs/svg-project-climpsons.svg";
import Dropdeck from "../svgs/svg-project-dropdeck.svg";
import Freetrain from "../svgs/svg-project-freetrain.svg";
import Orb from "../svgs/svg-project-orb.svg";
import Patchworks from "../svgs/svg-project-patchworks.svg";
import Smiley from "../svgs/svg-project-smiley.svg";

import Codebases from "./codebases";

/* Types */
import type { JSONSchema4 } from "json-schema";

export default function caseStudy(data: JSONSchema4) {
  return (
    <>
      <div
        className="absolute w-full h-full px-4 pb-4 overflow-scroll bg-background scrollbar-hide select-none"
        data-profile-view
      >
        <div className="flex justify-between pt-4 pb-1">
          <h6 className="text-lg">{data.name}</h6>

          <button
            className="absolute w-6 h-6 cursor-pointer top-4 right-4"
            type="button"
            aria-label={`Open ${data.name}`}
            data-profile-reset
          >
            <Close />
          </button>
        </div>
        <div className="py-3 border-solid border-y border-primary">
          <div className="w-20 mx-auto my-6 h-19">
            {data.name == "Bear Brick" ? (
              <BearBrick />
            ) : data.name == "Patchworks" ? (
              <Patchworks />
            ) : data.name == "Climpson & Sons" ? (
              <Climpsons />
            ) : data.name == "Freetrain" ? (
              <Freetrain />
            ) : data.name == "Cedar & Hyde" ? (
              <Cedar />
            ) : data.name == "Dropdeck" ? (
              <Dropdeck />
            ) : data.name == "Smiley" ? (
              <Smiley />
            ) : data.name == "Orb" ? (
              <Orb />
            ) : (
              false
            )}
          </div>
        </div>
        <div className="py-3 border-b border-solid border-primary">
          <div className="grid grid-cols-2">
            <Translate
              label="profile.titles.category"
              render={(res: string) => (
                <p className="text-md font-heading">{res}</p>
              )}
            />
            <p className="text-right text-md font-heading">{data.category}</p>
            <Translate
              label="profile.titles.team"
              render={(res: string) => (
                <p className="text-md font-heading">{res}</p>
              )}
            />
            <p className="text-right text-md font-heading">{data.team}</p>
            <Translate
              label="profile.titles.role"
              render={(res: string) => (
                <p className="text-md font-heading">{res}</p>
              )}
            />
            <p className="text-right text-md font-heading">{data.role}</p>
            <Translate
              label="profile.titles.year"
              render={(res: string) => (
                <p className="text-md font-heading">{res}</p>
              )}
            />
            <p className="text-right text-md font-heading">{data.year}</p>
          </div>
        </div>
        <div className="pt-3">
          <p className="text-md font-heading">{data.description}</p>
        </div>
        <div className="flex justify-between pt-6 pb-3 border-b border-solid border-primary">
          <div className="flex gap-y-2 gap-x-4 max-md:flex-col">
            <Translate
              label="profile.website"
              render={(res: string) => (
                <a
                  className="text-sm underline select-none hover:no-underline underline-offset-4 font-heading"
                  href={data.link}
                >
                  {res}
                </a>
              )}
            />

            <Translate
              label="profile.titles.password"
              render={(res: string) =>
                data.password ? (
                  <p className="text-sm font-heading">
                    {res}: {data.password}
                  </p>
                ) : (
                  <></>
                )
              }
            />
          </div>

          <div>
            {Codebases(data)}
            <Translate
              label="profile.titles.codebase"
              render={(res: string) => (
                <span className="util__screen-reader-only">{res}</span>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}
