import React from 'react';

import Layout from '../layout/layout';
import Sidebar from '../components/sidebar';
import Portfolio from '../components/portfolio';

const Index = () => (
  <Layout>
    <div className='relative flex flex-col items-center h-full frame lg:flex-row'>
      <Sidebar/>
      <Portfolio/>
    </div>
  </Layout>
);

export default Index;