import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default function Sidebar() {
  return (
    <aside className='relative flex-grow max-lg:w-full'>
      <div
        className='absolute w-full h-full my-5 transition-opacity opacity-0 pointer-events-none'
        data-state-container
      >
        <p
          className='mx-5 text-3xl font-normal leading-none sm:text-4xl lg:text-7xl 2xl:text-8xl font-heading'
          data-state-title
        ></p>
        <p
          className='mx-5 text-lg font-normal sm:text-xl lg:text-2xl 2xl:text-3xl font-heading'
          data-state-category
        ></p>
        <p
          className='absolute bottom-0 left-0 mx-5 text-lg font-normal sm:text-xl lg:text-2xl 2xl:text-3xl font-heading'
          data-state-codebase
        ></p>
      </div>
      <div
        className="m-5 transition-opacity"
        data-state-navigation
      >
        <a
          className="block font-medium leading-none w-fit"
          href="/"
        >
          <p className='text-3xl font-normal leading-none sm:text-5xl lg:text-7xl 2xl:text-8xl font-heading'>
          <Translate
            label="global.name"
            render={(res: string) => res}
          />
          </p>
          <p className='text-lg font-normal sm:text-xl lg:text-2xl 2xl:text-3xl font-heading'>
            <Translate
              label="global.role"
              render={(res: string) => res}
            />
          </p>
        </a>
        <ul className='pt-6'>
          <li
            className='pb-3 last:pb-0'
            key={1}
          >
            <Translate
              label="navigation.portfolio"
              render={(res: string) => (
                <button
                  className='leading-none text-md'
                  type='button'
                >
                  {res}
                </button>
              )}
            />
          </li>
          <li
            className='pb-3 last:pb-0'
            key={2}
          >
            <Translate
              label="navigation.contact"
              render={(res: string) => (
                <button
                  className='leading-none text-md'
                  type='button'
                >
                  {res}
                </button>
              )}
            />
          </li>
          <li
            className='pb-3 last:pb-0'
            key={3}
          >
            <Translate
              label="navigation.about"
              render={(res: string) => (
                <button
                  className='leading-none text-md'
                  type='button'
                >
                  {res}
                </button>
              )}
            />
          </li>
        </ul>
      </div>
    </aside>
  )
}
