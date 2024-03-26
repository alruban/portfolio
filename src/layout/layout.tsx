import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';

/* Favicon Data */
import manifestJSON from '../favicons/site.webmanifest';
import browserconfigXML from '../favicons/browserconfig.xml';

/* Favicons */
import faviconICO from '../favicons/favicon.ico';
import favicon16x from '../favicons/favicon-16x16.png';
import favicon32x from '../favicons/favicon-32x32.png';
import faviconMs70x from '../favicons/mstile-70x70.png';
import faviconMs144x from '../favicons/mstile-144x144.png';
import faviconMs150x from '../favicons/mstile-150x150.png';
import faviconMs310x150 from '../favicons/mstile-310x150.png';
import faviconMs310x from '../favicons/mstile-310x310.png';
import faviconAppleIcon from '../favicons/apple-touch-icon.png';
import faviconAndroid192x from '../favicons/android-chrome-192x192.png';
import faviconAndroid512x from '../favicons/android-chrome-512x512.png';

import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

const analytics = Analytics({
  app: 'portfolio',
  plugins: [
    googleAnalytics({
      measurementIds: ["G-N6L9JCEVL5"]
    })
  ]
})

/* Track a page view */
analytics.page();

const Layout = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
  <HelmetProvider>
    <Helmet>
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

      <link rel="canonical" href="https://www.samuelclarke.dev"/>

      <title>Sam Clarke | Front End Developer</title>

      <meta name="author" content="Sam Clarke"/>
      <meta property="og:title" content="Sam Clarke | Front End Developer"/>
      <meta name="description" content="Portfolio of Web Development"/>
      <meta name="keywords" content="react, typescript, shopify, shopify plus, javascript, html, html5, css3, css, postcss, front end developer, web developer"/>

      <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0"/>

      <link rel="icon" type="image/x-icon" href={ faviconICO }/>
      <link rel="icon" type="image/png" sizes="16x16" href={ favicon16x }/>
      <link rel="icon" type="image/png" sizes="32x32" href={ favicon32x }/>

      <link rel="apple-touch-icon" href={ faviconAppleIcon }/>

      <link rel="icon" type="image/png" sizes="192x192" href={ faviconAndroid192x }/>
      <link rel="icon" type="image/png" sizes="152x512" href={ faviconAndroid512x }/>

      <link rel="manifest" href={ manifestJSON }/>

      <meta name="theme-color" content="#f1f4f7"/>
      <meta name="msapplication-TileColor" content="#f1f4f7"/>
      <meta name="msapplication-config" content={ browserconfigXML }/>

      <meta name="msapplication-TileImage" content={ faviconMs70x }/>
      <meta name="msapplication-TileImage" content={ faviconMs144x }/>
      <meta name="msapplication-TileImage" content={ faviconMs150x }/>
      <meta name="msapplication-TileImage" content={ faviconMs310x150 }/>
      <meta name="msapplication-TileImage" content={ faviconMs310x }/>
    </Helmet>

    <main className='w-full h-full'>
      {props.children}
    </main>
  </HelmetProvider>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  fullPage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Layout;
