import React from 'react';
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoginButton from "../components/login-btn";

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
    const { data: session, status } = useSession() 
    // const { loading } = useSession()

    const { data: users, error } = useSWR('/api/getUsers', fetcher)

    const router = useRouter();


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
            

            {users && session?.token.sub
            ? users
              .filter(user => user.id !== session.token.sub)
              .map(user => (
                <div key={user.id}>
                  <Link href={`/chat/${user.id}`}>
                    {user.name}
                  </Link>
                </div>
            ))
            : <div>Loading... users</div>
            }

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
