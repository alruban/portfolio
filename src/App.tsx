import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './layouts/layout';
import "./css/stylings.pcss";

const { PUBLIC_URL } = process.env;

const Home = lazy(() => import('./pages/home'));

const App = () => (
  <BrowserRouter basename={PUBLIC_URL}>
    <Suspense fallback={<Layout />}>
      <Routes>
        <Route exact path="/" element={<Home />}/>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;