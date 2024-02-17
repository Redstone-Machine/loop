// hooks/usePageSetup.js

import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { getUserIdFromSession } from '../utils/utils';

import useSWR from 'swr';

async function fetcher(url) {
    const res = await fetch(url)
    return res.json()
  }

export const usePageSetup = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const userId = getUserIdFromSession(session, status);

  const { setLanguage } = useContext(LanguageContext);
  const [userLanguage, setUserLanguage] = useState(null);

  const { setThemeMode } = useContext(ThemeContext);
  const [userTheme, setUserTheme] = useState(null);
  const [theme, setTheme] = useState(null);

  const [userName, setUsername] = useState(null);
  
  const { data: users, error } = useSWR('/api/getUsers', fetcher)

  useEffect(() => {
    if (userId) {
      fetch(`/api/getUserLanguageById?id=${userId}`)
      .then(response => response.json())
      .then(data => {
        setUserLanguage(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (userLanguage && userLanguage !== 'automatic') {
      if (userLanguage == 'swedish') {
        setLanguage('swedish');
      }
      else if (userLanguage == 'english') {
        setLanguage('english');
      }
    }
  }, [userLanguage]);

  useEffect(() => {
    // Kontrollera webbläsarens preferens
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    // Sätt temat till mörkt om webbläsaren föredrar det, annars ljust
    setTheme(prefersDarkMode ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/getUserThemeById?id=${userId}`)
      .then(response => response.json())
      .then(data => {
        setUserTheme(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (userTheme && userTheme !== 'automatic') {
        if (userTheme == 'light') {
          setThemeMode('light');
          setTheme('light');
        }
        else if (userTheme == 'dark') {
          setThemeMode('dark');
          setTheme('dark');
        }
    } else if (userTheme == 'automatic') {
      setThemeMode(theme);
    }
  }, [userTheme]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/getUserUsernameById?id=${userId}`)
      .then(response => response.json())
      .then(data => {
        setUsername(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('User is not logged in')
      router.push('/login');
    } else if (status === 'authenticated') {
      console.log('User is logged in:', session)
    }
  }, [status, session])

  return { userId, userName, session, status, userLanguage, userTheme, theme, users, error, router };
};