import React from 'react';

import CaseIcons from './caseIcons';
import CaseStudies from './caseStudies';

export default function Portfolio() {
  return (
    <div
      className='absolute w-full h-full transition-opacity'
      data-page="portfolio"
    >
      <ul
        className='absolute w-full h-full'
        data-project-list
      >
        <CaseIcons/>
      </ul>

      <ul
        className='absolute w-full h-full pointer-events-none lg:max-w-[432px] right-0'
        data-profile-list
      >
        <CaseStudies/>
      </ul>
    </div>
  )
}
