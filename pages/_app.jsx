// pages/_app.js
import { IntlProvider } from 'react-intl';
import { SessionProvider } from "next-auth/react";
import messages_en from '../locales/en';
import messages_sv from '../locales/sv';
import App from 'next/app';
import { getSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { LanguageProvider, LanguageContext } from '../contexts/LanguageContext';
import { ThemeProvider, ThemeContext } from '../contexts/ThemeContext';
import { ThemeColorProvider, ThemeColorContext } from '../contexts/ThemeColorContext';
import Head from 'next/head';

import React, { useState } from 'react';

import { useRouter } from 'next/router';


import Navbar from '../app/components/navbar';
import '../styles/styles.css';

const messages = {
  'en': messages_en,
  'sv': messages_sv
};

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }, []);





  return (
    // <LanguageProvider>
    //   <SessionProvider session={session}>
    //     <MyComponent Component={Component} pageProps={pageProps} />
    //   </SessionProvider>
    // </LanguageProvider>
    <SessionProvider session={session}>
      <LanguageProvider>
        <ThemeProvider>
          <ThemeColorProvider>
            <MyComponent Component={Component} pageProps={pageProps} />
          </ThemeColorProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}

function MyComponent({ Component, pageProps }) {
  const { locale, switchToEnglish, switchToSwedish } = useContext(LanguageContext);
  const { theme, switchToLightMode, switchToDarkMode } = useContext(ThemeContext);
  const { themeColor, setThemeColor } = useContext(ThemeColorContext);

  const [phoneLayout, setPhoneLayout] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleFocus = () => setIsKeyboardVisible(true);
    const handleBlur = () => setIsKeyboardVisible(false);
  
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);
  
    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, []);

  useEffect(() => {
    // Kontrollera skärmdimensionerna vid första renderingen
    checkScreenDimensions();

    // Lägg till en resize-händelselyssnare
    window.addEventListener('resize', checkScreenDimensions);

    // Rensa händelselyssnaren när komponenten avmonteras
    return () => {
      window.removeEventListener('resize', checkScreenDimensions);
    };
  }, []);


  const checkScreenDimensions = () => {
  //   isMobile = window.innerWidth <= 600;
    if (window.innerWidth <= 700) {
      setPhoneLayout(true);
    } else {
      setPhoneLayout(false);
    }
  };

  const router = useRouter();
  const activePage = router.pathname.split('/')[1]; // Get the active page
  const activeInsidePage = router.pathname.split('/')[2];

  const goHome = async () => {
    console.log('main-page load');
    await router.prefetch('/main-page');
    console.log('main-page loaded');
    router.push('/main-page');
  }

  const chatDistance = {
    height: 'calc(7rem + 16px)',
  };

  const mobileMenubarDistance = {
    height: 'calc(0.5rem + 125px)' // Adjust this value to match the height of your navbar
  };

  // const mainContentStyle = { 
  //   marginTop: 'calc(0.5rem + 80px)' // Adjust this value to match the height of your navbar
  // };


  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Navbar activePage={activePage} activeInsidePage={activeInsidePage} theme={theme} themeColor={themeColor} language={locale} />
      <Component {...pageProps} />
      <Head>
        <style>{`
          body {
            background-color: ${theme === 'light' ? 'white' : 'black'};
            color: ${theme === 'light' ? 'black' : 'white'};
          }
        `}</style>

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />

      </Head>

      {/* <br />
      <br /> */}


      {phoneLayout && !isKeyboardVisible && activePage !== 'login' &&
        <div style={mobileMenubarDistance}></div>
      }

      {activePage === 'chat' && activeInsidePage &&
        <div style={chatDistance}></div> 
      }

      {/* <button onClick={switchToEnglish}>Switch to English</button>
      <button onClick={switchToSwedish}>Byt till Svenska</button>
      <button onClick={switchToLightMode}>Switch to Light Mode</button>
      <button onClick={switchToDarkMode}>Switch to Dark Mode</button>
      <br />
      <button onClick={goHome}>Gå hem</button> */}

    </IntlProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const locale = appContext.router.locale;

  return { ...appProps, pageProps: { ...appProps.pageProps, locale } };
};

export default MyApp;