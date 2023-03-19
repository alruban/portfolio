import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default function About() {
  return (
    <div
      className='absolute w-full h-full transition-opacity opacity-0 pointer-events-none'
      data-page="about"
    >
      <div className='absolute translate-x-1/2 -translate-y-1/2 top-1/2 right-1/2'>
        <Translate
          label="about.info"
          render={(res: string) => (
            <p className='text-lg cursor-default font-heading'>
              {res}
            </p>
          )}
        />
      </div>
    </div>
  )
}
