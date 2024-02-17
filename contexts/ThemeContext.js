// contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const preferredTheme = window.localStorage.getItem('theme');
    if (preferredTheme) {
      setTheme(preferredTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  

  const switchToLightMode = () => {
    window.localStorage.setItem('theme', 'light');
    setTheme('light');
  };

  const switchToDarkMode = () => {
    window.localStorage.setItem('theme', 'dark');
    setTheme('dark');
  };



const setThemeMode = (mode) => {
  const newTheme = mode === 'dark' ? 'dark' : 'light';
  setTheme(newTheme);
};


  return (
    <ThemeContext.Provider value={{ theme, switchToLightMode, switchToDarkMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};