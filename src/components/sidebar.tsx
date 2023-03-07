import React, { useState, useEffect } from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default function Sidebar() {

  return (
    <aside className='relative flex-grow max-lg:w-full'>
      <div
        className='absolute w-full h-full my-5 transition-opacity opacity-0 pointer-events-none'
        data-state-container
      >
        <p
          className='mx-5 text-3xl font-normal leading-none sm:text-4xl lg:text-6xl xl:text-8xl 2xl:text-10xl font-heading'
          data-state-title
        ></p>
        <p
          className='mx-5 text-xl font-normal font-heading'
          data-state-year
        ></p>
      </div>
      <div
        className="m-5 transition-opacity"
        data-state-navigation
      >
        <a
          className="block font-medium leading-none"
          href="/"
        >
          <p className='text-3xl font-normal sm:text-4xl lg:text-6xl xl:text-8xl 2xl:text-10xl font-heading'>
          <Translate
            label="global.name"
            render={(res: string) => res}
          />
          </p>
          <p className='text-xl font-normal font-heading'>
            <Translate
              label="global.role"
              render={(res: string) => res}
            />
          </p>
        </a>
        <ul className='pt-6'>
          <li>
            <Translate
              label="navigation.portfolio"
              render={(res: string) => (
                <p className='text-md'>
                  {res}
                </p>
              )}
            />
          </li>
          <li>
            <Translate
              label="navigation.contact"
              render={(res: string) => (
                <p className='text-md'>
                  {res}
                </p>
              )}
            />
          </li>
          <li>
            <Translate
              label="navigation.about"
              render={(res: string) => (
                <p className='text-md'>
                  {res}
                </p>
              )}
            />
          </li>
        </ul>
      </div>
    </aside>
  )
}
