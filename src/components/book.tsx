import React from 'react';

import Projects from './projects';

export default function Book() {

  return (
    <ul
      className='max-lg:w-full flex flex-col h-full transition-all lg:border-l border-solid row-span-16 lg:row-span-1 lg:col-span-16 border-dos-50 lg:flex-row min-w-[60%] max-w-[1089px]'
      data-portfolio-list
    >
      <Projects/>
    </ul>
  )
}
