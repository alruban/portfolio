import React, { MouseEvent } from 'react';
import { JSONSchema4 } from 'json-schema';

import profile from '../components/profile';
import projects from '../data/portfolio';

export default class Projects extends React.Component {
  isDesktop: boolean;
  currentProject: boolean | number;
  projectLoading: boolean;

  stateElements: {};
  portfolioElements: {};

  fadeOutClasses: Array<string>;

  constructor(props: {} | Readonly<{}>) {
    super(props);

    // Functional
    this.isDesktop = false;
    this.currentProject = false;
    this.projectLoading = false;

    // Elements
    this.stateElements = {
      navigation: "" as string | HTMLElement,
      container: "" as string | HTMLElement,
      title: "" as string | HTMLElement,
      year: "" as string | HTMLElement,
      reset: "" as string | HTMLElement,
    };

    this.portfolioElements = {
      portfolioList: "" as string | HTMLElement,
      portfolioItems: "" as string | HTMLElement,
    };

    // Classes
    this.fadeOutClasses = ["opacity-0", "pointer-events-none"];
  }

  componentDidMount(): void {
    this.stateElements = {
      navigation: document.querySelector("[data-state-navigation]"),
      container: document.querySelector("[data-state-container]"),
      title: document.querySelector("[data-state-title]"),
      year: document.querySelector("[data-state-year]"),
      reset: document.querySelector("[data-state-reset]"),
    };

    this.portfolioElements = {
      portfolioList: document.querySelector("[data-portfolio-list]"),
      portfolioItems: document.querySelectorAll("[data-portfolio-item]"),
    }

    this.handleViewport();
    this.handleReset();
  }

  handleReset() {
    this.stateElements.reset.addEventListener('click', () => {
      this.closeProject(this.currentProject)

      this.portfolioElements.portfolioItems.forEach((element: HTMLElement) => {
        element.classList.remove("hidden");
        element.style.height = 100 / projects.length + '%';
      });
    });

    document.addEventListener("Project:Opened", (e) => {
      if (!this.currentProject == false) {
        this.portfolioElements.portfolioItems.forEach((element, index) => {
          if (element != this.portfolioElements.portfolioItems[e.detail.index]) {
            this.closeProject(index);
            if (this.isDesktop) {
              element.style.width = 100 / projects.length + '%';
            } else {
              element.style.height = 100 / projects.length + '%';
            }
          }
        });
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.portfolioElements.portfolioList.contains(e.target)) {
        this.closeProject(this.currentProject);

        this.portfolioElements.portfolioItems.forEach((element: HTMLElement) => {
          if (this.isDesktop) {
            element.style.width = 100 / projects.length + '%';
          } else {
            element.style.height = 100 / projects.length + '%';
          }
        });
      }
    });
  }

  hardReset(exception: number) {
    this.portfolioElements.portfolioItems.forEach((element: HTMLElement, index: number) => {
      if (exception && element != this.portfolioElements.portfolioItems[exception]) {
        this.closeProject(index);
      } else {
        this.closeProject(index);
      }

      if (this.isDesktop) {
        element.style.width = 100 / projects.length + '%';
      } else {
        element.style.height = 100 / projects.length + '%';
      }
    });
  }

  handleViewport() {
    const mediaQuery = "(min-width: 1024px)";
    const mediaStatus = window.matchMedia(mediaQuery);

    const determineSize = (mediaStatus: MediaQueryList | MediaQueryListEvent) => {
      if (mediaStatus.matches) {
        this.isDesktop = true;
        this.portfolioElements.portfolioItems.forEach((element: HTMLElement) => {
          element.style.width = `${100 / projects.length}%`;
          element.style.height = null;
        });
      } else {
        this.isDesktop = false;
        this.portfolioElements.portfolioItems.forEach((element: HTMLElement) => {
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

    if (this.isDesktop) {
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

    this.currentProject = index;

    if (this.isDesktop) {
      el.style.width = "100%"
    } else {
      el.style.height = "100%"
    }

    elPreview.classList.add(...this.fadeOutClasses);
    elView.classList.remove(...this.fadeOutClasses);

    if (!this.isDesktop) {
      this.portfolioElements.portfolioItems.forEach((element: HTMLElement) => {
        if (element != this.portfolioElements.portfolioItems[index]) {
          element.classList.add("hidden");
        }
      });
    }

    document.documentElement.dispatchEvent(
      new CustomEvent("Project:Opened", {
        bubbles: true,
        detail: {
          index: index
        }
      }
    ));
  }

  closeProject(index: number) {
    const el = this.portfolioElements.portfolioItems[index];
    const elPreview = el.firstElementChild;
    const elView = el.lastElementChild;

    this.currentProject = false;

    elView.classList.add(...this.fadeOutClasses);
    elPreview.classList.remove(...this.fadeOutClasses);

    if (!this.isDesktop) {
      this.portfolioElements.portfolioItems.forEach((element: HTMLElement) => {
        if (element != this.portfolioElements.portfolioItems[index]) {
          element.classList.remove("hidden");
        }
      });
    }

    document.documentElement.dispatchEvent(
      new CustomEvent("Project:Closed", {
        bubbles: true,
        detail: {
          index: index
        }
      }
    ));
  }

  render() {
    return (
      projects.map((project: JSONSchema4, index: number) => {
        return (
          <li
            className='relative flex items-center justify-center px-3 overflow-hidden transition-all border-t border-solid cursor-pointer project lg:border-t-0 lg:border-r lg:last:border-r-0 text-md border-dos-50'
            data-portfolio-item
            onMouseEnter={(e) => {
              if (this.currentProject === false) {
                this.previewProject(e, index);
              }
            }}
            onMouseLeave={(e) => {
              if (this.currentProject === false) {
                this.previewProject(e, index);
                this.closeProject(index);
              }
            }}
            onMouseDown={() => {this.openProject(index)}}
            key={index}
          >
            {profile(project)}
          </li>
        )
      })
    )
  }
}
