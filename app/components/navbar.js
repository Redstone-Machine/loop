// components/navbar.js
import { LanguageContext } from '../../contexts/LanguageContext';
import { ThemeContext } from '../../contexts/ThemeContext';


import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { delay, throttle } from 'lodash';
import { Head } from 'next/head';

import { signOut } from 'next-auth/react';

import { getUserIdFromSession } from '../../utils/utils';

import ThemeButton from '../../public/svg_icons/navbar_icons/theme_button';
import LanguageButton from '../../public/svg_icons/navbar_icons/language_button';
import GoBackButton from '../../public/svg_icons/navbar_icons/go_back_button';

import ProfileIcon from '../../public/svg_icons/navbar_icons/profile_icon';
import SettingsIcon from '../../public/svg_icons/navbar_icons/settings_icon';
import LogoutIcon from '../../public/svg_icons/navbar_icons/logout_icon';


import LoopLogo from '../../public/svg_icons/loop_logo';

import { useRef } from 'react';
import { ifError } from 'assert';


import { IntlProvider } from 'react-intl';
import useSWR, { mutate } from 'swr';


import { FormattedMessage } from 'react-intl';

const Navbar = ({ activePage, activeInsidePage, theme, themeColor, language }) => {



  console.log('activePage:', activePage);
  console.log('activeInsidePage:', activeInsidePage);
  console.log('language:', language);

  const { data: session, status } = useSession();
  const userId = getUserIdFromSession(session, status);

  const router = useRouter();

  const { switchToEnglish, switchToSwedish } = useContext(LanguageContext);
  const { switchToDarkMode, switchToLightMode } = useContext(ThemeContext);

  const { reciverUserId } = router.query;


  const [browserLanguage, setBrowserLanguage] = useState('en');

  const [userTheme, setUserTheme] = useState(null);
  const [theTheme, setTheTheme] = useState(null);
  const [themeMode, setThemeMode] = useState(null);

  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [chatProfilePictureUrl, setChatProfilePictureUrl] = useState(null);
  const [chatProfileUserName, setChatProfileUserName] = useState(null);
  const [chatProfileBool, setChatProfileBool] = useState(false);
  const [userLanguage, setUserLanguage] = useState(null);
  
  const [hoverLanguage, setHoverLanguage] = useState(false);
  const [hoverTheme, setHoverTheme] = useState(false);
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



  console.log('userLanguage:', userLanguage);

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

  useEffect(() => {

      const fetchChatProfilePicture = async () => {
        const response = await fetch(`/api/getProfilePictureById?id=${chatProfileId}`);
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
        setTimeout(() => {
          setChatProfileBool(true);
        }, 200);
      }
      else {

        setTimeout(() => setChatProfileBool(false), 500);
        setTimeout(() => setChatProfilePictureUrl(null), 500);
        setTimeout(() => setChatProfileUserName(null), 500);

      }
      
  }, [chatProfileId]);

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


    console.log('vad är userLanguage:', newLanguage);

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

    console.log('newTheme!!!:', newTheme);
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


    console.log('vad är userTheme:', newTheme);

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
    signOut();
  }

  if (!session) {
    return null;
  }

  const navStyle = { 
    display: 'flex', 
    // justifyContent: 'space-between', 

    borderBottom: '1px solid grey', 
    width: '100%',
    height: 'calc(0.5rem + 80px)',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    // backgroundColor: 'black',
    backgroundColor: theme === 'light' ? 'white' : 'black',
    zIndex: 1000
  };

  const linkStyle = { cursor: 'pointer' };

  const isMobile = window.innerWidth <= 600;

  const logoStyle = {
    position: 'absolute',
    left: '50%',
    paddingTop: '0.5rem',
    transform: 'translateX(-50%)',
    transition: 'all 0.7s ease-in-out'
  };
  
  const homeButtonStyle = activePage === 'chat' 
    ? { ...logoStyle, left: isMobile ? '-100%' : 'calc(4% + 45px + 1.5rem)', transform: 'translateX(0)' } 
    : logoStyle;

  const navbarButtonStyle = {
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    borderRadius: '15px',
    padding: '6px',
    border: `2px solid ${theme === 'light' ? 'black' : 'white'}`,
    // borderRadius: '50%',
    // padding: '9px',
    transition: 'all 0.3s ease'
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

  const navbarButtonStyleLanguage = {
    ...navbarButtonStyle,
    backgroundColor: hoverLanguage ? (theme === 'light' ? 'lightgrey' : 'darkgrey') : (theme === 'light' ? 'white' : 'black'),
    
  }

  const navbarButtonStyleTheme = {
    ...navbarButtonStyle,
    backgroundColor: hoverTheme ? (theme === 'light' ? 'lightgrey' : 'darkgrey') : (theme === 'light' ? 'white' : 'black'),
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
    paddingRight: '1.5rem',
    flex: 1, // This will make the div take up all remaining space
    gap: '1rem',
  };
    
  const profilePictureStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    justifyContent: 'center',
    fill: 'white',
    border: `2px solid ${theme === 'light' ? 'black' : 'white'}`,
    // border: '2px solid grey',
    // Add more styles as needed
  };



  const navigate = (url) => {
    router.push(url);
  };



  themeColor = themeColor === 'none' ? (theme === 'light' ? 'black' : 'white') : themeColor;

  const popUpMenu = {
    
    backgroundColor: theme === 'light' ? 'white' : 'black',
    border: `2px solid ${theme === 'light' ? 'black' : 'white'}`,
    position: 'fixed',

    top: 'calc(0.5rem + 90px)',
    paddingRight: '0.8rem',
    paddingLeft: '0.8rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderRadius: '15px',

    fontSize: '1.3rem',
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


  return (
    <>

    <div style={{ height: 'calc(0.5rem + 80px)' }} /> {/* This div acts as a margin */}

    <nav style={navStyle} className="navStyle">
      <div style={homeButtonStyle} onClick={() => navigate('/main-page')}>
        <div className="loop-logo" style={{'--themeColor': themeColor }}> </div>
      </div>

      {/* <div style={linkStyle} onClick={() => navigate('/chat')}>Chat</div> */}

      <div style={leftSideStyle}>
        <div className="hide-on-small-screen" style={navbarButtonStyleBackButton} onMouseEnter={() => setHoverGoBack(true)} onMouseLeave={() => setHoverGoBack(false)} onClick={goBack}>
          <GoBackButton color={themeColor} width="45px" height="45px" theme={theme} />
        </div>
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

      <div className="hide-on-small-screen" style={navbarButtonStyleTheme} onMouseEnter={() => setHoverTheme(true)} onMouseLeave={() => setHoverTheme(false)} onClick={toggleThemePopUpMenu}>
        <ThemeButton color={themeColor} width="45px" height="45px" theme={theme} />
      </div>

      <div className="hide-on-small-screen" style={navbarButtonStyleLanguage} onMouseEnter={() => setHoverLanguage(true)} onMouseLeave={() => setHoverLanguage(false)} onClick={toggleLanguagePopUpMenu}>
        <LanguageButton color={themeColor} width="45px" height="45px" />
      </div>


      {/* <div style={navbarButtonStyle} onClick={() => navigate('/')}>
        <Image
          src="/language_button.svg"
          alt="Language button"
          width={45}
          height={45}
        />
      </div> */}

      {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" className="hide-on-small-screen" style={profilePictureStyle} onClick={toggleProfilePopUpMenu} />}

      {/* Add your symbols here */}
      </div>

      {chatProfileBool && chatProfileImageLoaded && (
        <div style={chatProfileStyle} className="chatProfileStyle" onClick={() => navigate(`/profile/${chatProfileId}`)}>
          <img src={chatProfilePictureUrl} alt="Profile" style={chatProfileIconStyle}/>
          <p style={chatProfileTextStyle}>{chatProfileUserName}</p>
        </div>
      )}

    </nav>

    {!removeProfilePopUpMenu && (
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
    {!removeLanguagePopUpMenu && (
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
            <div className="check_mark" style={{'--themeColor': themeColor }}> </div>
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
            <div className="check_mark" style={{'--themeColor': themeColor }}> </div>
            )}
          </div>
          <div className="popup-menu-button" style={inPopUpMenuAutomatic} onClick={() => { handleLanguageChange('automatic'); }}>
            <p style={inPopUpMenuText}><FormattedMessage id="automatic" /></p>
            {userLanguage == 'automatic' && (
            <div className="check_mark" style={{'--themeColor': themeColor }}> </div>
            )}
          </div>
        {/* Your popup menu goes here */}
      </div>
    )}

    {!removeThemePopUpMenu && (
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
            <div className="check_mark" style={{'--themeColor': themeColor }}> </div>
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
            <div className="check_mark" style={{'--themeColor': themeColor }}> </div>
            )}
          </div>
          <div className="popup-menu-button" style={inPopUpMenuAutomatic} onClick={() => { handleThemeChange('automatic'); }}>
            <p style={inPopUpMenuText}><FormattedMessage id="automatic" /></p>
            {userTheme == 'automatic' && (
            <div className="check_mark" style={{'--themeColor': themeColor }}> </div>
            )}
          </div>
        {/* Your popup menu goes here */}
      </div>
    )}




    </>
    
  );
};



export default Navbar;