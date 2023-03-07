import React from 'react';
import { Translate } from '@rubancorp/react-translate-json';

import ChevronRight from '../svgs/svg-icon-chevron-right.svg'
import { JSONSchema4 } from 'json-schema';
import { Url } from 'url';

export default function profile(data: JSONSchema4) {
  return (
    <>
      <div
        className='relative grid w-full grid-cols-5 px-3 delay-500 select-none project__preview lg:px-0 lg:py-4 lg:orient-vertical lg:w-fit lg:h-full'
        data-profile-preview
      >
        <p>
          {data.category}
        </p>

        <div className='h-4 fill-dos-50 justify-self-center project__prompt'>
          <ChevronRight />
        </div>

        <p className='text-center'>
          {data.name}
        </p>

        <div className='h-4 fill-dos-50 justify-self-center project__prompt'>
          <ChevronRight />
        </div>

        <p className='text-right'>
          {data.year}
        </p>
      </div>
      <div
        className='absolute w-full h-full px-4 overflow-scroll delay-500 opacity-0 pointer-events-none transition-opacity-slow profile__view scrollbar-hide'
        data-profile-view
      >
        <div className='flex justify-between pt-4 pb-1'>
          <h6 className='text-lg'>
            {data.name}
          </h6>

          <h6 className='text-lg'>
            {data.year}
          </h6>
        </div>
        <div className='py-3 border-solid border-y border-dos-50'>
          <img
            className='aspect-video'
            src={data.images[0]}
            loading='lazy'
          />
        </div>
        <div className='py-3 border-b border-solid border-dos-50'>
          <div className='grid grid-cols-2'>
            <Translate
              label="profile.titles.category"
              render={(res: string) => (
                <p className='text-3xs font-heading'>
                  {res}
                </p>
              )}
            />
            <p className='text-right text-3xs font-heading'>
              {data.category}
            </p>
            <Translate
              label="profile.titles.codebase"
              render={(res: string) => (
                <p className='text-3xs font-heading'>
                  {res}
                </p>
              )}
            />
            <p className='text-right text-3xs font-heading'>
              {data.codebase}
            </p>
            <Translate
              label="profile.titles.team"
              render={(res: string) => (
                <p className='text-3xs font-heading'>
                  {res}
                </p>
              )}
            />
            <p className='text-right text-3xs font-heading'>
              {data.team}
            </p>
          </div>
        </div>
        <div className='py-3 border-b border-solid border-dos-50'>
          <p className='text-3xs font-heading'>
            {data.description}
          </p>
          <Translate
            label="profile.website"
            render={(res: string) => (
              <a
                className='text-3xs font-heading'
                href={data.link}
              >
                {res}
              </a>
            )}
          />
        </div>
        <ul className='py-4'>
          {data.images.map((image: string, index: number) => {
            return (
              <li
                className='pb-4 last:pb-0'
                key={`image-${index}`}
              >
                <img
                  className='aspect-video'
                  src={image}
                  loading='lazy'
                />
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
