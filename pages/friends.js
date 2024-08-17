// pages/friends.js

import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';

import React from 'react';


import useSWR, { mutate } from 'swr'




async function fetcher(url) {
  const res = await fetch(url)
  return res.json()
}


const FriendsPage = () => {

  const { userId, userName, session, status, userLanguage, userTheme, theme, router, setThemeColor } = usePageSetup();

  const { data: friends, error: friendError } = useSWR(`/api/getLatestFriendsById?userId=${userId}`, fetcher)
    if (friendError) return <div>Error loading friends.</div>;
    if (!friends) return <div>Loading...</div>;



    // return (
    // <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
    //     {friends.map(friend => (
    //     <div key={friend.id} style={{ textAlign: 'center' }}>
    //         <img
    //             src={friend.user.profilePicture}
    //             alt={`${friend.user.userName}'s profile`}
    //             style={{ width: '100px', height: '100px', borderRadius: '50%' }}
    //         />
    //         <div>{friend.user.userName}</div>
    //     </div>
    //     ))}
    // </div>
    // );
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {friends.map(friend => {
            const randomTop = Math.random() * 20 - 10; // Random value between -10px and 10px
            const randomLeft = Math.random() * 20 - 10; // Random value between -10px and 10px
    
            return (
              <div key={friend.id} style={{ position: 'relative', textAlign: 'center' }}>
                <img
                  src={friend.user.profilePicture}
                  alt={`${friend.user.userName}'s profile`}
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <div>{friend.user.userName}</div>
                {friend.latestMessage && (
                  <div style={{
                    position: 'absolute',
                    top: `${randomTop}px`,
                    left: `${randomLeft}px`,
                    backgroundColor: '#f1f1f1',
                    padding: '8px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                    whiteSpace: 'nowrap',
                    zIndex: 1,
                  }}>
                    {friend.latestMessage}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );

};

export default FriendsPage;