import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default class Navigation extends React.Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);
  }

  loadPage(id: string) {
    const pages = document.querySelectorAll(`[data-page]`);
    const currentPage = document.querySelector(`[data-page=${id}]`);

    if (pages.length > 1)
      pages.forEach((page) => {
        if (page != currentPage) {
          page.classList.add("pointer-events-none", "opacity-0");
        }
      });

    currentPage?.classList.remove("pointer-events-none", "opacity-0");
  }

  render() {
    return (
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
                  className='leading-none text-md font-heading'
                  onClick={() => this.loadPage("portfolio")}
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
                  className='leading-none text-md font-heading'
                  onClick={() => this.loadPage("contact")}
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
                  className='leading-none text-md font-heading'
                  onClick={() => this.loadPage("about")}
                  type='button'
                >
                  {res}
                </button>
              )}
            />
          </li>
        </ul>
      </div>
    )
  }
}
