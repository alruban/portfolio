import React from 'react';
import { JSONSchema4 } from 'json-schema';

import projects from '../data/portfolio';

import Profile from './profile';

export default class Profiles extends React.Component {
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
            className='absolute w-full h-full transition-opacity border-t border-solid opacity-0 cursor-pointer pointer-events-none lg:border-t-0 lg:border-l border-primary '
            data-profile-item
            key={index}
          >
            {Profile(project)}
          </li>
        )
      })
    )
  }
}
