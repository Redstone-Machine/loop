// contexts/LanguageContext.js
import React, { createContext, useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';

import { getUserIdFromSession } from '../utils/utils';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {


const router = useRouter();

//   const { data: session, status } = useSession();
//   const userId = getUserIdFromSession(session, status);
//   console.log('userId in LanguageContext:', userId);

  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const browserLanguage = navigator.language || navigator.languages[0];
    setLocale(browserLanguage.startsWith('sv') ? 'sv' : 'en');
  }, []);

  const switchToEnglish = () => setLocale('en');
  const switchToSwedish = () => setLocale('sv');

  const setLanguage = (language) => {
    const newLocale = language === 'swedish' ? 'sv' : 'en';
    setLocale(newLocale);
  };

  // const goHome = async () => {
  //   console.log('main-page load');
  //   await router.prefetch('/main-page');
  //   console.log('main-page loaded');
  //   router.push('/main-page');
  // }
  

  return (
    <LanguageContext.Provider value={{ locale, switchToEnglish, switchToSwedish, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};