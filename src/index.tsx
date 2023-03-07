
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TranslateProvider } from '@rubancorp/react-translate-json';

import App from './App';
import './translations/en.json';

const translationOptions = {
  pathPrefix: '',
  locale: 'en',
  fallbackLocale: 'en'
};

const StrictApp = () => (

    <TranslateProvider {...translationOptions}>
      <App />
    </TranslateProvider>

);

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(<StrictApp />);

module?.hot?.accept();
