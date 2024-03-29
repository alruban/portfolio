import React from 'react';
import { JSONSchema4 } from 'json-schema';

import projects from '../data/portfolio';

import CaseStudy from './caseStudy';

export default class CaseStudies extends React.Component {
  stateElements: any;
  portfolioElements: any;

  projects: any;

  constructor(props: {} | Readonly<{}>) {
    super(props);
  }

  render() {
    return (
      projects.map((project: JSONSchema4, index: number) => {
        return (
          <li
            className='absolute w-full h-full transition-opacity border-t border-solid opacity-0 pointer-events-none lg:border-t-0 lg:border-l border-primary '
            data-profile-item
            key={index}
          >
            {CaseStudy(project)}
          </li>
        )
      })
    )
  }
}
