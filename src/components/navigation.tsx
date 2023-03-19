import React from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default class Navigation extends React.Component {
  state: {
    current: string
  }

  navigationItems!: NodeListOf<Element>;

  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      current: "portfolio"
    };
  }

  componentDidMount(): void {
    this.navigationItems = document.querySelectorAll("[data-navigation-item]");
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
        className="overflow-hidden transition-all max-lg:max-h-20"
        data-state-navigation
      >
        <a
          className="block mx-5 mt-5 font-medium leading-none w-fit"
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
        <ul className='pt-6 mx-5 mb-5'>
          <li
            className='pb-3 last:pb-0'
            key={1}
          >
            <Translate
              label="navigation.portfolio"
              render={(res: string) => (
                <div className='relative'>
                  <button
                    className='leading-none transition-opacity opacity-0 text-md 2xl:text-lg font-heading'
                    data-navigation-item
                    onMouseEnter={(e) => {
                      if (this.state.current == "portfolio") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0");
                    }}
                    onMouseLeave={(e) => {
                      if (this.state.current == "portfolio") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.remove("opacity-0");
                      line.classList.add("opacity-0");
                    }}
                    onClick={(e) => {
                      if (this.state.current == "portfolio") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      this.state.current = "portfolio";
                      this.loadPage("portfolio")

                      this.navigationItems.forEach((item) => {
                        const itemLine = item.nextSibling as HTMLElement;

                        if (item != target) {
                          item.classList.remove("opacity-0");
                          itemLine.classList.add("opacity-0")
                        }
                      })

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0");
                    }}
                    type='button'
                  >
                    {res}
                  </button>
                  <div className='absolute w-[60px] h-[2px] top-[6px] bg-dos-50 transition-opacity pointer-events-none'></div>
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
                    data-navigation-item
                    onMouseEnter={(e) => {
                      if (this.state.current == "contact") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0");
                    }}
                    onMouseLeave={(e) => {
                      if (this.state.current == "contact") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.remove("opacity-0");
                      line.classList.add("opacity-0")
                    }}
                    onClick={(e) => {
                      if (this.state.current == "contact") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      this.state.current = "contact";
                      this.loadPage("contact")

                      this.navigationItems.forEach((item) => {
                        const itemLine = item.nextSibling as HTMLElement;

                        if (item != target) {
                          item.classList.remove("opacity-0");
                          itemLine.classList.add("opacity-0")
                        }
                      })

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0");
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
                    data-navigation-item
                    onMouseEnter={(e) => {
                      if (this.state.current == "about") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0")
                    }}
                    onMouseLeave={(e) => {
                      if (this.state.current == "about") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      target.classList.remove("opacity-0");
                      line.classList.add("opacity-0")
                    }}
                    onMouseDown={(e) => {
                      if (this.state.current == "about") return;

                      const target = e.target as HTMLElement;
                      const line = target.nextSibling as HTMLElement;

                      this.state.current = "about";
                      this.loadPage("about")

                      this.navigationItems.forEach((item) => {
                        const itemLine = item.nextSibling as HTMLElement;

                        if (item != target) {
                          item.classList.remove("opacity-0");
                          itemLine.classList.add("opacity-0")
                        }
                      })

                      target.classList.add("opacity-0");
                      line.classList.remove("opacity-0");
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
