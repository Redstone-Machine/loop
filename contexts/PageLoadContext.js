import { createContext, useState } from 'react';

export const PageLoadContext = createContext();

export const PageLoadProvider = ({ children }) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  return (
    <PageLoadContext.Provider value={{ isPageLoaded, setIsPageLoaded }}>
      {children}
    </PageLoadContext.Provider>
  );
};