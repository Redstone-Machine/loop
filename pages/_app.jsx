// pages/_app.js
import { IntlProvider } from 'react-intl';
import { SessionProvider } from "next-auth/react";
import messages_en from '../locales/en';
import messages_sv from '../locales/sv';
import App from 'next/app';
import { getSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { LanguageProvider, LanguageContext } from '../contexts/LanguageContext';
import { ThemeProvider, ThemeContext } from '../contexts/ThemeContext';
import { ThemeColorProvider, ThemeColorContext } from '../contexts/ThemeColorContext';
import Head from 'next/head';

// import React, { useState } from 'react';

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

  // useEffect(() => {
  //   console.log('useEffect hook triggered');
  
  //   const handleFocus = () => {
  //     console.log('Focus event triggered');
  //     setIsKeyboardVisible(true);
  //   };
  //   const handleBlur = () => {
  //     console.log('Blur event triggered');
  //     setIsKeyboardVisible(false);
  //   };
  
  //   window.addEventListener('focus', handleFocus);
  //   window.addEventListener('blur', handleBlur);
  
  //   return () => {
  //     window.removeEventListener('focus', handleFocus);
  //     window.removeEventListener('blur', handleBlur);
  //   };
  // }, []);
  useEffect(() => {
    const handleFocusIn = () => {
      console.log('FocusIn event triggered');
      setIsKeyboardVisible(true);
      // console.log('isKeyboardVisible should be true:', isKeyboardVisible);
    };
  
    const handleFocusOut = () => {
      console.log('FocusOut event triggered');
      setIsKeyboardVisible(false);
      // console.log('isKeyboardVisible:', isKeyboardVisible);
    };
  
    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
  
    // Initial check
    if (document.hasFocus()) {
      handleFocusIn();
    } else {
      handleFocusOut();
    }

    
  
    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    console.log('isKeyboardVisible updated:', isKeyboardVisible);
  }, [isKeyboardVisible]);

  // useEffect(() => {

  // }, [isKeyboardVisible]);

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

  // useEffect(() => {
  //   // Döljer tangentbordet när komponenten renderas

  // }, [isKeyboardVisible]);


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



  // Lista över sidor där skrollning ska vara avstängd
  const noScrollPages = ['login'];

  useEffect(() => {
    if (noScrollPages.includes(activePage)) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    setIsKeyboardVisible(false);
  }, [activePage, router.pathname]);



  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      if (window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock('portrait').catch((err) => {
          console.error('Orientation lock failed: ', err);
        });
      } else if (window.screen.lockOrientation) {
        window.screen.lockOrientation('portrait').catch((err) => {
          console.error('Orientation lock failed: ', err);
        });
      } else if (window.screen.mozLockOrientation) {
        window.screen.mozLockOrientation('portrait').catch((err) => {
          console.error('Orientation lock failed: ', err);
        });
      } else if (window.screen.msLockOrientation) {
        window.screen.msLockOrientation('portrait').catch((err) => {
          console.error('Orientation lock failed: ', err);
        });
      } else {
        console.warn('Screen orientation lock is not supported on this device.');
      }
    }
  }, []);



  const goHome = async () => {
    console.log('main-page load');
    await router.prefetch('/main-page');
    console.log('main-page loaded');
    router.push('/main-page');
  }

  const chatDistance = {
    height: 'calc(6rem + 16px)',
  };

  const mobileMenubarDistance = {
       height: 'calc(0.5rem + 125px)'
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


      {phoneLayout && !isKeyboardVisible && activePage !== 'login' && (
        <div
          style={mobileMenubarDistance}>
        </div>
      )}

      {activePage === 'chat' && activeInsidePage && (
        <div style={chatDistance}></div> 
      )}

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