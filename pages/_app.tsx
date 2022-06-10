import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import Script from 'next/script'
import Head from "next/head";
import { theme } from '../styles/global'
// Modules
import { AppProps } from 'next/app';

// import * as gtag from "../lib/gtag ";
const isProduction = process.env.NODE_ENV === "production";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {

  return (
    <ChakraProvider theme={theme}>
      <Script
        src="https://widget.Cloudinary.com/v2.0/global/all.js"
        type="text/javascript"
        key="cloudinary"
      />
      <Script id="my-script" src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        key="netlify" />

      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;