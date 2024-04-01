import { createContext, useState } from 'react';

export const ThemeColorContext = createContext();

export const ThemeColorProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState('blue');

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
};