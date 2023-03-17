import React, { MouseEvent } from 'react';
import { JSONSchema4 } from 'json-schema';

/* SVGs */
import Patchworks from '../svgs/svg-project-patchworks.svg';
import Freetrain from '../svgs/svg-project-freetrain.svg';
import Climpsons from '../svgs/svg-project-climpsons.svg';
import Hairgain from '../svgs/svg-project-hairgain.svg';
import ALTMLK from '../svgs/svg-project-altmlk.svg';
import Smiley from '../svgs/svg-project-smiley.svg';
import Cedar from '../svgs/svg-project-cedar.svg';
import Orb from '../svgs/svg-project-orb.svg';

import customEvent from '../utils/customEvent';

import projects from '../data/portfolio';

type project = {
  name?: string;
  link?: string;
  category?: string;
  team?: string;
  role?: string;
  description?: string;
}

export default class Projects extends React.Component {
  isDesktop: boolean;
  currentProject: number;
  projectLoading: boolean;

  stateElements: any;
  projectElements: any;
  profileElements: any;

  projects: any;
  fadeOutClasses: Array<string>;

  constructor(props: {} | Readonly<{}>) {
    super(props);

    // Functional
    this.isDesktop = false;
    this.currentProject = -1;
    this.projectLoading = false;

    // Elements
    this.stateElements = {};
    this.projectElements = {};
    this.profileElements = {};

    // Classes
    this.fadeOutClasses = ["opacity-0", "pointer-events-none"];
  }

  /**
   * Assigns component-relevant elements to their respective objects
   * once the Projects component has been loaded, then initialises methods
   * that are essential to applying the appropriate style to the component,
   * and various events used for reseting the component to its original state.
   */

  componentDidMount(): void {
    Object.assign(this.stateElements, {
      navigation: document.querySelector("[data-state-navigation]"),
      container: document.querySelector("[data-state-container]"),
      title: document.querySelector("[data-state-title]"),
      category: document.querySelector("[data-state-category]"),
    })

    Object.assign(this.projectElements, {
      projectList: document.querySelector("[data-project-list]"),
      projectItems: document.querySelectorAll("[data-project-item]"),
    })

    Object.assign(this.profileElements, {
      profileList: document.querySelector("[data-profile-list]"),
      profileItems: document.querySelectorAll("[data-profile-item]"),
      profileResets: document.querySelectorAll("[data-profile-reset]"),
    })

    this.handleViewport();
    this.randomiseProjectPlacement();
    this.closeEvents();

    window.addEventListener("resize", () => {
      this.randomiseProjectPlacement();
    });
  }

  /**
   * Determines the user's viewport, the sizing of each project list item is determined
   * using JS, the values used in that process change depending on the users viewport.
   *
   * We also set a globally accessible property to store the current viewport value,
   * so that alternate processes and stylings can be applied inside of each method,
   * depending on the current viewport.
   */

  handleViewport() {
    const mediaQuery = "(min-width: 1024px)";
    const mediaStatus = window.matchMedia(mediaQuery);

    const determineSize = (mediaStatus: MediaQueryList | MediaQueryListEvent) => {
      if (mediaStatus.matches) {
        this.isDesktop = true;
      } else {
        this.isDesktop = false;
      }
    }

    determineSize(mediaStatus)
    mediaStatus.addEventListener('change', (event) => determineSize(event));
  }

  /**
   * These events are used to reset the component to its starting state/styling.
   * Each event has a small write-up about what it's achieving...
   */

  closeEvents() {
    this.profileElements.profileResets.forEach((reset: HTMLElement, index: number) => {
      reset.addEventListener("click", () => {
        this.closeProject(index)
      });
    });
  }

  /**
   * When a onMouseDown event is fired on any project element,
   * the project element expands, and reveals a document with
   * more information about the selected project.
   *
   * Any other currently open projects are closed, but
   * this functionality occurs external to this method.
   *
   * @param element
   */

  openProject(index: number) {
    this.profileElements.profileList.classList.remove("pointer-events-none");

    const el = this.profileElements.profileItems[index];
    el.classList.remove(...this.fadeOutClasses);

    this.currentProject = index;

    customEvent("Project:Opened", {
      index: index
    });
  }

  /**
   * onMouseEnter, the currently selected [data-project-item]'s
   * information is populated on-top of the navigation panel on the
   * left of (or at the top of on mobile) the screen. onMouseLeave,
   * the navigation panel returns to its original form.
   *
   * @param mouseEvent;
   * @param index;
   */

  resetPreview() {
    this.stateElements.navigation?.classList.remove(...this.fadeOutClasses);
    this.stateElements.container?.classList.add(...this.fadeOutClasses);

    this.stateElements.title.textContent = "";
    this.stateElements.category.textContent = "";
  }

  previewProject(mouseEvent: MouseEvent, index: number) {
    if (this.projectElements.projectItems) {
      if (this.currentProject !== -1) return;

      if (mouseEvent.type == 'mouseenter') {
        this.stateElements.navigation?.classList.add(...this.fadeOutClasses);
        this.stateElements.container?.classList.remove(...this.fadeOutClasses);

        this.stateElements.title.textContent = projects[index].name;
        this.stateElements.category.textContent = projects[index].category;
      } else if (mouseEvent.type == 'mouseleave') {
        this.resetPreview();
      }
    }
  }

   /**
   * When a onMouseDown event is fired on any project element,
   * the project element closes, and hides a document with
   * more information about the selected project.
   *
   * @param index
   */

  closeProject(index: number) {
    this.profileElements.profileList.classList.add("pointer-events-none");

    const el = this.profileElements.profileItems[index];
    el.classList.add(...this.fadeOutClasses);

    this.currentProject = -1;

    this.resetPreview();

    customEvent("Project:Closed", {
      index: index
    });
  }

  randomiseProjectPlacement() {
    const Bounds = (el, pad = 20) => {
      const box = el?.getBoundingClientRect() ?? {
        left: 0, top: 0,
        right: this.projectElements.projectList.offsetWidth - 100, bottom: this.projectElements.projectList.offsetHeight - 100,
        width: this.projectElements.projectList.offsetWidth - 100, height: this.projectElements.projectList.offsetHeight - 100
      };

      return {
        l: box.left - pad,
        t: box.top - pad,
        r: box.right + pad,
        b: box.bottom + pad,
        w: box.width + pad * 2,
        h: box.height + pad * 2,
        overlaps(bounds) {
          return !(
            this.l > bounds.r ||
            this.r < bounds.l ||
            this.t > bounds.b ||
            this.b < bounds.t
          );
        },
        moveTo(x, y) {
          this.r = (this.l = x) + this.w;
          this.b = (this.t = y) + this.h;
          return this;
        },
        placeElement() {
          if (el) {
            el.style.top = (this.t + pad) + "px";
            el.style.left = (this.l + pad) + "px";
          }
          return this;
        }
      };
    }

    const TRIES_PER_BOX = 50;
    const randUint = range => Math.random() * range | 0;
    const placing  = [...this.projectElements.projectItems].map(el => Bounds(el, 5));
    const fitted = [];
    const areaToFit = Bounds();

    let maxTries = TRIES_PER_BOX * placing.length;

    while (placing.length && maxTries > 0) {
      let i = 0;
      while (i < placing.length) {
        const box = placing[i];
        box.moveTo(randUint(areaToFit.w - box.w), randUint(areaToFit.h - box.h));

        if (fitted.every(placed => !placed.overlaps(box))) {
          fitted.push(placing.splice(i--, 1)[0].placeElement());
        } else { maxTries-- }
        i++;
      }
    }
  }

  render() {
    return (
      projects.map((project: JSONSchema4, index: number) => {
        return (
          <li
            className='absolute transition-all cursor-pointer h-[10%] w-[20%] lg:w-[14%] floating drop-shadow'
            data-project-item
            data-float='0.5'

            onMouseEnter={(e) => {
              if (this.currentProject === -1) {
                this.previewProject(e, index);
              }
            }}

            onMouseLeave={(e) => {
              if (this.currentProject === -1) {
                this.previewProject(e, index);
              }
            }}
            onMouseDown={(e) => {
              if (this.currentProject === -1) {
                this.openProject(index);
              }
            }}
            key={index}
          >
            {
              project.name == 'Patchworks' ? <Patchworks/> :
              project.name == 'Climpson & Sons' ? <Climpsons/> :
              project.name == 'Freetrain' ? <Freetrain/> :
              project.name == 'Cedar & Hyde' ? <Cedar/> :
              project.name == 'Hairgain' ? <Hairgain/> :
              project.name == 'ALTMLK' ? <ALTMLK/> :
              project.name == 'Smiley' ? <Smiley/> :
              project.name == 'Orb' ? <Orb/> :
              false
            }
          </li>
        )
      })
    )
  }
}
