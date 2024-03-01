// pages/_app.js
import { IntlProvider } from 'react-intl';
import { SessionProvider } from "next-auth/react";
import messages_en from '../locales/en';
import messages_sv from '../locales/sv';
import App from 'next/app';
import { getSession } from 'next-auth/react';
import { useContext } from 'react';
import { LanguageProvider, LanguageContext } from '../contexts/LanguageContext';
import { ThemeProvider, ThemeContext } from '../contexts/ThemeContext';
import Head from 'next/head';

const messages = {
  'en': messages_en,
  'sv': messages_sv
};

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // <LanguageProvider>
    //   <SessionProvider session={session}>
    //     <MyComponent Component={Component} pageProps={pageProps} />
    //   </SessionProvider>
    // </LanguageProvider>
    <SessionProvider session={session}>
      <LanguageProvider>
        <ThemeProvider>
           <MyComponent Component={Component} pageProps={pageProps} />
        </ThemeProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}

function MyComponent({ Component, pageProps }) {
  const { locale, switchToEnglish, switchToSwedish, goHome } = useContext(LanguageContext);
  const { theme, switchToLightMode, switchToDarkMode } = useContext(ThemeContext);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
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
          <br />
          <br />    
      <button onClick={switchToEnglish}>Switch to English</button>
      <button onClick={switchToSwedish}>Byt till Svenska</button>
      <button onClick={switchToLightMode}>Switch to Light Mode</button>
      <button onClick={switchToDarkMode}>Switch to Dark Mode</button>
      <br />
      <button onClick={goHome}>Gå hem</button>
    </IntlProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const locale = appContext.router.locale;

  return { ...appProps, pageProps: { ...appProps.pageProps, locale } };
};

export default MyApp;