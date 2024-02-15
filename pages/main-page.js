import { getUserIdFromSession } from '../utils/utils';


import { IntlProvider, FormattedMessage } from 'react-intl';

import React from 'react';
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoginButton from "../components/login-btn";
import Head from 'next/head';

import { signOut } from 'next-auth/react';

import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]'

import useSWR from 'swr'
import Link from 'next/link'

async function fetcher(url) {
  const res = await fetch(url)
  return res.json()
}

// export async function getServerSideProps({ req, res }) {
//     return {
//       props: {
//         session: await getServerSession(req, res, authOptions)
//       }
//     }
//   }

const MainPage = () => {
    // const { data: session, status: loading } = useSession()    
    
    // const { data: session } = useSession()
    // const { session, loading } = useSession()
    // const { data: session, status: loading } = useSession() 
    
    const [language, setLanguage] = useState(null);
    const [userLanguage, setUserLanguage] = useState(null);

    const [userTheme, setUserTheme] = useState(null);
    const [theme, setTheme] = useState(null);
    

//    const { data: session, status } = useSession() 

    const { data: session, status } = useSession();
    // console.log('session i main:', session);
    const userId = getUserIdFromSession(session, status);
    
    console.log('userId:', userId);

    // const { loading } = useSession()

    const { data: users, error } = useSWR('/api/getUsers', fetcher)

    console.log('all users:', users);

    const router = useRouter();





    useEffect(() => {
      // Hämta webbläsarens språk
      const browserLanguage = navigator.language || navigator.languages[0];
    
      // Om webbläsarens språk är 'sv', sätt språket till 'swedish', annars 'english'
      setLanguage(browserLanguage.startsWith('sv') ? 'swedish' : 'english');
    }, []);



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
      // console.log('userLanguage rn:', userLanguage);
      if (userLanguage && userLanguage !== 'automatic') {
        setLanguage(userLanguage);
      }
    }, [userLanguage]);





    useEffect(() => {
      // Kontrollera webbläsarens preferens
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
      // Sätt temat till mörkt om webbläsaren föredrar det, annars ljust
      setTheme(prefersDarkMode ? 'dark' : 'light');
    }, []);

    console.log('language:', language);


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
      // console.log('userTheme rn:', userTheme);
      if (userTheme && userTheme !== 'automatic') {
        setTheme(userTheme);
      }
    }, [userTheme]);

    // console.log('userTheme:', userTheme);
    console.log('theme:', theme);

  //   const [userName, setUserName] = useState(null);
  //   useEffect(() => {
  //     if (userId) {
  //         fetch(`/api/getUserById?id=${userId}`)
  //             .then(response => response.json())
  //             .then(user => setUserName(user.userName));
  //     }
  // }, [userId]);




    // useEffect(() => {
    //   // if (!loading) { // Only check if the user is logged in when loading is false
    //     if (session) {
    //       console.log('User is logged in:', session)
    //     } else {
    //       console.log('User is not logged in')
    //       router.push('/login');
    //     }
    //   // }
    // }, [session, loading]) // Add loading to the dependency array
  
    // if (error) return <div>Failed to load users</div>
    // if (users === undefined) return <div>Loading...</div>
    // if (users === null) return <div>No users found</div>




    useEffect(() => {
      if (status === 'unauthenticated') {
        console.log('User is not logged in')
        router.push('/login');
      } else if (status === 'authenticated') {
        console.log('User is logged in:', session)
      }
    }, [status, session])




    const handleSignOut = () => {
      signOut();
    }
    
    // useEffect(() => {
    //   if (session) {
    //     console.log('User is logged in:', session)
    //   } else {
    //     console.log('User is not logged in')
    //     router.push('/login');
    //   }
    // }, [session])


    // if (error) return <div>Failed to load users</div>
    // if (!users) return <div>Loading...</div>


    return (
      <>
      {userTheme && (
      <>
      <Head>
        <style>{`
          body {
            background-color: ${theme === 'light' ? 'white' : 'black'};
            color: ${theme === 'light' ? 'black' : 'white'};
          }
        `}</style>
      </Head>

      <div>

            <h1>Welcome to Loop</h1>


            <button onClick={handleSignOut}>
              Sign Out
            </button>
            <br />
            <br /> 
            <Link href={`/settings`}>
              Settings
            </Link>
            <br />
            <Link href={`/add-friends`}>
              Add friends
            </Link>
            <br />
            <br />
            

            {users && userId
            ? users
              .filter(user => user.id !== userId)
              .map(user => (
                <div key={user.id}>
                  <Link href={`/chat/${user.id}`}>
                    {user.userName}
                  </Link>
                </div>
            ))
            : <div>Loading... users</div>
            }

</div>
  </>
      )}
      </>
    );
        


    // return (
    //     // <>
    //     {/* <div>
    //         <LoginButton />
    //     </div> */}

    //     <div>
    //         <h1>Välkommen till Loop</h1>
    //     </div>
    //     {/* </> */}
        
    // );
};

export default MainPage;
