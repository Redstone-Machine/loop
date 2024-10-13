import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';

import React from 'react';
import { useState, useEffect, useContext, act } from 'react';
import useSWR, { mutate } from 'swr'
import axios from 'axios';

import Link from 'next/link'
import { min } from 'lodash';
// import { text } from 'stream/consumers';


async function fetcher(url) {
    const res = await fetch(url)
    return res.json()
}


const NewMainPage = () => {


    const { userId, userName, session, status, userLanguage, userTheme, theme, router, setThemeColor, themeColor } = usePageSetup();
    const { data: loops, error: loopsError } = useSWR(`/api/getAllLoopsById?userId=${userId}`, fetcher)



    console.log('loops', loops)

    // console.log('loopFriends', loopFriends)


    const [phoneLayout, setPhoneLayout] = useState(false);
    const [marginLeft, setMarginLeft] = useState('0px');

    const [loopBackgroundWidth, setLoopBackgroundWidth] = useState(160);

    const { data: friends, error: friendError } = useSWR(`/api/getLatestFriendsById?userId=${userId}`, fetcher)

    // const { data: loopFriends, error: loopFriendError } = useSWR(`/api/getThreeLatestFriendsByLoopId?loopId=${loopId}`, fetcher)

    
    const [positions, setPositions] = useState({});



    const [loopFriends, setLoopFriends] = useState(null);
    const [loopFriendError, setLoopFriendError] = useState(null);
  
    useEffect(() => {
        if (Array.isArray(loops)) {
          const fetchLoopFriends = async () => {
            try {
              const friendsData = await Promise.all(
                loops.map(async (loop) => {
                  const loopFriendsUrl = `/api/getThreeLatestFriendsByLoopId?loopId=${loop.id}`;
                  console.log('Generated URL:', loopFriendsUrl);
                  const response = await axios.get(loopFriendsUrl);
                  return { loopId: loop.id, friends: response.data };
                })
              );
    
              const friendsByLoopId = friendsData.reduce((acc, { loopId, friends }) => {
                acc[loopId] = friends;
                return acc;
              }, {});
    
              setLoopFriends(friendsByLoopId);
              console.log('Loop Friends Data:', friendsByLoopId);
            } catch (error) {
              setLoopFriendError(error);
              console.log('Loop Friends Error:', error);
            }
          };
    
          fetchLoopFriends();
        }
      }, [loops]);



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


    useEffect(() => {

        setThemeColor('#3de434');
    
    }, []);
    


    useEffect(() => {
        // Kontrollera skärmdimensionerna vid första renderingen
        checkScreenDimensions();
        updateMarginLeft();

        // Lägg till en resize-händelselyssnare
        window.addEventListener('resize', handleResize);

        // Rensa händelselyssnaren när komponenten avmonteras
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleResize = () => {
        checkScreenDimensions();
        updateMarginLeft();
    };

    const checkScreenDimensions = () => {
        if (window.innerWidth <= 700) {
            setLoopBackgroundWidth(window.innerWidth * 0.35);
            setPhoneLayout(true);
        } else {
            setLoopBackgroundWidth(160);
            setPhoneLayout(false);
        }
    };

    const handleProfileClick = async (friendId) => {
        await router.prefetch(`/chat/${friendId}`);
        router.push(`/chat/${friendId}`);
    };






    const updateMarginLeft = () => {
        




        let percentageWidth;
        let loopBackgroundWidthVar;
        let loopBackgroundWidthWithMargin;

        if (window.innerWidth <= 700) {
            percentageWidth = window.innerWidth; // Använd 80% av fönsterbredden om bredden är 700px eller mindre
            loopBackgroundWidthVar = window.innerWidth * 0.35;
            // loopBackgroundWidthVar = window.innerWidth * 0.35;
            loopBackgroundWidthWithMargin = loopBackgroundWidthVar + 20;

        } else {
            percentageWidth = 0.65 * window.innerWidth - 2; // Använd 65% av fönsterbredden annars
            loopBackgroundWidthVar = 160;
            // setLoopBackgroundWidth(160);
            loopBackgroundWidthWithMargin = loopBackgroundWidthVar + 20;
        }


        // const loopBackgroundWidthWithMargin = loopBackgroundWidthVar + 20;
        

        console.log('loopBackgroundWidthWithMargin', loopBackgroundWidthWithMargin);

        // const percentageWidth = 0.65 * window.innerWidth; // 65% av fönsterbredden
        const amountOfLoopsRow = Math.floor(percentageWidth / loopBackgroundWidthWithMargin ); // Dela med 170px och avrunda nedåt
        console.log('amount of loops row', amountOfLoopsRow);
        const loopsTotalWidth = loopBackgroundWidthWithMargin * amountOfLoopsRow;
        console.log('loops total width', loopsTotalWidth);
        const marginRightStandard = percentageWidth - loopsTotalWidth;
        console.log('margin right standard', marginRightStandard);
        const result = marginRightStandard / 2;
        console.log('result', result);
        setMarginLeft(`${Math.floor(result)}px`); // Avrunda till närmaste lägre heltal
    };


    const gridStyle = {
        display: 'grid',
        // gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        // gap: '16px',
        // marginTop: '16px',
        // marginRight: '14px',
        // marginLeft: '14px',
      }




    const navigate = (url) => {
        router.push(url);
    };

    useEffect(() => {
        document.body.style.margin = '0';
    }, []);


    const OuterContainerLoop = {
        width: phoneLayout ? '100%' : '65%',
        minHeight: 'calc(100vh - (0.5rem + 80px))',
        height: 'calc(100%)',

        

        borderRight: phoneLayout ? 'none' : '1px solid #AAAAAA',
        overflow: 'auto',
    }

    const OuterContainerFriends = {
        width: phoneLayout ? '100%' : '35%', // Justera bredden så att den passar bredvid Loop
        minHeight: 'calc(100vh - (0.5rem + 80px))',
        height: 'calc(100%)',
        overflow: 'auto',
    }

    const OuterContainer = {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 'calc(100vh - (0.5rem + 80px))',
        overflow: 'hidden',
    
    }


    const containerFriends = {
        display: 'flex',
        flexDirection: 'row',
        // width: '100%',
        paddingBlock: '17px',
        paddingInline: '15px',
        borderBottom: '1px solid #AAAAAA',
        

    }

    

    const profilePictureStyle = {
        width: '75px',
        height: '75px',
        borderRadius: '50%',
        // boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    }

    const textStyleFriend = {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'SF Pro', sans-serif",

    }

    const latestMessage = {
        paddingLeft: '15px',
        fontSize: '1.2rem',
        paddingTop: '2px',
        color: 'grey',

    }

    const nameTextStyle = {
        paddingLeft: '15px',
        paddingTop: '11px',
        position: 'relative',
        textAlign: 'start',
        fontSize: '1.4rem',

        // textShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        // marginBottom: '8px',
    
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

    const loopBox = {
        // display: 'flex',
        // width: phoneLayout ? '100%' : '65%',
        // width: '100%',
        // justifyContent: 'center',
        marginLeft: marginLeft,
        // borderRight: '1px solid #AAAAAA',
        
    };

    const loopContainer = {
        
        display: 'flex',
        flexDirection: 'row', // Lägg objekten i rad
        flexWrap: 'wrap', // Tillåt att objekten bryts till nästa rad om de inte får plats
        justifyContent: 'start',
        // justifyContent: 'space-between', // Fördela utrymmet jämnt mellan objekten
        // alignItems: 'center',
        // height: '100px',
        // width: '100px',
        // margin: '10px',
        // width: phoneLayout ? '100%' : '65%',
        // borderRadius: '10px',
        // cursor: 'pointer',
    }

    const loopWrapper = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // marginInline: '20px',
        marginInline: '10px',
        marginBlock: '5px',

    }

    const textUnderLoop = {
        fontFamily: "'SF Pro', sans-serif",
        fontSize: '1.5rem',
        marginBlockStart: '0px',
        marginBlockEnd: '0px',
        height: '1lh',
        // fontWeight: 'bold',
    }



    const title = {
        fontFamily: "'SF Pro', sans-serif",
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBlockStart: '0px',
        marginBlockEnd: '0px',
        paddingTop: '1.5rem',
        paddingLeft: phoneLayout ? '0.5rem' : '3rem',
        paddingBottom: '0.5rem',
        textAlign: phoneLayout ? 'center' : 'start',
    }

    const extraSpace = {
        height: '170px',
    }


    const plusIcon = {
        // maxWidth: '80%',
        // maxHeight: '80%',
        // objectFit: 'contain',
    }

    
    if (friendError) return <div>Error loading friends.</div>;
    if (!friends) return <div>Loading...</div>;

    if (loopsError || loopFriendError) return <div>Error loading data</div>;
    if (!loops || !loopFriends || Object.keys(loopFriends).length === 0) return <div>Loading...</div>;

    return (
        <> 
        <div style={OuterContainer}>           
            <div style={OuterContainerLoop}>
            <div>
                <h1 style={title}>Välkommen till Loop</h1>
            </div>


            <div style={loopBox}>
            <div style={loopContainer}>
                
                
                {loops
                    ? loops.length > 0
                        ? loops.map(loop => (
                            <div key={loop.id} style={loopWrapper} onClick={() => navigate(`/loop/${loop.id}`)}>
                                
                            {loopFriends[loop.id]?.map((friend, index) => (
                              <div key={friend.id} style={{ position: 'absolute' }}>
                                {index === 0 && (
                                  <img
                                    src={friend.profilePicture}
                                    alt={`${friend.userName}'s profile`}
                                    className="friend-img-large"
                                    style={{
                                        width: `calc(${loopBackgroundWidth}px * 0.48)`,
                                        zIndex: 3,
                                        right: `calc(${loopBackgroundWidth}px * 0.15)`,
                                        top: `calc(${loopBackgroundWidth}px * 0.00`,
                                        position: 'relative',
                                        borderRadius: '50%',
                                        border: '1px solid white' }}
                                  />
                                )}
                                {index === 1 && (
                                  <img
                                    src={friend.profilePicture}
                                    alt={`${friend.userName}'s profile`}
                                    className="friend-img-medium"
                                    style={{
                                        width: `calc(${loopBackgroundWidth}px * 0.41)`,
                                        zIndex: 2,
                                        left: `calc(${loopBackgroundWidth}px * 0.1)`,
                                        bottom: `calc(${loopBackgroundWidth}px * 0.18)`,
                                        position: 'relative',
                                        borderRadius: '50%',
                                        border: '1px solid white' }}
                                        
                                  />
                                )}
                                {index === 2 && (
                                  <img
                                    src={friend.profilePicture}
                                    alt={`${friend.userName}'s profile`}
                                    className="friend-img-small"
                                    style={{ width: `calc(${loopBackgroundWidth}px * 0.36)`,
                                        zIndex: 1,
                                        position: 'relative',
                                        left: `calc(${loopBackgroundWidth}px * 0.1)`,
                                        top: `calc(${loopBackgroundWidth}px * 0.18)`,
                                        borderRadius: '50%',
                                        border: '1px solid white' }}
                                  />
                                )}
                              </div>

                                ))}


                                <div className="loop-background" style={{'--loopColor': loop?.color, '--loopBackgroundWidth': loopBackgroundWidth + 'px' }}>
                                 
                                 

                            
                            
                            
                                </div>
                                {/* <Link style={{ color: loop?.color, backgroundColor: '#ededed' }} href={`/loop/${loop.id}`}> */}
                                <p
                                    style={{
                                        ...textUnderLoop,
                                        color: loop?.color,
                                    }}
                                    className="no-select"
                                >
                                    {loop.name}
                                </p>
                                {/* {loop.name} */}
                                {/* </Link> */}
                                {/* </div> */}
                            </div>
                            )
                        )
                        // : <div>Finns inga loops</div>
                        : <div> </div>
                    : <div>Loading... loops</div>
                }
                <div style={loopWrapper} onClick={() => navigate('/create-loop')}>
                    <div className="loop-background" style={{'--loopColor': themeColor, '--loopBackgroundWidth': loopBackgroundWidth + 'px' }}>
                        <div className="plus-icon-loop" style={{'--themeColor': 'black', '--loopPlusWidth': loopBackgroundWidth * 0.6 + 'px', '--loopPlusMargin': loopBackgroundWidth * 0.2 + 'px' }}> </div>
                    </div>
                    <p
                        style={{
                            ...textUnderLoop,
                            color: themeColor
                        }}
                    >
                        {/* Skapa en ny loop */}
                        
                        
                        
                    </p>
                </div>


            </div>
            </div>
            <div style={extraSpace}> </div>
            </div>



            { !phoneLayout && (

                <div style={OuterContainerFriends}>
                    <div style={gridStyle}>
                
                        {friends.map(friend => {
                            const position = positions[friend.id] || { top: 50, left: 50 };
                    
                            return (

                                <div key={friend.id} style={containerFriends} className="container-friends no-select" onClick={() => handleProfileClick(friend.id)} >
                                    <img
                                        src={friend.user.profilePicture}
                                        alt={`${friend.user.userName}'s profile`}
                                        style={profilePictureStyle}
                                    />
                                    <div style={textStyleFriend}>
                                        <div style={nameTextStyle}>{friend.user.userName}</div>
                                        {/* {friend.latestMessage && (
                                            <div style={getMessagesStyle(position, friend)}>
                                            {friend.latestMessage.length > 20 ? `${friend.latestMessage.substring(0, 20)}...` : friend.latestMessage}
                                            </div>
                                        )} */}
                                        {friend.latestMessage && (
                                            <div style={latestMessage}>
                                                {friend.latestMessage.length > 30 ? `${friend.latestMessage.substring(0, 30)}...` : friend.latestMessage}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                </div>
            )}
        </div>

        </>

    
    );



  



};

export default NewMainPage;