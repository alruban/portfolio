import React from 'react';

import Layout from '../layout/layout';
import Sidebar from '../components/sidebar';
import Portfolio from '../components/portfolio';
import About from '../components/about';
import Contact from '../components/contact';

const Index = () => (
  <Layout>
    <div className='w-full h-full p-6 animate-fade-in'>
      <div className='relative flex flex-col items-center w-full h-full border border-solid lg:flex-row border-primary'>
        <Sidebar/>

        <div className='max-lg:w-full flex flex-col h-full transition-all row-span-16 lg:row-span-1 lg:col-span-16 lg:flex-row lg:max-w-[65vw] w-full relative'>
          <Portfolio/>
          <Contact/>
          <About/>
        </div>

        <div
          className='absolute top-0 left-0 h-full transition-opacity opacity-0 pointer-events-none max-lg:hidden bg-overlay'
          style={{
            width: 'calc(100% - 432px)'
          }}
          data-overlay
        ></div>
      </div>
    </div>
  </Layout>
);

export default Index;
