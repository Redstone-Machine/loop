import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';

import React from 'react';
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import Link from 'next/link'

async function fetcher(url) {
    const res = await fetch(url)
    return res.json()
  }


const AddFriends = () => {

  const { userId, userName, session, status, userLanguage, userTheme, theme, router } = usePageSetup();

    const { data: users, error } = useSWR('/api/getUsers', fetcher)

    // const { data: pendingFriends, error: pendingFriendsError } = useSWR(`/api/getPendingFriends?userId=${userId}`, fetcher)
    const { data: pendingFriends, error: pendingFriendsError } = useSWR(`/api/getSentFriendRequestById?userId=${userId}`, fetcher)
    const { data: recivedFriendRequests, error: recivedFriendRequestsError } = useSWR(`/api/getRecivedFriendRequestById?userId=${userId}`, fetcher)
    const { data: Friends, error: FriendError } = useSWR(`/api/getFriendsById?userId=${userId}`, fetcher)


    console.log('pendingFriends:', pendingFriends);
    console.log('recivedFriendRequests:', recivedFriendRequests);
    console.log('Friends:', Friends);

    async function handleAddFriend(addresseeId) {
      const response = await fetch('/api/addFriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requesterId: userId,
          addresseeId: addresseeId,
        }),
      })
  
      const data = await response.json()


      // Reload the page
      router.reload()
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

      // Reload the page
      router.reload()
    }


    return (
        <>
  
              <h1><FormattedMessage id="addFriends" /></h1>

              
  
            {/* {users && userId
              ? users
                .filter(user => user.id !== userId)
                .map(user => (
                  <div key={user.id}>
                    {/* <Link href={`/chat/${user.id}`}> */}
                    {/* {user.userName} */}
                    {/* </Link> */}
                    {/* <button onClick={() => handleAddFriend(user.id)}>Add friend</button> */}
                    {/* <button onClick={() => router.push(`/chat/${user.id}`)}>Add friend</button> */}
                    
                  {/* </div> */}

            
                  {users && userId
          ? users
            .filter(user => user.id !== userId)
            .map(user => {
              const isPending = pendingFriends && pendingFriends.includes(user.id);
              const isReceived = recivedFriendRequests && recivedFriendRequests.includes(user.id);
              const isFriends = Friends && Friends.includes(user.id);
              let button;

              if (isPending) {
                button = <button disabled><FormattedMessage id="pending" /></button>;
              } else if (isReceived) {
                button = <button onClick={() => handleAcceptFriendRequest(user.id)}><FormattedMessage id="acceptFriendRequest" /></button>;
              } else if (isFriends) {
                button = <button disabled><FormattedMessage id="friends" /></button>;
              } else {
                button = <button onClick={() => handleAddFriend(user.id)}><FormattedMessage id="addFriend" /></button>;
              }
              return (
                <div key={user.id}>
                  {user.userName}
                  {button}
                </div>
              );
            })
          : <div>Loading... users</div>
        }
  
      </>
      );
};

export default AddFriends;