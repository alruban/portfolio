import React, { useState, useEffect } from 'react';
import { Translate } from '@rubancorp/react-translate-json/react';

export default function Header() {

  function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<string | null>(null);

    useEffect(() => {
      let lastScrollY = window.pageYOffset;

      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        const direction = scrollY > lastScrollY ? "header--scrolled-down" : "header--scrolled-up";

        if (direction && direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
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
      className={`${scrollDirection}`}
      data-module="header"
    >
      <div className="container">
        <div className="">
          <div className="">
            <a
              className="text-2xl font-heading"
              href="/"
            >
              <Translate
                label="global.title"
                render={(res: string) => res}
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
