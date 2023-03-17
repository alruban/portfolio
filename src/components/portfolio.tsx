import React from 'react';

import Projects from './projects';
import Profiles from './profiles';

export default function Portfolio() {

  return (
    <div className='max-lg:w-full flex flex-col h-full transition-all row-span-16 lg:row-span-1 lg:col-span-16 lg:flex-row lg:max-w-[65vw] w-full relative'>
      <ul
        className='absolute w-full h-full'
        data-project-list
      >
        <Projects/>
      </ul>

      <ul
        className='absolute w-full h-full pointer-events-none lg:max-w-[432px] right-0'
        data-profile-list
      >
        <Profiles/>
      </ul>
    </div>
  )
}
