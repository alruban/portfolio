import React, { useState, useEffect } from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default function Header() {

  function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState(null);

    useEffect(() => {
      let lastScrollY = window.pageYOffset;

      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        const direction = scrollY > lastScrollY ? "header--scrolled-down" : "header--scrolled-up";

        if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection);

      return () => {
        window.removeEventListener("scroll", updateScrollDirection);
      }
    }, [scrollDirection]);

    return scrollDirection;
  };

  const scrollDirection = useScrollDirection();

  return (
    <header
      className={`header ${scrollDirection}`}
      data-module="header"
    >
      <div className="header__inner container">
        <div className="header__body">
          <div className="header-banner">
            <a className="header-banner__title" href="/">
              <Translate label="global.title" render={(res) => res}/>

              <Translate label="global.email" render={(res) => (
                  <span className="header-banner__subtitle">{res}</span>
              )}/>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
