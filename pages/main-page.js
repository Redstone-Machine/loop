import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';

import React from 'react';
// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/router'

// import Head from 'next/head';

import { signOut } from 'next-auth/react';

// import { getServerSession } from "next-auth/next"
// import { authOptions } from './api/auth/[...nextauth]'

// import useSWR from 'swr'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'

import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// import useSWR from 'swr';

async function fetcher(url) {
  const res = await fetch(url)
  return res.json()
}


const MainPage = () => {

  const { userId, userName, session, status, userLanguage, userTheme, theme, router, setThemeColor } = usePageSetup();
  const { data: users, userError } = useSWR('/api/getUsers', fetcher)  
  const { data: Friends, error: FriendError } = useSWR(`/api/getFriendsById?userId=${userId}`, fetcher)
  const { data: recivedFriendRequests, error: recivedFriendRequestsError } = useSWR(`/api/getRecivedFriendRequestById?userId=${userId}`, fetcher)
  const { data: loops, error: loopsError } = useSWR(`/api/getAllLoopsById?userId=${userId}`, fetcher)

  const handleSignOut = () => {
    // signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login` });
    // signOut({ callbackUrl: `http://192.168.0.12:3000/login` });
    signOut();
  }

  async function handleAcceptFriendRequest(addresseeId) {
    const response = await fetch('/api/acceptFriendRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requesterId: addresseeId,
        addresseeId: userId,
      }),
    })

    const data = await response.json()

    // // Reload the page
    // router.reload()

      // Update local data
    mutate(`/api/getRecivedFriendRequestById?userId=${userId}`, (data) => {
      return data.filter(id => id !== addresseeId)
    }, false)

    mutate(`/api/getFriendsById?userId=${userId}`, (data) => {
      return [...data, addresseeId]
    }, false)
  }



  // const usersIsLoading = !userError && !users;
  // const FriendsIsLoading = !FriendError && !Friends;
  // const recivedFriendRequestsIsLoading = !recivedFriendRequestsError && !recivedFriendRequests;
  // const loopsIsLoading = !loopsError && !loops;

  // const isLoaded = !(usersIsLoading || FriendsIsLoading || recivedFriendRequestsIsLoading || loopsIsLoading);
  
  useEffect(() => {
    setThemeColor('none');
  }, []);
  
  return (
    // <CSSTransition in={isLoaded} timeout={500} classNames="page-transition">
    <>
    
      {userTheme && (
        <>

          <div>


            {/* <h1>Welcome to Loop</h1> */}
            <h1>
              <FormattedMessage id="welcomeTitle" />
              , {userName}!
            </h1>
            {/* <FormattedMessage id="welcome" /> */}

            <button onClick={handleSignOut}>
              {/* Sign Out */}
              <FormattedMessage id="signOut" />
            </button>
            <br />
            <br />
            <Link href={`/settings`}>
              <FormattedMessage id="settingsName" />
            </Link>
            <br />
            <Link href={`/add-friends`}>
              <FormattedMessage id="addFriends" />
            </Link>
            <br />
            
            <h2> <FormattedMessage id="loop" /> </h2>

            {loops
              ? loops.length > 0
                ? loops.map(loop => (
                    <div key={loop.id}>
                      <Link style={{ color: loop?.color, backgroundColor: '#ededed' }} href={`/loop/${loop.id}`}>
                        {loop.name}
                      </Link>
                    </div>
                  ))
                : <div>Finns inga loops</div>
              : <div>Loading... loops</div>
            }
            
            <br />

            {/* <button onClick={() => router.push('/create-loop')}> <FormattedMessage id="createLoop" /> </button> */}
            <button onClick={async () => {
              await router.prefetch('/create-loop');
              router.push('/create-loop');
            }}>
              <FormattedMessage id="createLoop" />
            </button>
            
            <h2> <FormattedMessage id="friendsTitle" /> </h2>

            {Friends && users && userId
              ? users
                .filter(user => Friends.includes(user.id) && user.id !== userId)
                .map(user => (
                  <div key={user.id}>
                    <Link href={`/chat/${user.id}`}>
                      {user.userName}
                    </Link>
                  </div>
                ))
              : <div>Loading... friends</div>
            }

            <h2> <FormattedMessage id="friendRequestsTitle" /> </h2>

            {recivedFriendRequests && users && userId
              ? users
                .filter(user => recivedFriendRequests.includes(user.id) && user.id !== userId)
                .map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <p>{user.userName}</p>
                    <button onClick={() => handleAcceptFriendRequest(user.id)}><FormattedMessage id="acceptFriendRequest" /></button>
                  </div>
                ))
              : <div>Loading... requests</div>
            }

            <h2> <FormattedMessage id="allUsersTitle" /> </h2>

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
            <br />
            <br />

          </div>
        </>
      )}
    </>
    // </CSSTransition>
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
