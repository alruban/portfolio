import React from 'react';

import Layout from '../layout/layout';
import Sidebar from '../components/sidebar';
import Book from '../components/book';

const Index = () => (
  <Layout>
    <div className='relative flex flex-col items-center h-full frame lg:flex-row'>
      <Sidebar/>
      <Book/>
    </div>
  </Layout>
);

export default Index;