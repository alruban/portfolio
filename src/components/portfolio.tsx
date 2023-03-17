import React from 'react';

import Projects from './projects';
import Profiles from './profiles';

export default function Portfolio() {
  return (
    <div
      className='absolute w-full h-full'
      data-page="portfolio"
    >
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
