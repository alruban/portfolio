import React, { MouseEvent } from 'react';
import { JSONSchema4 } from 'json-schema';

import profile from '../components/profile';
import projects from '../data/portfolio';

export default class Projects extends React.Component {
  viewport: string;

  stateElements: {};
  portfolioElements: {};

  fadeOutClasses: Array;

  constructor(props: {} | Readonly<{}>) {
    super(props);

    // Functional
    this.viewport = '';

    // Elements
    this.stateElements = {};
    this.portfolioElements = {};

    // Classes
    this.fadeOutClasses = ["opacity-0", "pointer-events-none"];
  }

  componentDidMount(): void {
    this.stateElements = {
      navigation: document.querySelector("[data-state-navigation]"),
      container: document.querySelector("[data-state-container]"),
      title: document.querySelector("[data-state-title]"),
      year: document.querySelector("[data-state-year]"),
    };

    this.portfolioElements = {
      portfolioList: document.querySelector("[data-portfolio-list]"),
      portfolioItems: document.querySelectorAll("[data-portfolio-item]"),
    }

    this.handleViewport();
  }

  handleViewport() {
    const mediaQuery = "(min-width: 1024px)";
    const mediaStatus = window.matchMedia(mediaQuery);

    const determineSize = (mediaStatus: MediaQueryList | MediaQueryListEvent) => {
      if (mediaStatus.matches) {
        this.viewport = 'desktop';
        this.portfolioElements.portfolioItems.forEach((element) => {
          element.style.width = `${100 / projects.length}%`;
          element.style.height = null;
        });
      } else {
        this.viewport = 'mobile';
        this.portfolioElements.portfolioItems.forEach((element) => {
          element.style.height = `${100 / projects.length}%`;
          element.style.width = null;
        });
      }
    }

    determineSize(mediaStatus)
    mediaStatus.addEventListener('change', (event) => determineSize(event));
  }

  /**
   * onMouseEnter, the currently selected [data-portfolio-item]'s
   * information is populated on-top of the navigation panel on the
   * right of the screen. onMouseLeave, the navigation panel returns
   * to its original form.
   *
   * @param mouseEvent;
   * @param project;
   */

  handleNavigationPreview(mouseEvent: MouseEvent, project: string) {
    if (mouseEvent.type == 'mouseenter') {
      this.stateElements.navigation?.classList.add(...this.fadeOutClasses);
      this.stateElements.container?.classList.remove(...this.fadeOutClasses);

      this.stateElements.title.textContent = project.name;
      this.stateElements.year.textContent = project.year;
    } else if (mouseEvent.type == 'mouseleave') {
      this.stateElements.navigation?.classList.remove(...this.fadeOutClasses);
      this.stateElements.container?.classList.add(...this.fadeOutClasses);

      this.stateElements.title.textContent = "";
      this.stateElements.year.textContent = "";
    }
  }

  /**
   *
   * @param MouseEvent
   * @param index
   */

  previewProject(mouseEvent: MouseEvent, index: number) {
    const el = this.portfolioElements.portfolioItems[index];
    const expand = mouseEvent.type === 'mouseenter';
    const contract = mouseEvent.type === 'mouseleave';

    let elementSize;

    if (expand) {
      elementSize = (100 / projects.length) * 2 + '%';
    } else if (contract) {
      elementSize = 100 / projects.length + '%';
    }

    if (this.viewport == 'desktop') {
      el.style.width = elementSize;
    } else {
      el.style.height = elementSize;
    }

    this.handleNavigationPreview(mouseEvent, projects[index]);
  }

  /**
   *
   * @param element
   */

  openProject(index: number) {
    const el = this.portfolioElements.portfolioItems[index];
    const elPreview = el.firstElementChild;
    const elView = el.lastElementChild;

    if (this.viewport == 'desktop') {
      el.style.width = "100%"
    } else {
      el.style.height = "100%"
    }

    elPreview.classList.add(...this.fadeOutClasses);
    elView.classList.remove(...this.fadeOutClasses);

    setTimeout(() => {
      elView.classList.remove(...this.fadeOutClasses);
    }, 150)
  }

  closeProject(index: number) {
    const el = this.portfolioElements.portfolioItems[index];
    const elPreview = el.firstElementChild;
    const elView = el.lastElementChild;

    elPreview.classList.remove(...this.fadeOutClasses);
    elView.classList.add("hidden", ...this.fadeOutClasses);
    setTimeout(() => el.lastElementChild.classList.remove("hidden"), 300)
  }

  render() {
    return (
      projects.map((project: JSONSchema4, index: number) => {
        return (
          <li
            className='relative flex items-center justify-center px-3 overflow-hidden transition-all border-t border-solid cursor-pointer project lg:border-t-0 lg:border-r lg:last:border-r-0 text-md border-dos-50'
            data-portfolio-item
            onMouseEnter={(e) => this.previewProject(e, index)}
            onMouseLeave={(e) => {
              this.previewProject(e, index);
              this.closeProject(index);
            }}
            onMouseDown={(e) => this.openProject(index)}
            key={index}
          >
            {profile(project)}
          </li>
        )
      })
    )
  }
}
