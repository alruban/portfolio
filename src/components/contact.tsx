import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default function Contact() {
  return (
    <div
      className='absolute w-full h-full transition-opacity opacity-0 pointer-events-none'
      data-page="contact"
    >
      <div className='absolute translate-x-1/2 -translate-y-1/2 top-1/2 right-1/2'>
      <Translate
        label="global.github"
        render={(res: string) => (
          <a
            className='block text-lg cursor-pointer font-heading'
            href={`${res}`}
          >
            Github
          </a>
        )}
      />
      <Translate
        label="global.email"
        render={(res: string) => (
          <a
            className='block text-lg cursor-pointer font-heading'
            href={`mailto:${res}`}
          >
            {res}
          </a>
        )}
      />
      </div>
    </div>
  )
}
