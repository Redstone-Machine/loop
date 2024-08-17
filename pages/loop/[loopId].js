import { usePageSetup } from '../../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';

import React, { useEffect } from 'react';
// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/router'

// import Head from 'next/head';

import { signOut } from 'next-auth/react';

// import { getServerSession } from "next-auth/next"
// import { authOptions } from './api/auth/[...nextauth]'

// import useSWR from 'swr'
import Link from 'next/link'

import useSWR from 'swr';

async function fetcher(url) {
  const res = await fetch(url)
  return res.json()
}


const MainPage = () => {

  const { userId, userName, session, status, userLanguage, userTheme, theme, router, changeColor, themeColor, setThemeColor } = usePageSetup();

  const { loopId } = router.query;

//   console.log('loopId in normal:', loopId);

  const { data: users, error } = useSWR('/api/getUsers', fetcher)  
  const { data: Friends, error: FriendError } = useSWR(`/api/getFriendsById?userId=${userId}`, fetcher)
  const { data: recivedFriendRequests, error: recivedFriendRequestsError } = useSWR(`/api/getRecivedFriendRequestById?userId=${userId}`, fetcher)
  const { data: loopUsers, error: loopUsersError } = useSWR(`/api/getUsersFromLoopByLoopId?loopId=${loopId}`, fetcher)
  const { data: loop, error: loopError } = useSWR(`/api/getLoopInfoByLoopId?loopId=${loopId}`, fetcher)
  console.log('loopUsers:', loopUsers);

  useEffect(() => {
    console.log('loop color:', loop?.color);
    setThemeColor(loop?.color);
    console.log('theme color:', themeColor);
  }, [loop?.color]);

  return (
    <>
      {userTheme && (
        <>

          <div>
          <h1 style={{ color: loop?.color }}>{loop?.name}</h1>

            {loopUsers && users && userId
              ? users
                .filter(user => loopUsers.includes(user.id) && user.id !== userId)
                .map(user => (
                  <div key={user.id}>
                    <Link href={`/chat/${user.id}`}>
                      {user.userName}
                    </Link>
                  </div>
                ))
              : <div>Loading... friends</div>
            }

          </div>
        </>
      )}
    </>
  );



};

export default MainPage;
