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
                <div className='relative'>
                  <button
                    className='leading-none transition-opacity text-md 2xl:text-lg font-heading'
                    onClick={() => this.loadPage("portfolio")}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0");
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.remove("opacity-0");
                      line.classList.add("opacity-0");
                    }}
                    type='button'
                  >
                    {res}
                  </button>
                  <div className='absolute w-[60px] h-[2px] top-[6px] bg-dos-50 transition-opacity opacity-0 pointer-events-none'></div>
                </div>
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
                <div className='relative'>
                  <button
                    className='leading-none transition-opacity text-md 2xl:text-lg font-heading'
                    onClick={() => this.loadPage("contact")}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0")
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.remove("opacity-0");
                      line.classList.add("opacity-0")
                    }}
                    type='button'
                  >
                    {res}
                  </button>
                  <div className='absolute w-[60px] h-[2px] top-[6px] bg-dos-50 transition-opacity opacity-0 pointer-events-none'></div>
                </div>
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
                <div className='relative'>
                  <button
                    className='leading-none transition-opacity text-md 2xl:text-lg font-heading'
                    onClick={() => this.loadPage("about")}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0")
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.remove("opacity-0");
                      line.classList.add("opacity-0")
                    }}
                    type='button'
                  >
                    {res}
                  </button>
                  <div className='absolute w-[60px] h-[2px] top-[6px] bg-dos-50 transition-opacity opacity-0 pointer-events-none'></div>
                </div>
              )}
            />
          </li>
        </ul>
      </div>
    )
  }
}
