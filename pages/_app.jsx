// pages/_app.js
import { IntlProvider } from 'react-intl';
import { SessionProvider } from "next-auth/react";
import messages_en from '../locales/en';
import messages_sv from '../locales/sv';
import App from 'next/app';

const messages = {
  'en': messages_en,
  'sv': messages_sv
};

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const { locale } = pageProps;
  return (
    <SessionProvider session={session}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Component {...pageProps} />
      </IntlProvider>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const locale = appContext.router.locale; // Hämta locale från router

  return { ...appProps, pageProps: { ...appProps.pageProps, locale } };
};

export default MyApp;