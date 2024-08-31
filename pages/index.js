import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]); // Depend on `router` to ensure it's available

  // rest of your code...

  
  // useEffect(() => {
  //   const setBackgroundColor = () => {
  //     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //     document.body.style.backgroundColor = isDarkMode ? 'black' : 'white';
  //   };

  //   setBackgroundColor(); // Set initial background color

  //   // Listen for changes in the color scheme
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   mediaQuery.addEventListener('change', setBackgroundColor);

  //   // Cleanup listener on component unmount
  //   return () => {
  //     mediaQuery.removeEventListener('change', setBackgroundColor);
  //   };
  // }, []);



  return (
    <div>
    </div>
  )
}

export default Index;
