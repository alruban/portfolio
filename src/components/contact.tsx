import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default function Contact() {
  return (
    <div
      className='absolute w-full h-full opacity-0 pointer-events-none'
      data-page="contact"
    >
      <Translate
        label="navigation.portfolio"
        render={(res: string) => (
          <button
            className='leading-none text-md font-heading'
            onClick={() => this.loadPage("portfolio")}
            type='button'
          >
            {res}
          </button>
        )}
      />
    </div>
  )
}
