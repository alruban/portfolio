import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './layout/layout';
import "./css/main.pcss";

const { PUBLIC_URL } = process.env;

const Home = lazy(() => import('./pages/home'));

const App = () => (
  <BrowserRouter basename={PUBLIC_URL}>
    <Suspense fallback={<Layout />}>
      <Routes>
        <Route path="/" element={<Home />}/>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;