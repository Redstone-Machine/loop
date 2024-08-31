import { FormattedMessage, useIntl } from 'react-intl';
import Head from 'next/head';

// import Link from 'next/link';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

import { useEffect } from 'react';

import { getUserIdFromSession } from '../utils/utils';
import { usePageSetup } from '../hooks/usePageSetup';

import GoogleLogo from '../public/company_logos/google_logo';
import AppleLogo from '../public/company_logos/apple_logo';

import { PageLoadContext } from '../contexts/PageLoadContext';


const Login = () => {

  const intl = useIntl();

  const { userId, userName, session, status, userLanguage, userTheme, theme, router, setThemeColor, themeColor } = usePageSetup();
  // const router = useRouter();
  useEffect(() => {
    // Detta säkerställer att usePageSetup körs igen vid sidladdning
  }, []);




  const { setIsPageLoaded } = useContext(PageLoadContext);

  useEffect(() => {
    console.log('useEffect for page load ran');
    
    const handlePageLoad = () => {
      console.log('Page is loaded');
      
    // Vänta tills nästa renderingscykel är klar
    setTimeout(() => {
      // Vänta tills alla typsnitt har laddats
      document.fonts.ready.then(() => {
        setIsPageLoaded(true);
      });
    }, 400);
  };
  
    console.log('Document readyState:', document.readyState);
    if (document.readyState === 'complete') {
      // If the page is already loaded, call the handler immediately
      handlePageLoad();
    } else {
      // Otherwise, wait for the load event
      window.addEventListener('load', handlePageLoad);
    }
  
    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
  }, [setIsPageLoaded]);



  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // const { data: session, status } = useSession();
  // const userId = getUserIdFromSession(session, status);




  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     // Kontrollera om fönstrets höjd har minskat, vilket indikerar att tangentbordet är öppet
  //     if (window.innerHeight < document.documentElement.clientHeight) {
  //       setIsKeyboardOpen(true);
  //     } else {
  //       setIsKeyboardOpen(false);
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);

  //   // Kör handleResize direkt för att sätta initialt värde
  //   handleResize();

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (isKeyboardOpen) {
  //     document.body.classList.add('no-scroll');
  //   } else {
  //     document.body.classList.add('no-scroll');
  //   }
  // }, [isKeyboardOpen]);



  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const result = await signIn('credentials', {
      callbackUrl: window.location.href,
      redirect: false,
      username,
      password,
    });


  
    if (result.error) {
      // alert('Failed to log in. Please check your username and password.');
      alert(intl.formatMessage({ id: 'loginFailed' }));
    } else {
      router.push('/main-page');
    }
  };



  // themeColor = themeColor === 'none' ? (theme === 'light' ? 'black' : 'white') : themeColor;


  const handleNoSupport = () => {
    alert(intl.formatMessage({ id: 'noSupport' }));
  }

  const signInGoogle = async (event) => {
    signIn('google', {
      // callbackUrl: window.location.href,
      callbackUrl: '/main-page',
      //callbackUrl: 'http://localhost:3000/main-page',
      redirect: false,
    })
    // router.push('/main-page');
    // .then(result => {
    //   if (result.error) {
    //     alert('Failed to log in. Please check your username and password.');
    //   } else {
    //     router.push('/main-page');
    //   }
    // })
    // .catch(err => {
    //   console.error('Failed to sign in:', err);
    // });


  };
  
  // const signInGoogle = async () => {
  //   const result = await signIn('google', {
  //     callbackUrl: window.location.href,
  //     redirect: false,
  //   });
  
  //   if (result.error) {
  //     alert('Failed to log in. Please check your Google account.');
  //   } else {
  //     router.push('/main-page');
  //   }
  // };

  const handleRegister = () => {
    router.push('/register')
  }

  const handleForceGoToMain = () => {
    router.push('/main-page')
  }

  // const handleSubmit = async (event) => {
  //   console.log('Handling submit...');
  //   console.log(username, password); // Log the username and password

  //   event.preventDefault();

  //   const response = await fetch('/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username, password }),
  //   });

  //   console.log('This is the server response:');
  //   console.log(response); // Log the response

  //   const data = await response.json();

  //   if (data.success) {
  //     // Handle successful login
  //     router.push('/dashboard'); // Redirect to dashboard page
  //   } else {
  //     // Handle failed login
  //     alert('Failed to log in. Please check your username and password.');
  //   }
  // };

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('User is not logged in')
    } else if (status === 'authenticated') {
      console.log('User is logged in:', session)
      router.push('/main-page');
    }
  }, [status, session])


  const loginPage = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '83vh', // Full height of the viewport
    fontFamily: "'SF Pro', sans-serif",
  }

  const loginTitle = {
    margin: '0',
    fontWeight: 'normal',
    fontSize: '2.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  }

  const loopLogo = {
    marginTop: '0.5rem',
    marginBottom: '1rem',

  }

  const titlePart = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignContent: 'center',
    height: 'auto',
    gap: '1rem',
  }

  const form = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const inputBoxes = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // height: '100vh', // Full height of the viewport
  }

  const inputStyle = {

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'min(5%, 1rem)',
    borderRadius: '23px',
    // border: '1px solid grey',
    // border: `1px solid ${theme === 'light' ? 'white' : 'black'}`,
    // borderLeft: `1px solid ${theme === 'light' ? 'black' : 'white'}`,
    // borderRight: `1px solid ${theme === 'light' ? 'black' : 'white'}`,
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    // borderRight: `1px solid ${theme === 'light' ? 'black' : 'white'}`,
    // width: 'min(20rem, 80%)',
    width: '70%', // Standardbredden är 80% av skärmens bredd
    maxWidth: '20rem', // Maximal bredd är 20 rem
    height: '2rem',
    fontSize: '1.1rem',
    padding: '0.6rem',
    paddingLeft: '1.2rem',
    paddingRight: '1.2rem',
    // height: '2.5rem',
    // height: '100vh', // Full height of the viewport

  }

  const usernameInput = {
    ...inputStyle,
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    // borderTop: `1px solid ${theme === 'light' ? 'black' : 'white'}`,
    borderTop: '1px solid black',
    borderBottom: 'none',
  }

  const passwordInput = {
    ...inputStyle,
    // borderTop: `1px solid ${theme === 'light' ? 'black' : 'white'}`,
    // borderBottom: `1px solid ${theme === 'light' ? 'black' : 'white'}`,
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    // borderTop: '1px solid grey',
    // borderTop: `1px solid ${theme === 'light' ? 'white' : 'black'}`,
    // borderTop: `1px solid ${theme === 'light' ? 'black' : 'white'}`,

  }

  const buttonsDiv = {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.9rem',
    width: '100%',
    justifyContent: 'center',
    marginTop: '1.2rem',
    marginBottom: '1.8rem',
  }

  const buttonsStyle = {
    // backgroundColor: theme === 'light' ? 'white' : 'black',
    border: `1px solid ${theme === 'light' ? 'black' : 'white'}`,
    borderRadius: '23px',
    // color: theme === 'light' ? 'black' : 'white',
    color: 'black',
    width: '35%',
    maxWidth: '10rem',
    height: '2.5rem',
    fontSize: '1rem',
    fontWeight: 'normal'
  }

  const buttonSignInStyle = {
    ...buttonsStyle,
    backgroundColor: themeColor,
  }

  const buttonRegisterStyle = {
    ...buttonsStyle,
    backgroundColor: '#c7c7c7',
  }

  const loginWithButton = {
    backgroundColor: 'white',
    alignContent: 'center',
    margin: '0.5rem',
    borderRadius: '30px',
    border: '1px solid black',
    padding: '0.9rem',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.7rem',
    width: '80%',
    maxWidth: '18rem',
    height: '3.5rem',
    // color: theme === 'light' ? 'white' : 'black',
    color: 'black',
    // marginLeft: '1rem',

  }
  

  const loginWithApple = {
    ...loginWithButton
  }

  const loginWithGoogle = {
    ...loginWithButton,
    // justifyContent: 'center',
    // alignContent: 'center',
    // margin: '0',
  }

  const loginText = {
    // alignContent: 'center',
    margin: '0',  
  }

  const loginTextGoogle = {
    ...loginText,
  }

  const loginTextApple = {
    ...loginText,
    // paddingTop: '0.2rem',
    // justifyContent: 'end',
  }

  const googleLogo = {
    alignContent: 'center',
  }

  const appleLogo = {
    alignContent: 'center',
  }

  return (
    <div style={loginPage}>

      {/* <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head> */}

      <div style={titlePart}>

        <h1 style={loginTitle}><FormattedMessage id="logInTitle" /></h1>
        <div style={loopLogo}>
          <div className="loop-logo" style={{'--themeColor': themeColor }}> </div>
        </div>
      </div>

      

      <form onSubmit={handleSubmit} style={form}>
        <div style={inputBoxes}>
          {/* <label htmlFor="username"><FormattedMessage id="username" />:</label> */}
          <input
            style={usernameInput}
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Användarnamn"
          />
          {/* <br /> */}
          {/* <label htmlFor="password"><FormattedMessage id="password" />:</label> */}
          <input
            style={passwordInput}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
          />
          {/* <br /> */}
          <div style={buttonsDiv}>
            <button style={buttonSignInStyle} type="submit"> 
              <FormattedMessage id="signIn" />
            </button>

            <button
              style={buttonRegisterStyle}
              onClick={handleRegister}
              type="button">
              <FormattedMessage id="register" />
            </button>
          </div>

        </div>

        {/* <button style={LoginWithApple}><FormattedMessage id="logInApple" /></button> */}
        <button
          style={loginWithGoogle}
          type="button"
          onClick={signInGoogle}
          >  
          <GoogleLogo style={googleLogo} height={24} width={24}/>
          <FormattedMessage id="logInGoogle" style={loginTextGoogle} />  
        </button>

        <button
          style={loginWithApple}
          type="button"
          // onClick={signInGoogle}
          onClick={handleNoSupport}
          >  
          <AppleLogo style={appleLogo} height={24} width={24}/>
          <FormattedMessage id="logInApple" style={loginTextApple} />  
        </button>


      </form>



      {/* <br />
      <br />
      <br />
      
      <button onClick={handleForceGoToMain}>
       Försök gå till startsidan
      </button> */}

      {/* <Link href="/create-account">
        <button>Skapa ett konto</button>
      </Link> */}
    </div>
  );
};

export default Login;