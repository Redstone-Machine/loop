// pages/friends.js

import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';
import React, { useState, useEffect, useContext } from 'react';


import useSWR, { mutate } from 'swr'

import { ThemeContext } from '../contexts/ThemeContext';


async function fetcher(url) {
  const res = await fetch(url)
  return res.json()
}


const FriendsPage = () => {

  const { userId, userName, session, status, userLanguage, userTheme, router, setThemeColor } = usePageSetup();

  
  const { data: friends, error: friendError } = useSWR(`/api/getLatestFriendsById?userId=${userId}`, fetcher)
  const { theme } = useContext(ThemeContext);

  const [positions, setPositions] = useState({});
  useEffect(() => {
    if (friends) {
      const newPositions = {};
      friends.forEach(friend => {
        const centerTop = 50; // 50% från toppen
        const centerLeft = 50; // 50% från vänster

        // Lägg till en slumpmässig förskjutning
        const randomTop = centerTop + (Math.random() * 45 - 35); // Slumpmässig förskjutning mellan -30% och 30%
        const randomLeft = centerLeft + (Math.random() * 35 - 25); // Slumpmässig förskjutning mellan -30% och 30%

        newPositions[friend.id] = {
          top: randomTop,
          left: randomLeft,
        };
      });
      setPositions(newPositions);
    }
  }, [friends]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginTop: '16px',
    marginRight: '14px',
    marginLeft: '14px',
  }

  const getMessagesStyle = (position, friend) => ({
    position: 'absolute',
    top: `${position.top}%`,
    left: friend.latestMessage.length > 12 ? '50%' : `${position.left}%`,
    transform: 'translate(-50%, -50%)', // För att centrera elementet
    // backgroundColor: '#f1f1f1',
    backgroundColor: theme === 'light' ? '#f1f1f1' : '#333',
    padding: '9px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    whiteSpace: 'nowrap',
    zIndex: 1,
    fontSize: '17px',
    fontFamily: "'SF Pro', sans-serif",
  });
  
  const profilePictureStyle = {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
  }

  const nameTextStyle = {
    position: 'relative',
    textAlign: 'center',
    fontSize: '1.3rem',
    fontFamily: "'SF Pro', sans-serif",
    textShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '8px',

  }

  const handleProfileClick = async (friendId) => {
    await router.prefetch(`/chat/${friendId}`);
    router.push(`/chat/${friendId}`);
  };

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
    if (friendError) return <div>Error loading friends.</div>;
    if (!friends) return <div>Loading...</div>;
  
    return (
      <div style={gridStyle}>
        {friends.map(friend => {
          const position = positions[friend.id] || { top: 50, left: 50 };
  
          return (
            <div key={friend.id} style={nameTextStyle} onClick={() => handleProfileClick(friend.id)} >
              <img
                src={friend.user.profilePicture}
                alt={`${friend.user.userName}'s profile`}
                style={profilePictureStyle}
              />
              <div>{friend.user.userName}</div>
              {friend.latestMessage && (
                <div style={getMessagesStyle(position, friend)}>
                  {friend.latestMessage.length > 20 ? `${friend.latestMessage.substring(0, 20)}...` : friend.latestMessage}
                </div>
              )}
            </div>
          );
        })}
      </div>
      );

};

export default FriendsPage;