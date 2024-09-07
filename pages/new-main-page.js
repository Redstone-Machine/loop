import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';

import React from 'react';
import { useState, useEffect, useContext, act } from 'react';
import useSWR, { mutate } from 'swr'

import Link from 'next/link'
import { min } from 'lodash';


async function fetcher(url) {
    const res = await fetch(url)
    return res.json()
}


const NewMainPage = () => {


    const { userId, userName, session, status, userLanguage, userTheme, theme, router, setThemeColor, themeColor } = usePageSetup();
    const { data: loops, error: loopsError } = useSWR(`/api/getAllLoopsById?userId=${userId}`, fetcher)

    const [phoneLayout, setPhoneLayout] = useState(false);
    const [marginLeft, setMarginLeft] = useState('0px');

    const { data: friends, error: friendError } = useSWR(`/api/getLatestFriendsById?userId=${userId}`, fetcher)

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
            setPhoneLayout(true);
        } else {
            setPhoneLayout(false);
        }
    };


    const profilePictureStyle = {
        width: '110px',
        height: '110px',
        borderRadius: '50%',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
      }



    const updateMarginLeft = () => {
        let percentageWidth;
        if (window.innerWidth <= 700) {
            percentageWidth = window.innerWidth; // Använd 80% av fönsterbredden om bredden är 700px eller mindre
        } else {
            percentageWidth = 0.65 * window.innerWidth - 2; // Använd 65% av fönsterbredden annars
        }
        // const percentageWidth = 0.65 * window.innerWidth; // 65% av fönsterbredden
        const amountOfLoopsRow = Math.floor(percentageWidth / 210 ); // Dela med 170px och avrunda nedåt
        console.log('amount of loops row', amountOfLoopsRow);
        const loopsTotalWidth = 210 * amountOfLoopsRow;
        console.log('loops total width', loopsTotalWidth);
        const marginRightStandard = percentageWidth - loopsTotalWidth;
        console.log('margin right standard', marginRightStandard);
        const result = marginRightStandard / 2;
        console.log('result', result);
        setMarginLeft(`${Math.floor(result)}px`); // Avrunda till närmaste lägre heltal
    };


    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '16px',
        marginTop: '16px',
        marginRight: '14px',
        marginLeft: '14px',
      }



    console.log('loops', loops)

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

        

        borderRight: '1px solid #AAAAAA',
    }

    const OuterContainerFriends = {
        width: phoneLayout ? '100%' : '35%', // Justera bredden så att den passar bredvid Loop
        minHeight: 'calc(100vh - (0.5rem + 80px))',
        height: 'calc(100%)',
    }

    const OuterContainer = {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    
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
        width: '100%',
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
        marginInline: '20px',
        marginBlock: '5px',

    }

    const textUnderLoop = {
        fontFamily: "'SF Pro', sans-serif",
        fontSize: '1.6rem',
        marginBlockStart: '0px',
        marginBlockEnd: '0px',
    }

    const nameTextStyle = {
        position: 'relative',
        textAlign: 'center',
        fontSize: '1.3rem',
        fontFamily: "'SF Pro', sans-serif",
        textShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        marginBottom: '8px',
    
      }

    const title = {
        fontFamily: "'SF Pro', sans-serif",
        fontSize: '2.5rem',
        marginBlockStart: '0px',
        marginBlockEnd: '0px',
        paddingTop: '1.5rem',
        paddingLeft: '3rem',
        paddingBottom: '0.5rem',
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
                            <div key={loop.id}  style={loopWrapper} onClick={() => navigate(`/loop/${loop.id}`)}>
                                {/* <div style={loopWrapper} onClick={() => navigate(`/loop/${loop.id}`)}> */}
                                <div className="loop-background" style={{'--loopColor': loop?.color }}> </div>
                                {/* <Link style={{ color: loop?.color, backgroundColor: '#ededed' }} href={`/loop/${loop.id}`}> */}
                                <p
                                    style={{
                                        ...textUnderLoop,
                                        color: loop?.color
                                    }}
                                >
                                    {loop.name}
                                </p>
                                {/* {loop.name} */}
                                {/* </Link> */}
                                {/* </div> */}
                            </div>
                            )
                        )
                        : <div>Finns inga loops</div>
                    : <div>Loading... loops</div>
                }
                <div style={loopWrapper} onClick={() => navigate('/create-loop')}>
                    <div className="loop-background" style={{'--loopColor': themeColor }}>
                        <div className="plus-icon-loop" style={{'--themeColor': 'black' }}> </div>
                    </div>
                    <p
                        style={{
                            ...textUnderLoop,
                            color: themeColor
                        }}
                    >
                        Skapa en ny loop
                    </p>
                </div>


            </div>
            </div>
            <div style={extraSpace}> </div>
            </div>



            { !phoneLayout && (
            <div style={gridStyle}>



        <div style={OuterContainerFriends}>
    
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



      </div>
              )}
        </div>

        </>

    
    );



  



};

export default NewMainPage;