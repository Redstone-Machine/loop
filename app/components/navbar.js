// components/navbar.js
import { LanguageContext } from '../../contexts/LanguageContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ThemeColorContext } from '../../contexts/ThemeColorContext';



import { useState, useEffect, useContext, act } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { delay, throttle, transform } from 'lodash';
import { Head } from 'next/head';

import { signOut } from 'next-auth/react';

import { getUserIdFromSession } from '../../utils/utils';

import ThemeButton from '../../public/svg_icons/navbar_icons/theme_button';
import LanguageButton from '../../public/svg_icons/navbar_icons/language_button';
import GoBackButton from '../../public/svg_icons/navbar_icons/go_back_button';

import ProfileIcon from '../../public/svg_icons/navbar_icons/profile_icon';
import SettingsIcon from '../../public/svg_icons/navbar_icons/settings_icon';
import LogoutIcon from '../../public/svg_icons/navbar_icons/logout_icon';

import LowerMenubarBackground from '../../public/navbar_background/svg/lower_navbar_background_smal';


import LoopLogo from '../../public/svg_icons/loop_logo';

import { useRef } from 'react';
import { ifError } from 'assert';


import { IntlProvider } from 'react-intl';
import useSWR, { mutate } from 'swr';


import { FormattedMessage } from 'react-intl';
import { margin } from '@mui/system';

const Navbar = ({ activePage, activeInsidePage, theme, language }) => {



  


  // console.log('activePage:', activePage);
  // console.log('activeInsidePage:', activeInsidePage);
  // console.log('language:', language);

  const { data: session, status } = useSession();
  const userId = getUserIdFromSession(session, status);

  const router = useRouter();

  const { themeColor } = useContext(ThemeColorContext);

  const { switchToEnglish, switchToSwedish } = useContext(LanguageContext);
  const { switchToDarkMode, switchToLightMode } = useContext(ThemeContext);

  const { reciverUserId } = router.query;

  const [browserLanguage, setBrowserLanguage] = useState('en');

  const [phoneLayout, setPhoneLayout] = useState(false);

  const [userTheme, setUserTheme] = useState(null);
  const [theTheme, setTheTheme] = useState(null);
  const [themeMode, setThemeMode] = useState(null);

  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [chatProfilePictureUrl, setChatProfilePictureUrl] = useState(null);
  const [chatProfileUserName, setChatProfileUserName] = useState(null);
  const [chatProfileBool, setChatProfileBool] = useState(false);
  const [userLanguage, setUserLanguage] = useState(null);

  const [showLowerMenubar, setShowLowerMenubar] = useState(true);
  const [showLowerMenubarAnimation, setShowLowerMenubarAnimation] = useState(true);

  const [expandMobileLowerMenubar, setExpandMobileLowerMenubar] = useState(false);
  
  const [hoverLanguage, setHoverLanguage] = useState(false);
  const [hoverTheme, setHoverTheme] = useState(false);
  const [hoverNotification, setHoverNotification] = useState(false);
  const [hoverGoBack, setHoverGoBack] = useState(false);

  const [showProfilePopUpMenu, setShowProfilePopUpMenu] = useState(false);
  const [removeProfilePopUpMenu, setRemoveProfilePopUpMenu] = useState(false);
  const [skipRemoveProfilePopUpMenu, setSkipRemoveProfilePopUpMenu] = useState(false);

  const [showLanguagePopUpMenu, setShowLanguagePopUpMenu] = useState(false);
  const [removeLanguagePopUpMenu, setRemoveLanguagePopUpMenu] = useState(false);
  const [skipRemoveLanguagePopUpMenu, setSkipRemoveLanguagePopUpMenu] = useState(false);

  const [showThemePopUpMenu, setShowThemePopUpMenu] = useState(false);
  const [removeThemePopUpMenu, setRemoveThemePopUpMenu] = useState(false);
  const [skipRemoveThemePopUpMenu, setSkipRemoveThemePopUpMenu] = useState(false);

  const [chatProfileImageLoaded, setChatProfileImageLoaded] = useState(false);
  
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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

  useEffect(() => {
    if (!showThemePopUpMenu) {
      closeThemePopUpMenu();
    }
    if (!showLanguagePopUpMenu) {
      closeLanguagePopUpMenu();
    }
    if (!showProfilePopUpMenu) {
      closeProfilePopUpMenu();
    }
  }, [activePage]);

  

  

  const checkScreenDimensions = () => {
  //   isMobile = window.innerWidth <= 600;
    if (window.innerWidth <= 700) {
      setPhoneLayout(true);
      setShowProfilePopUpMenu(false);
      setShowLanguagePopUpMenu(false);
      setShowThemePopUpMenu(false);
    } else {
      setPhoneLayout(false);
    }
  };

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
    
    setShowLowerMenubarAnimation(false);
    setShowLowerMenubar(true);
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 1000); // 2000 millisekunder = 2 sekunder

    return () => clearTimeout(timer); // Rensa timeout om komponenten avmonteras
  }, []);


  // useEffect(() => {
  //   // Denna effekt körs varje gång phoneLayout, isKeyboardVisible eller expandMobileLowerMenubar förändras
  //   // Du kan lägga till logik här om du behöver utföra någon åtgärd när dessa tillstånd förändras
  // }, [phoneLayout, isKeyboardVisible, expandMobileLowerMenubar]);



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
    if (userTheme && userTheme !== 'automatic') {
      if (userTheme == 'light') {
        setThemeMode('light');
      }
      else if (userTheme == 'dark') {
        setThemeMode('dark');
      }
    } else if (userTheme == 'automatic') {
      setThemeMode(theme);
    }
  }, [userId, userTheme]);



  // console.log('userLanguage:', userLanguage);

  const goBack = () => {
    router.back();
  };

  const closeProfilePopUpMenu = async () => {
    setShowProfilePopUpMenu(false);
    setTimeout(() => setRemoveProfilePopUpMenu(true), 400);
  };

  const toggleProfilePopUpMenu = throttle(() => {
    if (showProfilePopUpMenu) {
      closeProfilePopUpMenu();
    } else {
      closeLanguagePopUpMenu();
      closeThemePopUpMenu();

      setSkipRemoveProfilePopUpMenu(true);
      setRemoveProfilePopUpMenu(false);
      setShowProfilePopUpMenu(true);
      setTimeout(() => setSkipRemoveProfilePopUpMenu(false), 400);
    }
  }, 300);

  const closeLanguagePopUpMenu = async () => {
    setShowLanguagePopUpMenu(false);
    setTimeout(() => setRemoveLanguagePopUpMenu(true), 400);
  };

  const toggleLanguagePopUpMenu = throttle(() => {
    if (showLanguagePopUpMenu) {
      closeLanguagePopUpMenu();
    } else {
      closeProfilePopUpMenu();
      closeThemePopUpMenu();

      setSkipRemoveLanguagePopUpMenu(true);
      setRemoveLanguagePopUpMenu(false);
      setShowLanguagePopUpMenu(true);
      setTimeout(() => setSkipRemoveLanguagePopUpMenu(false), 400);
    }
  }, 300);

  const closeThemePopUpMenu = async () => {
    setShowThemePopUpMenu(false);
    setTimeout(() => setRemoveThemePopUpMenu(true), 400);
  };

  const toggleThemePopUpMenu = throttle(() => {
    if (showThemePopUpMenu) {
      closeThemePopUpMenu();
    } else {
      closeProfilePopUpMenu();
      closeLanguagePopUpMenu();

      setSkipRemoveThemePopUpMenu(true);
      setRemoveThemePopUpMenu(false);
      setShowThemePopUpMenu(true);
      setTimeout(() => setSkipRemoveThemePopUpMenu(false), 400);
    }
  }, 300);




  useEffect(() => {
    const fetchProfilePicture = async () => {
      const response = await fetch(`/api/getProfilePictureById?id=${userId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setProfilePictureUrl(url);
      }
    };
    
    if (userId) {
      fetchProfilePicture();
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log(event.target);
      // console.log(event.target.closest('.profilePopUpMenu'));
      // console.log('skipRemoveProfilePopUpMenu:', skipRemoveProfilePopUpMenu);
      // console.log('showProfilePopUpMenu:', showProfilePopUpMenu);
      if (!skipRemoveProfilePopUpMenu && showProfilePopUpMenu && !event.target.closest('.profilePopUpMenu')) {
        closeProfilePopUpMenu();
      }
      if (!skipRemoveLanguagePopUpMenu && showLanguagePopUpMenu && !event.target.closest('.languagePopUpMenu')) {
        closeLanguagePopUpMenu();
      }
      if (!skipRemoveThemePopUpMenu && showThemePopUpMenu && !event.target.closest('.themePopUpMenu')) {
        closeThemePopUpMenu();
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfilePopUpMenu, skipRemoveProfilePopUpMenu, showLanguagePopUpMenu, skipRemoveLanguagePopUpMenu, showThemePopUpMenu, skipRemoveThemePopUpMenu]);



  let chatProfileId; // Definiera chatProfileId här eller få det från någonstans

  if (activePage === 'chat' && activeInsidePage) {
      chatProfileId = reciverUserId;
  }

  const [renderTrigger, setRenderTrigger] = useState(false);

  useEffect(() => {
    // Döljer tangentbordet när komponenten renderas
    if (activePage === 'main-page') {
      // console.log('Hiding keyboard');
      if (typeof document !== 'undefined' && document.activeElement) {
        document.activeElement.blur();
      }
      setIsKeyboardVisible(false);
      setRenderTrigger(prev => !prev);
    }
  }, [isKeyboardVisible, activePage]);




  useEffect(() => {

      const fetchChatProfilePicture = async () => {
        const response = await fetch(`/api/getProfilePictureById?id=${chatProfileId}&userId=${userId}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setChatProfilePictureUrl(url);
        }
      };

      const fetchChatProfileName = async () => {
        fetch(`/api/getUserById?id=${chatProfileId}`)
          .then(response => response.json())
          .then(user => setChatProfileUserName(user.userName));
      };

      if (chatProfileId) {
        fetchChatProfilePicture();
        fetchChatProfileName();
        setShowLowerMenubarAnimation(false);
        setTimeout(() => {
          setChatProfileBool(true);
          setShowLowerMenubar(true);
        }, 200);
      }
      else {
        setShowLowerMenubarAnimation(true);
        setTimeout(() => setChatProfileBool(false), 500);
        setTimeout(() => setChatProfilePictureUrl(null), 500);
        setTimeout(() => setChatProfileUserName(null), 500);
        setTimeout(() => setShowLowerMenubar(false), 500);

      }
      
  }, [chatProfileId, userId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = chatProfilePictureUrl;
      img.onload = () => setChatProfileImageLoaded(true);
    }
  }, [chatProfilePictureUrl]);


  // const handleLanguageChange = (newLanguage) => {
  //   fetch('/api/changeLanguageOption', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userId, newLanguage }),
  //   })
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  //   mutate('/api/changeLanguageOption', newLanguage);

  // };



  if (!session) {
    return null;
  }

  const pagesWithoutNavbar = ['login', 'register', ''];

  if (pagesWithoutNavbar.includes(activePage)) {
    return null;
  }

  
  const handleLanguageChange = async (newLanguage) => {
    // Update the language in the backend
    const response = await fetch('/api/changeLanguageOption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newLanguage }),
    });
  
    if (response.ok) {
      // Update the local state
      setUserLanguage(newLanguage);
  
      // Update the SWR cache
      mutate('/api/userLanguage', newLanguage);
    }


    // console.log('vad är userLanguage:', newLanguage);

    if (newLanguage && newLanguage !== 'automatic') {
      if (newLanguage == 'swedish') {
        switchToSwedish()
      }
      else if (newLanguage == 'english') {
        switchToEnglish()
      }
    }


    const theBrowserLanguage = navigator.language || navigator.languages[0];
    setBrowserLanguage(theBrowserLanguage.startsWith('sv') ? 'sv' : 'en');

    if (newLanguage == 'automatic') {
      if (theBrowserLanguage.startsWith('sv')) {
        switchToSwedish()
      }
      else {
        switchToEnglish()
      }
    }

  };

  const handleThemeChange = async (newTheme) => {
    // Update the theme in the backend

    // console.log('newTheme!!!:', newTheme);
    const response = await fetch('/api/changeThemeOption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newTheme }),
    });
  
    if (response.ok) {
      // Update the local state
      setUserTheme(newTheme);
  
      // Update the SWR cache
      // mutate('/api/userTheme', newTheme);
    }


    // console.log('vad är userTheme:', newTheme);

    if (newTheme && newTheme !== 'automatic') {
      if (newTheme == 'light') {
        switchToLightMode()
      }
      else if (newTheme == 'dark') {
        switchToDarkMode()
      }
    }

    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheTheme(prefersDarkMode ? 'dark' : 'light');

    if (newTheme == 'automatic') {
      if (theTheme == 'light') {
        switchToLightMode()
      }
      else {
        switchToDarkMode()
      }
    }

  };



  const handleSignOut = () => {
    console.log('Starting sign out process');
    setExpandMobileLowerMenubar(false);
  
    signOut({ redirect: false }).then(() => {
      console.log('Sign out successful');
      // Lägg till en liten fördröjning för att säkerställa att signOut är klar
      setTimeout(() => {
        console.log('Navigating to login page');
        window.location.href = '/login'; // Alternativ navigeringsmetod
      }, 100); // 100 ms fördröjning
    }).catch(error => {
      console.error('Error during sign out:', error);
    });
  }

const menuStyle = {
  display: 'flex',
  justifyContent: 'center',

};


  // const menuStyle = { 
  //   display: 'flex', 
  //   display: 'inline-flex',
  //   alignItems: 'center',
  //   padding: '0.5rem',

  //   boxSizing: 'border-box',
  //   position: 'fixed',
  //   bottom: '1rem',

  //   left: '50%',
  //   transform: 'translateX(-50%)',
    




    // display: 'grid', 
    // gridTemplateColumns: 'auto auto auto', // three columns
    // alignItems: 'start',
    // justifyContent: 'center',
    // gap: '0.5rem', 



    // width: '100%',
    // height: 'calc(0.5rem + 80px)',

    // backgroundColor: 'black',

    // border: '1px solid grey', 
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    // borderRadius: '20px',
    // zIndex: 1000,



    // left: '20px',
    // right: '20px',

  // };

  const lowerMenubar = {

    // transform: 'translateX(-2.1px)',
    // width: '400px',
    // height: 'auto',
    display: 'flex',
    position: 'fixed',
    zIndex: 1000,
    left: '50%',
    bottom: '20px', // Justera detta värde för att placera det längre ner eller upp
    transform: 'translateX(-50%)',
    userSelect: 'none',
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    animation: !isPageLoaded
    ? 'animateInLowerMenubar 0s'
    : showLowerMenubarAnimation
    ? 'animateInLowerMenubar 0.5s'
    : 'animateOutLowerMenubar 0.5s forwards',
    width: '370px',
    height: '150px',
    //animation: chatProfileId ? 'animateInLowerMenubar 0.5s' : 'animateOutLowerMenubar 0.5s forwards',

  }

  const lowerMenubarBackground = {
    // width: '100%',
    // height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '1',
  }

  const lowerMenuIcons = {
    position: 'absolute',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '11px',
    zIndex: '2',

    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'relative',
    alignContent: 'center',
    justifyContent: 'center',
  }

  const theLowerMenuIcons = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
  }

  const theLowerMenuIconsMain = {
    ...theLowerMenuIcons,
    // marginLeft: '0px',
    // marginRight: '0px',
  }

  const theLowerMenuIconsLeft = {
    ...theLowerMenuIcons,
    marginRight: '0px',
  }

    const theLowerMenuIconsRight = {
    ...theLowerMenuIcons,
    marginLeft: '0px',
  }


  const mobileLowerMenubar = {

      display: 'flex', 
      flexDirection: 'column',
  
      borderTop: '1px solid #AAAAAA', 
      width: '100%',
      // height: expandMobileLowerMenubar ? '90%' : 'calc(0.5rem + 105px)',
      // height: window.innerHeight < 700 ? '100%' : (expandMobileLowerMenubar ? '90%' : 'calc(0.5rem + 105px)'),

      height: !expandMobileLowerMenubar ? 'calc(0.5rem + 105px)' : (window.innerHeight < 720 ? '99%' : (window.innerHeight < 850  ? '90%' : '83%')),
 


      boxSizing: 'border-box',
      position: 'fixed',
      bottom: '0',

      left: 0,
      backgroundColor: theme === 'light' ? 'white' : 'black',
      // backgroundColor: 'red',

      transition: 'all 0.3s ease-in-out',

      paddingBottom: '25px',
      
  
      // backgroundColor: theme === 'light' ? 'white' : 'black',
      zIndex: 1000
  }
  
  const mobileLowerMenuIcons = {
    position: 'absolute',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '11px',
    zIndex: '1001',

    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'relative',
    // alignContent: 'center',
    justifyContent: 'center',


    alignContent: 'end',


    margin: 'auto',


    // marginBottom: '0px',
    // bottom: '0px',
  }


  const theMobileLowerMenuIcons = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    // paddingBottom: '20px',
  }

  const theMobileLowerMenuIconsMain = {
    ...theMobileLowerMenuIcons,
    // marginLeft: '0px',
    // marginRight: '0px',
  }

  const theMobileLowerMenuIconsLeft = {
    ...theMobileLowerMenuIcons,
    // marginRight: '0px',
  }

    const theMobileLowerMenuIconsRight = {
    ...theMobileLowerMenuIcons,
    // marginLeft: '0px',
  }

  const mobileLowerExpandedMenubar = {
    justifyContent: 'center',
    width: '100%',
    alignContent: 'start',
  }

  const mobileLowerExpandedMenubarTextCombined = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.8rem',
    userSelect: 'none',
    // gap: '1rem',
    // padding: '0.2rem',

    fontFamily: "'SF Pro', sans-serif",
    marginBlockEnd: '0',
    marginBlockStart: '0',
    fontWeight: 'bold',
    
  }

  const mobileLowerExpandedMenubarText = {
    ...mobileLowerExpandedMenubarTextCombined,
    color: themeColor,
  }

  const mobileLowerExpandedMenubarTextLogOut = {
    ...mobileLowerExpandedMenubarTextCombined,
    color: 'red',
  }

  const mobileLowerExpandedMenubarTextContainer = {
    display: 'flex',
    justifyContent: 'center',
    // fontSize: '2.1rem',
    // userSelect: 'none',
    // gap: '1rem',
    // padding: '0.2rem',
    height: '53px',
    marginTop: '0.6rem',
    marginBottom: '0.6rem',
    gap: '0.8rem',
    // borderTop: '1px solid #AAAAAA', 
  }

  // const mobileLowerExpandedMenubarTheText = {
    // display: 'flex',
    // justifyContent: 'center',
    // fontSize: '2.1rem',
    // userSelect: 'none',
    // // gap: '1rem',
    // padding: '0.2rem',

    // fontFamily: "'SF Pro', sans-serif",
  //   marginBlockEnd: '0',
  //   marginBlockStart: '0',
  // }



  const menubarIcons = {
    border: '1px solid #D7D7D7', 
    backgroundColor: theme === 'light' ? 'white' : 'black',
    borderRadius: '20px',
  
  }

  // const standardMenubarIcons = {
  //   ...menubarIcons,
  //   width: '80px',
  //   height: '80px',
  //   // alignSelf: 'center',
  //   // padding: '0.5rem',
  //   zIndex: 1000,
  //   // position: 'absolute',
  // }

  // const standardMenubarMainStyle = {
  //   border: '1px solid grey', 
  //   backgroundColor: theme === 'light' ? 'white' : 'black',
  //   borderRadius: '20px',
  
  // }

  // const standardMenubarAround = {
  //   backgroundColor: theme === 'light' ? 'white' : 'black',
  //   zIndex: 1000,
  //   height: '100%',

  //   height: '80px',
  //   width: '80px',

  //   // transform: 'translateY(20px)',
  //   // height: '100%',

  //   // height: '60px',
  //   alignSelf: 'center',
  //   // padding: '0.5rem',
  //   margin: '0.5rem',
    

  // }





  // const standardMenubarLeftAround = {
  // ...standardMenubarAround,
  // transform: 'translateX(3px)',
  // marginRight: '0',


  // }

  // const standardMenubarRightAround = {
  // ...standardMenubarAround,
  // transform: 'translateX(-3px)',
  // marginLeft: '0',

  // }

  // const standardMenubarLeftIcons = {
  // ...standardMenubarIcons,
  // // paddingLeft: '0.5rem',
  // // borderRadiusLeft: '20px',
  // borderTopRightRadius: '0px',
  // borderBottomRightRadius: '0px',
  // borderRight: '0px',
  // transform: 'translateX(-2.1px)',
  
  // }

  // const standardMenubarRightIcons = {
  // ...standardMenubarIcons,
  // // borderRadiusRight: '20px',
  // borderTopLeftRadius: '0px',
  // borderBottomLeftRadius: '0px',
  // borderLeft: '0px',
  // transform: 'translateX(2.1px)',
  // paddingRight: '0.5rem',
  // // paddingTop: '0.5rem',
  // // paddingBottom: '0.5rem',


  // // transform: 'translate(-1.2px)',
  
  // }

  // const mainMenubarIcons = {
  //   ...menubarIcons,
  //   width: '100px',
  //   height: '100px',
  //   alignSelf: 'stretch',
  //   paddingLeft: '0.5rem',
  //   paddingRight: '0.5rem',
  //   marginTop: '0.5rem',
  //   marginBottom: '0.5rem',
  //   paddingTop: '0.5rem',
  //   paddingBottom: '0.5rem',

  //   borderRadius: '13px',
  //   zIndex: 999,
  // }

  const navStyle = { 
    display: 'flex', 
    // justifyContent: 'space-between', 

    borderBottom: '1px solid #AAAAAA', 
    width: '100%',
    height: 'calc(0.5rem + 80px)',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: theme === 'light' ? 'white' : 'black',

    // backgroundColor: theme === 'light' ? 'white' : 'black',
    zIndex: 998
  };

  const linkStyle = { cursor: 'pointer' };


  


  const logoStyle = {
    position: 'absolute',
    left: '50%',
    paddingTop: '0.5rem',
    transform: 'translateX(-50%)',
    transition: 'all 0.7s ease-in-out'
  };
  
  const homeButtonStyle = activePage === 'chat' 
    ? { ...logoStyle, left: phoneLayout ? '-100%' : 'calc(4% + 45px + 1.5rem)', transform: 'translateX(0)' } 
    : logoStyle;

  const navbarButtonStyle = {
    // backgroundColor: theme === 'light' ? 'white' : 'black',

    // Ändra till cirklar i menyn
    // borderRadius: '15px',
    // padding: '6px',
    // border: `2px solid ${theme === 'light' ? 'black' : 'white'}`,
    borderRadius: '50%',
    padding: '7px',

    transition: 'all 0.3s ease',

    // borderTop: showProfilePopUpMenu ? '2px solid #AAAAAA' : 'none',

  }



  




  const chatProfileStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    gap: '1rem',
    transform: 'translate(-50%, -50%)',

    animation: chatProfileId ? 'animateInChatProfile 0.5s' : 'animateOutChatProfile 0.5s forwards',
    // animationDelay: '0.05s',
  };

  // const chatProfileStyle = activePage === 'chat'
  //   ? { ...chatProfileStandardStyle, left: 'calc(4% + 45px + 1.5rem)', transform: 'translateX(0)' } 
  //   : chatProfileStandardStyle;

  const chatProfileIconStyle = {
    width: '70px',
    height: '70px',
    borderRadius: '5px',
  }

  const chatProfileTextStyle = {
    fontSize: '1.7rem',
    userSelect: 'none',
    fontFamily: "'SF Pro', sans-serif",
  }

  // animateInChatProfile






  const navbarButtonStyleBackButton = {
    ...navbarButtonStyle,
    backgroundColor: hoverGoBack ? (theme === 'light' ? 'lightgrey' : 'darkgrey') : (theme === 'light' ? 'white' : 'black'),
  }


  const navbarButtonStyleNotification = {
    ...navbarButtonStyle,

    marginRight: '9px',

    backgroundColor: hoverNotification ? (theme === 'light' ? 'lightgrey' : 'darkgrey') : (theme === 'light' ? 'white' : 'black'),
    // boxShadow: showNotificationPopUpMenu ? 'inset 0 0 0 1px #AAAAAA' : 'none',
  }

  const navbarButtonStyleLanguage = {
    ...navbarButtonStyle,

    marginRight: '9px',

    backgroundColor: hoverLanguage ? (theme === 'light' ? 'lightgrey' : 'darkgrey') : (theme === 'light' ? 'white' : 'black'),
    boxShadow: showLanguagePopUpMenu ? 'inset 0 0 0 1px #AAAAAA' : 'none',
  }

  const navbarButtonStyleTheme = {
    ...navbarButtonStyle,
    backgroundColor: hoverTheme ? (theme === 'light' ? 'lightgrey' : 'darkgrey') : (theme === 'light' ? 'white' : 'black'),

    // outline: showThemePopUpMenu ? '1px solid #AAAAAA' : 'none',
    boxShadow: showThemePopUpMenu ? 'inset 0 0 0 1px #AAAAAA' : 'none',
    // transition: 'outline 0s',
  }

  const themeButton = {
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  }

  const languageButton = {

  }

  const leftSideStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '1.5rem',
    flex: 1, // This will make the div take up all remaining space
    gap: '1rem',
  };

  const rightSideStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '2.2rem',
    flex: 1, // This will make the div take up all remaining space
    // gap: '1rem',
  };
    
  const profilePictureStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    justifyContent: 'center',
    fill: 'white',

    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

    // boxShadow: showProfilePopUpMenu ? 'inset 0 0 0 1px #AAAAAA' : 'none',
    outline: showProfilePopUpMenu ? '1px solid #AAAAAA' : 'none',
    // transition: 'outline 0.3s',
    transition: 'all 0.1s ease',

    // border: `2px solid ${theme === 'light' ? 'black' : 'white'}`,
    // border:'1px solid #AAAAAA',
    // border: '2px solid grey',
    // Add more styles as needed
  };

  const wrapperThemeMenuStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh', // Justera höjden efter behov
  };


  const themeMenuStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    // gap: '1.5rem',
    // padding: '0.8rem',
    border: '1px solid #AAAAAA',
    borderRadius: '15px',
    // marginLeft: '4rem',
    // marginRight: '4rem',
    marginTop: '0.8rem',  

  }

  const themeMenuTextStyle = {
    fontFamily: "'SF Pro', sans-serif",
    fontSize: '2.2rem',
    color: themeColor,
    fontWeight: 'bolder',
    marginBlockStart: '0rem',
    marginBlockEnd: '0rem',
    padding: '0.4rem',
    margin: '0.55rem',
    userSelect: 'none',
    WebkitUserSelect: 'none', // För Safari
    MozUserSelect: 'none',

  }

  const themeMenuTextStyleWrapper = {
    // backgroundColor: 'red',
    backgroundColor: userTheme === 'automatic' ? 'grey' : 'transparent',
    // height: '100%',
    // top: 0,
    // bottom: 0,
    borderTopRightRadius: '13px',
    borderBottomRightRadius: '13px',
    transition: 'all 0.2s ease-in-out',
    userSelect: 'none',
    WebkitUserSelect: 'none', // För Safari
    MozUserSelect: 'none', // För Firefox

  }

  const themeMenuSunStyle = {

    margin: '0.4rem',
    // padding: '0.4rem',
    // backgroundColor: theme === 'light' ? 'white' : 'black',

  }

  const themeMenuMoonStyle = {
    margin: '0.4rem',
    // padding: '0.4rem',
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    

  }

  const themeMenuBackgroundSunStyle = {
    borderTopLeftRadius: '13px',
    borderBottomLeftRadius: '13px',
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    // backgroundColor: 'red',

    backgroundColor: userTheme === 'light' ? 'grey' : 'transparent',
    transition: 'all 0.2s ease-in-out',

  }

  const themeMenuBackgroundMoonStyle = {
    // backgroundColor: theme === 'light' ? 'white' : 'black',

    
    backgroundColor: userTheme === 'dark' ? 'grey' : 'transparent',
    transition: 'all 0.2s ease-in-out',
  }





  

  const wrapperLanguageMenuStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh', // Justera höjden efter behov
  };


  const languageMenuStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    // gap: '1.5rem',
    // padding: '0.8rem',
    border: '1px solid #AAAAAA',
    borderRadius: '15px',
    // marginLeft: '4rem',
    // marginRight: '4rem',
    marginTop: '0.8rem',  

  }

  const languageMenuTextStyle = {
    fontFamily: "'SF Pro', sans-serif",
    fontSize: '2.2rem',
    color: themeColor,
    fontWeight: 'bolder',
    marginBlockStart: '0rem',
    marginBlockEnd: '0rem',
    padding: '0.4rem',
    margin: '0.55rem',
    userSelect: 'none',
    WebkitUserSelect: 'none', // För Safari
    MozUserSelect: 'none',

  }

  const languageMenuTextStyleWrapper = {
    // backgroundColor: 'red',
    backgroundColor: userLanguage === 'automatic' ? 'grey' : 'transparent',
    // height: '100%',
    // top: 0,
    // bottom: 0,
    borderTopRightRadius: '13px',
    borderBottomRightRadius: '13px',
    transition: 'all 0.2s ease-in-out',
    userSelect: 'none',
    WebkitUserSelect: 'none', // För Safari
    MozUserSelect: 'none', // För Firefox

  }

  const languageMenuSwedenStyle = {

    margin: '0.4rem',
    // padding: '0.4rem',
    // backgroundColor: theme === 'light' ? 'white' : 'black',

  }

  const languageMenuEnglandStyle = {
    margin: '0.4rem',
    // padding: '0.4rem',
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    

  }

  const languageMenuBackgroundSwedenStyle = {
    borderTopLeftRadius: '13px',
    borderBottomLeftRadius: '13px',
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    // backgroundColor: 'red',

    backgroundColor: userLanguage === 'swedish' ? 'grey' : 'transparent',
    transition: 'all 0.2s ease-in-out',

  }

  const languageMenuBackgroundEnglandStyle = {
    // backgroundColor: theme === 'light' ? 'white' : 'black',

    
    backgroundColor: userLanguage === 'english' ? 'grey' : 'transparent',
    transition: 'all 0.2s ease-in-out',
  }


  const logOutIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
  }

  
  const menubarIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
  }


  


  const navigate = (url) => {
    router.push(url);
  };


  //sätt färg
  // themeColor = themeColor === 'none' ? (theme === 'light' ? 'black' : 'white') : themeColor;
  // themeColor = '#3de434';

  const popUpMenu = {
    
    backgroundColor: theme === 'light' ? 'white' : 'black',
    // border: `2px solid ${theme === 'light' ? 'black' : 'white'}`,
    border: '1px solid #AAAAAA',
    position: 'fixed',

    top: 'calc(0.5rem + 90px)',
    paddingRight: '0.8rem',
    paddingLeft: '0.8rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderRadius: '15px',

    fontSize: '1.3rem',

    zIndex: 1000,

    // marginBlockStart: '0rem',

    // opacity: showProfilePopUpMenu ? 1 : 0,
    // transform: showProfilePopUpMenu ? 'translateY(0)' : 'translateY(-7px)',
    // transition: 'all 0.3s ease-in-out',
    
  };

  const profilePopUpMenu = {
    ...popUpMenu,
    right: '1.5rem',
    animation: showProfilePopUpMenu ? 'slideIn 0.4s forwards' : 'slideOut 0.4s forwards',
  };

  const languagePopUpMenu = {
    ...popUpMenu,
    width: '210px',
    right: '3rem',
    animation: showLanguagePopUpMenu ? 'slideIn 0.4s forwards' : 'slideOut 0.4s forwards',
  };

  const themePopUpMenu = {
    ...popUpMenu,
    width: '220px',
    right: '6rem',
    animation: showThemePopUpMenu ? 'slideIn 0.4s forwards' : 'slideOut 0.4s forwards',
  };

  const inPopUpMenu = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',

    
  };

  const inPopUpMenuText = {
    marginTop: '0.7rem',
    marginBottom: '0.7rem',
    userSelect: 'none',
    fontFamily: "'SF Pro', sans-serif",
  };
  
  const inPopUpMenuTextLogOut = {
    ...inPopUpMenuText,
    color: 'red',
  };

  const inPopUpMenuAutomatic = {
    ...inPopUpMenu,
    justifyContent: 'center',
  };

  const toggleExpandMobileLowerMenubar = () => {
    setExpandMobileLowerMenubar(prevState => !prevState);
  };

  return (
    <> 
    {/* {userId} */}


    {/* <div style={{ paddingBottom: 'calc(0.5rem + 120px)' }}> */}

      <div style={{ height: 'calc(0.5rem + 80px)' }} /> {/* This div acts as a margin */}
      {/* <div style={{ height: 'calc(0.5rem + 80px)', position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'transparent' }} /> */}

      <nav style={navStyle} className="navStyle">
        <div style={homeButtonStyle} onClick={() => navigate('/main-page')}>
          <div className="loop-logo-button" style={{'--themeColor': themeColor }}> </div>
        </div>

        {/* <div style={linkStyle} onClick={() => navigate('/chat')}>Chat</div> */}

        <div style={leftSideStyle}>


          <div className="hide-on-small-screen"
            style={navbarButtonStyleBackButton}
            onMouseEnter={() => setHoverGoBack(true)}
            onMouseLeave={() => setHoverGoBack(false)}
            onClick={goBack}
          >  

            <div
              className="back-icon"
              style={{'--themeColor': themeColor
              }}>
            </div>

          </div>

          {/* <div className="hide-on-small-screen" style={navbarButtonStyleBackButton} onMouseEnter={() => setHoverGoBack(true)} onMouseLeave={() => setHoverGoBack(false)} onClick={goBack}>
            <GoBackButton color={themeColor} width="45px" height="45px" theme={theme} />
          </div> */}

          
        </div>

        <div style={rightSideStyle}> {/* Add this div */}

        {/* <div style={navbarButtonStyle} onClick={() => navigate('/')}>
          <Image 
            // src={language === 'english' ? "/english_button.svg" : "/other_language_button.svg"} 
            src="/moon_button.svg"
            alt="Theme button" 
            width={45} 
            height={45} 
          />
        </div> */}

        {/* <div className="hide-on-small-screen" style={navbarButtonStyleTheme} onMouseEnter={() => setHoverTheme(true)} onMouseLeave={() => setHoverTheme(false)} onClick={toggleThemePopUpMenu}>
          <ThemeButton style={themeButton} color={themeColor} width="45px" height="45px" theme={theme} />
        </div> */}


        <div className="hide-on-small-screen"
          style={navbarButtonStyleNotification}
          onMouseEnter={() => setHoverNotification(true)}
          onMouseLeave={() => setHoverNotification(false)}
          // onClick={toggleLanguagePopUpMenu}
        >  

          <div
            className="notification-icon"
            style={{'--themeColor': themeColor
            }}>
          </div>
        </div>


        <div className="hide-on-small-screen"
          style={navbarButtonStyleTheme}
          onMouseEnter={() => setHoverTheme(true)}
          onMouseLeave={() => setHoverTheme(false)}
          onClick={toggleThemePopUpMenu}
        >
          {theme == 'light' &&
            <div
              className="sun-icon"
              style={{'--themeColor': themeColor
              }}>
            </div>
          }
          {theme == 'dark' &&
            <div
              className="moon-icon"
              style={{'--themeColor': themeColor
              }}>
            </div>
          }

        </div>


        <div className="hide-on-small-screen"
          style={navbarButtonStyleLanguage}
          onMouseEnter={() => setHoverLanguage(true)}
          onMouseLeave={() => setHoverLanguage(false)}
          onClick={toggleLanguagePopUpMenu}
        >  

          <div
            className="language-icon"
            style={{'--themeColor': themeColor
            }}>
          </div>

        </div>

        {/* <div className="hide-on-small-screen" style={navbarButtonStyleLanguage} onMouseEnter={() => setHoverLanguage(true)} onMouseLeave={() => setHoverLanguage(false)} onClick={toggleLanguagePopUpMenu}>
          <LanguageButton style={languageButton} color={themeColor} width="45px" height="45px" />
        </div> */}


        {/* <div style={navbarButtonStyle} onClick={() => navigate('/')}>
          <Image
            src="/language_button.svg"
            alt="Language button"
            width={45}
            height={45}
          />
        </div> */}

        {profilePictureUrl &&
            <div className="hide-on-small-screen">
              <div className="profile-picture" style={{ display: 'inline-block', position: 'relative'}}>
              <img src={profilePictureUrl}
              alt="Profile"
              style={profilePictureStyle}
              onClick={toggleProfilePopUpMenu}
            />
          </div>
        </div>
        }

        {/* Add your symbols here */}
        </div>

        {chatProfileBool && chatProfileImageLoaded && (
          <div style={chatProfileStyle} className="chatProfileStyle" onClick={() => navigate(`/profile/${chatProfileId}`)}>
            <img src={chatProfilePictureUrl} alt="Profile" style={chatProfileIconStyle}/>
            <p style={chatProfileTextStyle}>{chatProfileUserName}</p>
          </div>
        )}

      </nav>



    <nav style={menuStyle}>

      {/* <div>
        <img src="/navbar_background/lower_navbar_background_smal.svg" alt="Bakgrund" style={{ width: '100px', height: '50px' }} > </img>
        <img src="/menubar_icons/menubar_settings_icon.png" alt="Bakgrund" style={{ width: '100px', height: '50px' }} > </img>
      </div> */}
      {!showLowerMenubar && !phoneLayout && (
        <div style={lowerMenubar}>
          <div style={lowerMenubarBackground}>
            <LowerMenubarBackground background_color={theme === 'light' ? 'white' : 'black'} stroke_color="#AAAAAA" draggable="false" width="auto" height="auto" />
          {/* <img src="/navbar_background/lower_navbar_background_smal.svg" alt="Bakgrund" style={lowerMenubar} draggable="false" /> */}
          </div>

          <div style={lowerMenuIcons}>
            {/* <img src="/menubar_icons/menubar_book_icon.png" width="82px" height='82px' alt="Profile" style={theLowerMenuIconsLeft}/> */}
            <div style={theLowerMenuIconsLeft} onClick={() => navigate('/friends')}>
              <div className="friends-icon" style={{'--themeColor': themeColor }}> </div>
            </div>

            <div style={theLowerMenuIconsMain} onClick={() => navigate('/main-page')}>
              <div className="main-loop-icon" style={{'--themeColor': themeColor }}> </div>
            </div>

            {/* <img src="/menubar_icons/menubar_loop_icon.png" width="110px" height='110px' alt="Profile" style={theLowerMenuIconsMain}/> */}
            {/* <img src="/menubar_icons/menubar_settings_icon.png" width="82px" height='82px' alt="Profile" style={theLowerMenuIconsRight}/> */}
            <div style={theLowerMenuIconsRight} onClick={() => navigate('/add-friends')}>
              <div className="plus-icon" style={{'--themeColor': themeColor }}> </div>
            </div>

          </div>

        </div>

      )}


      {/* <div style={standardMenubarLeftAround}>
        <img src="/menubar_icons/menubar_settings_icon.png" alt="Profile" style={standardMenubarLeftIcons}/>
      </div>
      
      <div>
        <img src="/menubar_icons/menubar_loop_icon.png" alt="Profile" style={mainMenubarIcons}/>
      </div>

      <div style={standardMenubarRightAround}>
        <img src="/menubar_icons/menubar_book_icon.png" alt="Profile" style={standardMenubarRightIcons}/>
      </div> */}


      {/* {phoneLayout && !isKeyboardVisible && ( */}
      {phoneLayout && !isKeyboardVisible && (
        <div style={mobileLowerMenubar}>

          {expandMobileLowerMenubar && (
            <div style={mobileLowerExpandedMenubar}>

              <div style={wrapperThemeMenuStyle}>

                <div style={themeMenuStyle}>
                  <div style={themeMenuBackgroundSunStyle}>
                  <div
                    onClick={() => { handleThemeChange('light'); }}
                    className="sun-icon-menu no-select"
                    style={{'--themeColor': themeColor, ...themeMenuSunStyle
                    }}
                    // style={themeMenuSunStyle}
                    >
                  </div>
                  </div>

                  <div style={themeMenuBackgroundMoonStyle}>
                  <div
                    onClick={() => { handleThemeChange('dark'); }}
                    className="moon-icon-menu no-select"
                    style={{'--themeColor': themeColor, ...themeMenuMoonStyle
                    }}
                    // style={themeMenuMoonStyle}
                    >

                  </div>
                  </div>
                  <div class="no-select" style={themeMenuTextStyleWrapper} onClick={() => { handleThemeChange('automatic'); }}>
                    <p style={themeMenuTextStyle}>Auto</p>
                  </div>
                </div>
              </div>


              <div style={wrapperLanguageMenuStyle}>
                <div style={languageMenuStyle}>
                  <div style={languageMenuBackgroundSwedenStyle}>
                    <div
                      onClick={() => { handleLanguageChange('swedish'); }}
                      className="sweden-icon-menu no-select"
                      style={{'--themeColor': themeColor, ...languageMenuSwedenStyle
                      }}
                      >
                    </div>
                  </div>

                  <div style={languageMenuBackgroundEnglandStyle}>
                    <div
                      onClick={() => { handleLanguageChange('english'); }}
                      className="england-icon-menu no-select"
                      style={{'--themeColor': themeColor, ...languageMenuEnglandStyle
                      }}
                      // style={themeMenuMoonStyle}
                      >

                    </div>
                  </div>
                  <div class="no-select" style={languageMenuTextStyleWrapper} onClick={() => { handleLanguageChange('automatic'); }}>
                    <p style={languageMenuTextStyle}>Auto</p>
                  </div>
                </div>
              </div>



              <div style={mobileLowerExpandedMenubarTextContainer} onClick={() => { handleSignOut(); closeProfilePopUpMenu(); }} className="no-select">
                <div
                    className="log-out-icon-phone"
                    style={{'--themeColor': themeColor, ...logOutIconStyle
                    }}
                    >
                </div>

                <p style={mobileLowerExpandedMenubarTextLogOut}>
                  <FormattedMessage id="signOut" />
                </p>
              </div>



              <div style={mobileLowerExpandedMenubarTextContainer} onClick={() => navigate(`/profile/${userId}`, setExpandMobileLowerMenubar(false))}

              className="no-select">
                <div
                    className="profile-icon-phone"
                    style={{'--themeColor': themeColor, ...menubarIconStyle
                    }}
                    >
                </div>

                <p style={mobileLowerExpandedMenubarText}>
                  <FormattedMessage id="myProfile" />
                </p>
              </div>


              <div style={mobileLowerExpandedMenubarTextContainer} onClick={() => navigate(`/notifications`, setExpandMobileLowerMenubar(false))}

              className="no-select">
                <div
                    className="notification-icon-phone"
                    style={{'--themeColor': themeColor, ...menubarIconStyle
                    }}
                    >
                </div>

                <p style={mobileLowerExpandedMenubarText}>
                  <FormattedMessage id="notifications" />
                </p>
              </div>


              <div style={mobileLowerExpandedMenubarTextContainer}      onClick={() => navigate(`/settings`, setExpandMobileLowerMenubar(false))}

                className="no-select">
                  <div
                      className="settings-icon-phone"
                      style={{'--themeColor': themeColor, ...menubarIconStyle
                      }}
                      >
                  </div>

                  <p style={mobileLowerExpandedMenubarText}>
                    <FormattedMessage id="settings" />
                  </p>
              </div>


              <div style={mobileLowerExpandedMenubarTextContainer}      onClick={() => navigate(`/add-friends`, setExpandMobileLowerMenubar(false))}

              className="no-select">
                <div
                    className="plus-icon-phone"
                    style={{'--themeColor': themeColor, ...menubarIconStyle
                    }}
                    >
                </div>

                <p style={mobileLowerExpandedMenubarText}>
                  <FormattedMessage id="addFriends" />
                </p>
              </div>

              <div style={mobileLowerExpandedMenubarTextContainer}      onClick={() => navigate(`/friends`, setExpandMobileLowerMenubar(false))}

              className="no-select">
                <div
                    className="friends-icon-phone"
                    style={{'--themeColor': themeColor,
                    }}
                    >
                </div>

                <p style={mobileLowerExpandedMenubarText}>
                  <FormattedMessage id="friends" />
                </p>
              </div>



              {/* <p onClick={() => navigate(`/profile/${userId}`, setExpandMobileLowerMenubar(false))} style={mobileLowerExpandedMenubarText}>Min profil</p> */}

              {/* <p onClick={() => navigate(`/settings`, setExpandMobileLowerMenubar(false))} style={mobileLowerExpandedMenubarText}>Inställningar</p> */}

              {/* <p onClick={() => navigate(`/add-friends`, setExpandMobileLowerMenubar(false))} style={mobileLowerExpandedMenubarText}>Lägg till vänner</p>

              <p onClick={() => navigate(`/friends`, setExpandMobileLowerMenubar(false))} style={mobileLowerExpandedMenubarText}>Vänner</p>  */}
            </div>
          )}

          <div style={mobileLowerMenuIcons}>
            {/* <img onClick={goBack} src="/menubar_icons/menubar_back_button.png" width="85px" height='85px' alt="Profile" style={theMobileLowerMenuIconsLeft}/> */}
            {/* <img onClick={() => navigate('/main-page')} src="/menubar_icons/menubar_loop_icon.png" width="100px" height='100px' alt="Profile" style={theMobileLowerMenuIconsMain}/> */}
            {/* <img onClick={toggleExpandMobileLowerMenubar} src="/menubar_icons/menubar_hamburger_menu.png" width="85px" height='85px' alt="Profile" style={theMobileLowerMenuIconsLeft}/> */}
            <div style={theMobileLowerMenuIconsLeft} onClick={goBack}>
              <div className="back-button-icon-phone no-select" style={{'--themeColor': themeColor }}> </div>
            </div>

            <div style={theMobileLowerMenuIconsMain} onClick={() => navigate('/main-page')}>
              <div className="main-loop-icon-phone no-select" style={{'--themeColor': themeColor }}> </div>
            </div>

            <div style={theMobileLowerMenuIconsLeft} onClick={toggleExpandMobileLowerMenubar}>
              <div className="hamburger-icon-phone no-select" style={{'--themeColor': themeColor }}> </div>
            </div>

          </div>

          {/* Lägg till en fixerad footer */}


          {/* <div className="loop-logo" style={{'--themeColor': themeColor }}> </div>
          <button onClick={toggleExpandMobileLowerMenubar}>
            {expandMobileLowerMenubar ? 'Collapse Menu' : 'Expand Menu'}
          </button> */}
        </div>
      )}
      
    </nav>

    



      {!removeProfilePopUpMenu && !phoneLayout && (
        <div className="profilePopUpMenu" style={profilePopUpMenu}>
            <div className="popup-menu-button" style={inPopUpMenu} onClick={() => navigate(`/profile/${userId}`, closeProfilePopUpMenu())}>
              <ProfileIcon color={themeColor} width="30px" height="30px" />
              <p style={inPopUpMenuText}><FormattedMessage id="myProfile" /></p>
            </div>
            <div className="popup-menu-button" style={inPopUpMenu} onClick={() => navigate(`/settings`, closeProfilePopUpMenu())}>
              <SettingsIcon color={themeColor} width="30px" height="30px" />
              <p style={inPopUpMenuText}><FormattedMessage id="settings" /></p>
            </div>
            <div className="popup-menu-button" style={inPopUpMenu} onClick={() => { handleSignOut(); closeProfilePopUpMenu(); }}>
              <LogoutIcon color={"red"} width="30px" height="30px" />
              <p style={inPopUpMenuTextLogOut}><FormattedMessage id="signOut" /></p>
            </div>
          {/* Your popup menu goes here */}
        </div>
      )}
      {!removeLanguagePopUpMenu && !phoneLayout && (
        <div className="languagePopUpMenu" style={languagePopUpMenu}>
            <div className="popup-menu-button" style={inPopUpMenu} onClick={() => { handleLanguageChange('swedish');  }}>
              <Image
                src="/png_icons/sweden_flag.png"
                alt="Swedish button"
                width={60}
                height={60}
              />
              {/* <ProfileIcon color={themeColor} width="30px" height="30px" /> */}
              <p style={inPopUpMenuText}><FormattedMessage id="swedish" /></p>
              {userLanguage == 'swedish' && (
              <div className="check-mark" style={{'--themeColor': themeColor }}> </div>
              )}
            </div>
            <div className="popup-menu-button" style={inPopUpMenu} onClick={() => { handleLanguageChange('english'); }}>
              <Image
                src="/png_icons/uk_flag.png"
                alt="Enligsh button"
                width={60}
                height={60}
              />
              <p style={inPopUpMenuText}><FormattedMessage id="english" /></p>
              {userLanguage == 'english' && (
              <div className="check-mark" style={{'--themeColor': themeColor }}> </div>
              )}
            </div>
            <div className="popup-menu-button" style={inPopUpMenuAutomatic} onClick={() => { handleLanguageChange('automatic'); }}>
              <p style={inPopUpMenuText}><FormattedMessage id="automatic" /></p>
              {userLanguage == 'automatic' && (
              <div className="check-mark" style={{'--themeColor': themeColor }}> </div>
              )}
            </div>
          {/* Your popup menu goes here */}
        </div>
      )}

      {!removeThemePopUpMenu && !phoneLayout && (
        <div className="themePopUpMenu" style={themePopUpMenu}>
            <div className="popup-menu-button" style={inPopUpMenu} onClick={() => { handleThemeChange('light');  }}>
              {/* <Image
                src="/png_icons/sweden_flag.png"
                alt="Swedish button"
                width={60}
                height={60}
              />*/}
              <ThemeButton color={themeColor} width="45px" height="45px" theme={'light'} />

              {/* <ProfileIcon color={themeColor} width="30px" height="30px" /> */}
              <p style={inPopUpMenuText}><FormattedMessage id="lightMode" /></p>
              {userTheme == 'light' && (
              <div className="check-mark" style={{'--themeColor': themeColor }}> </div>
              )}
            </div>
            <div className="popup-menu-button" style={inPopUpMenu} onClick={() => { handleThemeChange('dark'); }}>
              {/* <Image
                src="/png_icons/uk_flag.png"
                alt="Enligsh button"
                width={60}
                height={60}
              /> */}
              
              <ThemeButton color={themeColor} width="45px" height="45px" theme={'dark'} />
          
              <p style={inPopUpMenuText}><FormattedMessage id="darkMode" /></p>
              {userTheme == 'dark' && (
              <div className="check-mark" style={{'--themeColor': themeColor }}> </div>
              )}
            </div>
            <div className="popup-menu-button" style={inPopUpMenuAutomatic} onClick={() => { handleThemeChange('automatic'); }}>
              <p style={inPopUpMenuText}><FormattedMessage id="automatic" /></p>
              {userTheme == 'automatic' && (
              <div className="check-mark" style={{'--themeColor': themeColor }}> </div>
              )}
            </div>
          {/* Your popup menu goes here */}
        </div>
      )}




      </>
      
    );

};



export default Navbar;