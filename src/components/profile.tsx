import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';
import Codebases from './codebases';

import Projects from './projects';

/* SVGs */
import Patchworks from '../svgs/svg-project-patchworks.svg';
import Freetrain from '../svgs/svg-project-freetrain.svg';
import Climpsons from '../svgs/svg-project-climpsons.svg';
import Hairgain from '../svgs/svg-project-hairgain.svg';
import ALTMLK from '../svgs/svg-project-altmlk.svg';
import Smiley from '../svgs/svg-project-smiley.svg';
import Cedar from '../svgs/svg-project-cedar.svg';
import Orb from '../svgs/svg-project-orb.svg';

import Close from '../svgs/svg-icon-close.svg';

/* Types */
import { JSONSchema4 } from 'json-schema';

export default function Profile(data: JSONSchema4) {
  return (
    <>
      <div
        className='absolute w-full h-full px-4 pb-4 overflow-scroll bg-background scrollbar-hide'
        data-profile-view
      >
        <div className='flex justify-between pt-4 pb-1'>
          <h6 className='text-lg'>
            {data.name}
          </h6>

          <button
            className='absolute w-6 h-6 cursor-pointer top-4 right-4'
            type='button'
            aria-label={`Open ${data.name}`}
            data-profile-reset
          >
            <Close/>
          </button>
        </div>
        <div className='py-3 border-solid border-y border-primary'>
          <div className='w-20 mx-auto my-6 h-19'>
            {
              data.name == 'Patchworks' ? <Patchworks/> :
              data.name == 'Climpson & Sons' ? <Climpsons/> :
              data.name == 'Freetrain' ? <Freetrain/> :
              data.name == 'Cedar & Hyde' ? <Cedar/> :
              data.name == 'Hairgain' ? <Hairgain/> :
              data.name == 'ALTMLK' ? <ALTMLK/> :
              data.name == 'Smiley' ? <Smiley/> :
              data.name == 'Orb' ? <Orb/> :
              false
            }
          </div>
        </div>
        <div className='py-3 border-b border-solid border-primary'>
          <div className='grid grid-cols-2'>
            <Translate
              label="profile.titles.category"
              render={(res: string) => (
                <p className='text-md font-heading'>
                  {res}
                </p>
              )}
            />
            <p className='text-right text-md font-heading'>
              {data.category}
            </p>
            <Translate
              label="profile.titles.team"
              render={(res: string) => (
                <p className='text-md font-heading'>
                  {res}
                </p>
              )}
            />
            <p className='text-right text-md font-heading'>
              {data.team}
            </p>
            <Translate
              label="profile.titles.role"
              render={(res: string) => (
                <p className='text-md font-heading'>
                  {res}
                </p>
              )}
            />
            <p className='text-right text-md font-heading'>
              {data.role}
            </p>
            <Translate
              label="profile.titles.year"
              render={(res: string) => (
                <p className='text-md font-heading'>
                  {res}
                </p>
              )}
            />
            <p className='text-right text-md font-heading'>
              {data.year}
            </p>
          </div>
        </div>
        <div className='pt-3'>
          <p className='text-md font-heading'>
            {data.description}
          </p>
        </div>
        <div className='flex justify-between pt-6 pb-3 border-b border-solid border-primary'>
          <Translate
            label="profile.website"
            render={(res: string) => (
              <a
                className='text-sm underline select-none hover:no-underline underline-offset-4 font-heading'
                href={data.link}
              >
                {res}
              </a>
            )}
          />

          <div>
            {Codebases(data)}
            <Translate
              label="profile.titles.codebase"
              render={(res: string) => (
                <span className='util__screen-reader-only'>
                  {res}
                </span>
              )}
            />
          </div>
        </div>
      </div>
    </>
  )
}
