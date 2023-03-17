import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

import Navigation from './navigation';

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
      <Navigation/>
    </aside>
  )
}
