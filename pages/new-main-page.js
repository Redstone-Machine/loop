import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage, useIntl } from 'react-intl';

import React, { useMemo } from 'react';
import { useState, useEffect, useContext, act, useRef } from 'react';
import useSWR, { mutate } from 'swr'
import axios from 'axios';


import Link from 'next/link'
import { min, random } from 'lodash';

import { PageLoadContext } from '../contexts/PageLoadContext';
// import { text } from 'stream/consumers';


async function fetcher(url) {
    const res = await fetch(url)
    return res.json()
}


const NewMainPage = () => {


    const { userId, userName, session, status, userLanguage, userTheme, theme, router, setThemeColor, themeColor } = usePageSetup();

    const { data: loops, error: loopsError } = useSWR(userId ? `/api/getAllLoopsById?userId=${userId}` : null, fetcher);

    const [keyCompReady, setKeyCompReady] = useState(false);
    const intl = useIntl();

    // console.log('loops', loops)

    // console.log('loopFriends', loopFriends)


    const [phoneLayout, setPhoneLayout] = useState(false);
    const [marginLeft, setMarginLeft] = useState('0px');

    const [loopBackgroundWidth, setLoopBackgroundWidth] = useState(160);

    const { data: friends, error: friendError } = useSWR(`/api/getLatestFriendsById?userId=${userId}`, fetcher)

    // const { data: loopFriends, error: loopFriendError } = useSWR(`/api/getThreeLatestFriendsByLoopId?loopId=${loopId}`, fetcher)

    
    const [positions, setPositions] = useState({});



    const [loopFriends, setLoopFriends] = useState(null);
    const [loopFriendError, setLoopFriendError] = useState(null);

    const scrollableRefs = useRef([]);

    useEffect(() => {
        // Sätt scrollbar width till 0px när komponenten monteras
        scrollableRefs.current.forEach((scrollableElement) => {
            if (scrollableElement) {
                scrollableElement.style.setProperty('--scrollbar-width', '0px');
            }
        });


        const handleScroll = (scrollableElement) => {
            console.log('Scrolling...');
            scrollableElement.style.setProperty('--scrollbar-width', '9px');
            clearTimeout(scrollableElement.scrollTimeout);
            scrollableElement.scrollTimeout = setTimeout(() => {
                scrollableElement.style.setProperty('--scrollbar-width', '0px');
                console.log('Scrollbar hidden');
            }, 1000); // Justera timeout efter behov
        };

        const addScrollListeners = () => {
            scrollableRefs.current.forEach((scrollableElement) => {
                if (scrollableElement) {
                    scrollableElement.addEventListener('scroll', () => handleScroll(scrollableElement));
                    scrollableElement.style.setProperty('--scrollbar-width', '0px');
                }
            });

        };

        const observer = new MutationObserver(() => {
            addScrollListeners();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Rensa observer när komponenten avmonteras
        return () => {
            observer.disconnect();
            scrollableRefs.current.forEach((scrollableElement) => {
                if (scrollableElement) {
                    scrollableElement.removeEventListener('scroll', () => handleScroll(scrollableElement));
                }
            });
        };
    }, []);
    
  
    useEffect(() => {
        if (Array.isArray(loops)) {
          const fetchLoopFriends = async () => {
            try {
              const friendsData = await Promise.all(
                loops.map(async (loop) => {
                  const loopFriendsUrl = `/api/getThreeLatestFriendsByLoopId?loopId=${loop.id}&requesterId=${userId}`;
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
      }, [loops, userId]);



    // useEffect(() => {
    //   if (friends) {
    //     const newPositions = {};
    //     friends.forEach(friend => {
    //       const centerTop = 50; // 50% från toppen
    //       const centerLeft = 50; // 50% från vänster
  
    //       // Lägg till en slumpmässig förskjutning
    //       const randomTop = centerTop + (Math.random() * 45 - 35); // Slumpmässig förskjutning mellan -30% och 30%
    //       const randomLeft = centerLeft + (Math.random() * 35 - 25); // Slumpmässig förskjutning mellan -30% och 30%
  
    //       newPositions[friend.id] = {
    //         top: randomTop,
    //         left: randomLeft,
    //       };
    //     });
    //     setPositions(newPositions);
    //   }
    // }, [friends]);


    useEffect(() => {
        console.log('useEffect theme color ran');

        setThemeColor('#3de434');
    
    }, []);




    const { setIsPageLoaded } = useContext(PageLoadContext);

    useEffect(() => {
      console.log('useEffect for page load ran');
      
      const handlePageLoad = () => {
        console.log('Page is loaded');
        
        // Vänta tills nästa renderingscykel är klar
        new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
          // Vänta tills alla typsnitt har laddats
            if (keyCompReady) {
            document.fonts.ready.then(() => {
                setTimeout(() => {
                setIsPageLoaded(true);
                }, 100);
            });
            }
        });
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
    }, [setIsPageLoaded, keyCompReady]);
    


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
            loopBackgroundWidthWithMargin = loopBackgroundWidthVar + 20 + 2;
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



    const getTitleText = () => {
        const now = new Date();
        const month = now.getMonth();
        const date = now.getDate();
        const hours = now.getHours();
        const year = now.getYear();
    
        const randomShowUsername = Math.floor(Math.random() * 2);

        const yearReal = year + 1900;

        // Kontrollera om det är jul (december)
        if (month === 11 && date === 24) {
            if (randomShowUsername === 0) {
                return intl.formatMessage({ id: 'title.christmas.username', defaultMessage: 'God Jul, {userName}!' }, { userName });
            } else {
                return intl.formatMessage({ id: 'title.christmas', defaultMessage: 'God Jul!' });
            }
        }
    
        // Kontrollera om det är halloween (31 oktober)
        if (month === 9 && date === 31) {
            if (randomShowUsername === 0) {
                return intl.formatMessage({ id: 'title.halloween', defaultMessage: 'Glad Halloween, {userName}!' }, { userName });
            } else {
                return intl.formatMessage({ id: 'title.halloween', defaultMessage: 'Glad Halloween!' });
            }
        }
    
        // Kontrollera om det är påsk (enkel kontroll för april)
        if (year === 125 && month === 4 && date === 20) {
            if (randomShowUsername === 0) {
                return intl.formatMessage({ id: 'title.easter.username', defaultMessage: 'Glad Påsk, {userName}!' }, { userName });
            } else {
                return intl.formatMessage({ id: 'title.easter', defaultMessage: 'Glad Påsk!' });
            }
        }

        if ( month === 11 && date === 31) {
            if (randomShowUsername === 0) {
                return intl.formatMessage({ id: 'title.newyear.username', defaultMessage: 'Nytt år' }, { userName });
            } else {
                return intl.formatMessage({ id: 'title.newyear', defaultMessage: 'Nytt år' });
            }
        }

        if ( month === 1 && date === 14) {
            if (randomShowUsername === 0) {
                return intl.formatMessage({ id: 'title.valentine.username', defaultMessage: 'Hjärta dag' }, { userName });
            } else {
                return intl.formatMessage({ id: 'title.valentine', defaultMessage: 'Hjärta dag' });
            }
        }

        if ( month === 0 && date === 1) {
            if (randomShowUsername === 0) {
                return intl.formatMessage({ id: 'title.firstdaynewyear.username', defaultMessage: 'Nytt år' }, { userName, yearReal });
            } else {
                return intl.formatMessage({ id: 'title.firstdaynewyear', defaultMessage: 'Nytt år' });
            }
        }

        if ( month === 9 && date === 4) {
            if (randomShowUsername === 0) {
                return intl.formatMessage({ id: 'title.cinnamonbunday.username', defaultMessage: 'Kanelbulle' }, { userName });
            } else {
                return intl.formatMessage({ id: 'title.cinnamonbunday', defaultMessage: 'Kanelbulle' });
            }
        }




        const randomNumber = Math.floor(Math.random() * 4);
        const randomTitle = Math.floor(Math.random() * 5);

        if (randomNumber > 1) {
    
            // Kontrollera tid på dygnet
            if ( 3 < hours && hours < 10) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.morning.username', defaultMessage: 'God Morgon, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.morning', defaultMessage: 'God Morgon!' });
                }
            } else if (hours < 12) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.prenoon.username', defaultMessage: 'God Förmiddag, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.prenoon', defaultMessage: 'God Förmiddag!' });
                }
            } else if (hours < 18) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.afternoon.username', defaultMessage: 'God Eftermiddag, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.afternoon', defaultMessage: 'God Eftermiddag!' });
                }
            } else if (hours < 22) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.evening.username', defaultMessage: 'God Kväll, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.evening', defaultMessage: 'God Kväll!' });
                }
            } else {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.night.username', defaultMessage: 'Nattsuddare, {userName}?' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.night', defaultMessage: 'Nattsuddare?' });
                }
            }

        } else {
            if (randomTitle === 0) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.random1.username', defaultMessage: 'Välkommen, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.random1', defaultMessage: 'Välkommen!' });
                }
            } else if (randomTitle === 1) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.random2.username', defaultMessage: 'Hej, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.random2', defaultMessage: 'Hej!' });
                }
            } else if (randomTitle === 2) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.random3.username', defaultMessage: 'Trevligt att se dig, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.random3', defaultMessage: 'Trevligt att se dig!' });
                } 
            } else if (randomTitle === 3) {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.random4.username', defaultMessage: 'Vad kul att du är här, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.random4', defaultMessage: 'Vad kul att du är här!' });
                }
            } else {
                if (randomShowUsername === 0) {
                    return intl.formatMessage({ id: 'title.random5.username', defaultMessage: 'Välkommen till Loop, {userName}!' }, { userName });
                } else {
                    return intl.formatMessage({ id: 'title.random5', defaultMessage: 'Välkommen till Loop, {userName}!' }, { userName });
                }
            }
        }
      };

      const titleText = useMemo(getTitleText, [intl, userName]);



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
        // fontFamily: "'SF Pro', sans-serif",
        fontFamily: "'Brush-Font', sans-serif",
        fontSize: '2rem',
        marginBlockStart: '0px',
        marginBlockEnd: '0px',
        height: '1lh',
        // fontWeight: 'bold',
    }



    const title = {
        fontFamily: "'Brush-Font', sans-serif",
        fontSize: '3.8rem',
        // fontWeight: 'bold',
        letterSpacing: '0.08em',
        marginBlockStart: '0px',
        marginBlockEnd: '0px',
        paddingTop: '1.5rem',
        paddingLeft: phoneLayout ? '0.5rem' : '3rem',
        paddingBottom: '0.5rem',
        textAlign: phoneLayout ? 'center' : 'start',
        color: themeColor,
        opacity: 0.85,
        // filter: 'brightness: (0.3)',


    }

    const extraSpace = {
        height: '170px',
    }


    const plusIcon = {
        // maxWidth: '80%',
        // maxHeight: '80%',
        // objectFit: 'contain',
    }

    useEffect(() => {
        if (userId && loops && friends) {
            setKeyCompReady(true);
        }
    }, [userId, loops, friends]);

    
    if (friendError) return <div>Error loading friends.</div>;
    // if (!friends) return <div>Loading...</div>;

    if (loopsError || loopFriendError) return <div>Error loading data</div>;
    if (!loops || !loopFriends || !friends || Object.keys(loopFriends).length === 0) {

    return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    );
    } 



    return (
        <> 
        <div style={OuterContainer}>           
            <div ref={(el) => (scrollableRefs.current[0] = el)} className="scrollable" style={OuterContainerLoop}>
            <div>
                <h1 style={title}>{titleText}</h1>
            </div>


            <div style={loopBox}>
            <div style={loopContainer}>
                
                
                {loops
                    ? loops.length > 0
                        ? loops.map(loop => (
                            <div key={loop.id} className="loop-wrapper" style={loopWrapper} onClick={() => navigate(`/loop/${loop.id}`)}>
                                
                            {loopFriends[loop.id]?.map((friend, index) => (
                              <div key={friend.id} style={{ position: 'relative' }}>
                                {index === 0 && (
                                  <img
                                    src={friend.profilePicture}
                                    alt={`${friend.userName}'s profile`}
                                    className="friend-img-large"
                                    style={{
                                        width: `calc(${loopBackgroundWidth}px * 0.48)`,
                                        zIndex: 3,
                                        right: `calc(${loopBackgroundWidth}px * (-0.12))`,
                                        top: `calc(${loopBackgroundWidth}px * 0.32`,
                                        position: 'absolute',
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
                                        
                                        width: `calc(${loopBackgroundWidth}px * 0.42)`,
                                        zIndex: 2,
                                        right: `calc(${loopBackgroundWidth}px * (-0.29))`,
                                        top: `calc(${loopBackgroundWidth}px * 0.17`,
                                        position: 'absolute',
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
                                        position: 'absolute',
                                        right: `calc(${loopBackgroundWidth}px * (-0.39))`,
                                        top: `calc(${loopBackgroundWidth}px * 0.44`,
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
                                    className="no-select under-loop-text"
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

                <div ref={(el) => (scrollableRefs.current[1] = el)} className="scrollable" style={OuterContainerFriends}>
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