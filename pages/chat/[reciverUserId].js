import { usePageSetup } from '../../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import io from 'socket.io-client';
import { borderRadius, height, margin, padding, positions, width } from '@mui/system';
import { backdropClasses } from '@mui/material';


import { format, isThisWeek, isToday, isYesterday, subDays } from 'date-fns';
import { sv } from 'date-fns/locale';

require('dotenv').config();

const ChatPage = () => {

    const { userId, userName, session, status, userLanguage, userTheme, theme } = usePageSetup();

    const intl = useIntl();

    // const { data: session } = useSession()
    // const { data, status } = useSession();
    // const session = data?.session;
    // const loading = status === "loading";
    const router = useRouter();

    const { reciverUserId } = router.query;


    const messagesEndRef = useRef(null);

    console.log('reciverUserId:', reciverUserId);
    
    const [reciverUserName, setReciverUserName] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);

    const [phoneLayout, setPhoneLayout] = useState(false);

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const [socket, setSocket] = useState(null);

    const [messageInput, setMessageInput] = useState(''); // Omdöpt från inputMessage



    useEffect(() => {
      // Kontrollera skärmdimensionerna vid första renderingen
      checkScreenDimensions();
  
      // Lägg till en resize-händelselyssnare
      window.addEventListener('resize', checkScreenDimensions);
  
      // Rensa händelselyssnaren när komponenten avmonteras
      return () => {
        window.removeEventListener('resize', checkScreenDimensions);
      };
    }, []);

    const checkScreenDimensions = () => {
      //   isMobile = window.innerWidth <= 600;
        if (window.innerWidth <= 700) {
          setPhoneLayout(true);
        } else {
          setPhoneLayout(false);
        }
      };
  
    useEffect(() => {
      const handleFocus = () => setIsKeyboardVisible(true);
      const handleBlur = () => setIsKeyboardVisible(false);
    
      window.addEventListener('focusin', handleFocus);
      window.addEventListener('focusout', handleBlur);
    
      return () => {
        window.removeEventListener('focusin', handleFocus);
        window.removeEventListener('focusout', handleBlur);
      };
    }, []);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);



    

    
  
    
    // useEffect(() => {
    //   console.log('process.env.SERVER_URL', process.env.NEXT_PUBLIC_EXTRA_URL);
    //   const newSocket = io(process.env.NEXT_PUBLIC_EXTRA_URL); // Replace with your server URL
    //   setSocket(newSocket);
    
    //   newSocket.on('connect', () => {
    //     console.log('Connected to the server');
    //   });
    
    //   // Define the message handler
    //   const messageHandler = (message) => {
    //     setMessages((prevMessages) => [...prevMessages, message]);
    
    //     // Show a notification if the user has granted permission
    //     if (Notification.permission === 'granted') {
    //       new Notification('New message', { body: message.content });
    //     }
    //   };
    
    //   // // Add the message handler
    //   // newSocket.on('chat message', messageHandler);
    //   newSocket.on('chat message', message => {
    //     console.log('Received message:', message);
    //     if (message.userId === reciverUserId) {
    //       setReceivedMessages(prevMessages => [...prevMessages, message]);
    //       setMessages(prevMessages => [...prevMessages, message]); // Add this line
    //     }
    //   });
    
    //   return () => {
    //     // Remove the message handler when the component unmounts
    //     newSocket.off('chat message', messageHandler);
    //     newSocket.close();
    //   };
    // }, []);




    // useEffect(() => {
    //   console.log('process.env.SERVER_URL', process.env.NEXT_PUBLIC_EXTRA_URL);
    //   const newSocket = io(process.env.NEXT_PUBLIC_EXTRA_URL); // Replace with your server URL
    //   setSocket(newSocket);
  
    //   newSocket.on('connect', () => {
    //     console.log('Connected to the server');
    //   });
  
    //   // Define the message handler
    //   const messageHandler = (message) => {
    //     console.log('Received message:', message);
    //     if (message.userId === reciverUserId) {
    //       setMessages((prevMessages) => [...prevMessages, message]);
    //     }
  
    //     // Show a notification if the user has granted permission
    //     if (Notification.permission === 'granted') {
    //       new Notification('New message', { body: message.content });
    //     }
    //   };
  
    //   // Add the message handler
    //   newSocket.on('chat message', messageHandler);
  
    //   return () => {
    //     // Remove the message handler when the component unmounts
    //     newSocket.off('chat message', messageHandler);
    //     newSocket.close();
    //   };
    // }, [reciverUserId]);

    useEffect(() => {
      if (!userId) return;

      // // Be om tillstånd för notifikationer om det inte redan har beviljats
      // if (Notification.permission !== 'granted') {
      //   console.log('Requesting notification permission...');
      //   Notification.requestPermission().then(permission => {
      //     if (permission === 'granted') {
      //       console.log('Notification permission granted.');
      //     } else {
      //       console.log('Notification permission denied.');
      //     }
      //   }).catch(error => {
      //     console.error('Error requesting notification permission:', error);
      //   });
      // } else {
      //   console.log('Notification permission already granted.');
      // }

      // Anslut till WebSocket-servern
      const newSocket = io(process.env.NEXT_PUBLIC_EXTRA_URL); // Ersätt med din server-URL
      setSocket(newSocket);

      // När anslutningen är etablerad, skicka register-händelsen med userId
      newSocket.on('connect', () => {
        console.log(`Connected with socket id: ${newSocket.id}`);
        
        // Skicka register-händelsen med userId
        newSocket.emit('register', userId);
      });
  
      // Hantera inkommande meddelanden
      newSocket.on('chat message', (message) => {
        console.log('Received message:', message);


        if (message.userId === reciverUserId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
  
        // Visa en notifikation om användaren har gett tillstånd
        if (Notification.permission === 'granted') {
          new Notification('New message', { body: message.content });
        }
      });
  
      // Stäng anslutningen när komponenten avmonteras
      return () => {
        newSocket.close();
      };
    }, [userId, reciverUserId]);
  


    
    useEffect(() => {
      if (reciverUserId) {
        fetch(`/api/getUserById?id=${reciverUserId}`)
          .then(response => response.json())
          .then(user => setReciverUserName(user.userName));
      }
    }, [reciverUserId]);





    // const handleSubmit = async (event) => {
    //   event.preventDefault();
    
    //   console.log('Submitting message:', messageText);
    //   console.log('Sender UserID:', userId);
    //   console.log('Reciver UserID:', reciverUserId);
    
    //   const message = {
    //     content: messageText,
    //     userId: userId,
    //     recipientId: reciverUserId,
    //   };
    
    //   // // Send the message in real-time
    //   // socket.emit('chat message', message);
    //   socket.emit('chat message', message);
    //   setSentMessages(prevMessages => [...prevMessages, message]);
    
    //   const response = await fetch('/api/createMessage', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(message),
    //   });
    
    //   const data = await response.json();
    
    //   if (!response.ok) {
    //     // handle error
    //   } else {
    //     // clear the message input
    //     setMessageText('');
    //   }
    // };

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      console.log('Submitting message:', messageText);
      console.log('Sender UserID:', userId);
      console.log('Reciver UserID:', reciverUserId);
    
      const message = {
        content: messageText,
        userId: userId,
        recipientId: reciverUserId,
        createdAt: new Date().toISOString(), // Lägg till tidsstämpel
      };
    
      // Kontrollera om socket är ansluten
      if (socket && socket.connected) {
        console.log('Socket is connected, emitting message');
        // Skicka meddelandet i realtid via WebSocket
        socket.emit('chat message', message);
        setSentMessages(prevMessages => [...prevMessages, message]);
      } else {
        console.error('Socket is not connected');
      }
    
      try {
        const response = await fetch('/api/createMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          console.error('Failed to send message:', data);
          // Hantera fel
        } else {

        // Skicka push-notis till mottagaren
        try {
          const notificationResponse = await fetch('/api/send-message-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: reciverUserId,  // Mottagarens userId
              message: messageText,   // Meddelandets innehåll
              title: 'New Message'    // Titeln på notisen
            }),
          });
  
          const notificationData = await notificationResponse.json();
  
          if (!notificationResponse.ok) {
            console.error('Failed to send notification:', notificationData);
            // Hantera fel
          } else {
            console.log('Notification sent successfully.');
          }
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError);
          // Hantera fel

        }

          // Rensa meddelandeinputen
          setMessageText('');
      }

      } catch (error) {
        console.error('Error sending message:', error);
        // Hantera fel
      }
    };



    // const handleSubmit = async (event) => {

    //     event.preventDefault();

    //     console.log('Submitting message:', messageText);
    //     console.log('Sender UserID:', session.token.sub);
    //     console.log('Reciver UserID:', userId);
    
    //     const response = await fetch('/api/createMessage', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         content: messageText,
    //         userId: session.token.sub,
    //         recipientId: userId,
    //       }),
    //     });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     // handle error
    //   } else {
    //     // clear the message input
    //     setMessageText('');
    //   }
    // };

    // if (loading || !session || !userName) return <div>Loading...</div>;

    const inputRef = useRef(null);
    let originalScrollPosition = 0;





    const inputMessage = {
        border: '2px solid #AAAAAA', 
        width: '65%',
        height: '3rem',
        borderRadius: '17px',

        fontSize: '16px',
        fontFamily: "'SF Pro', sans-serif",

        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '15px',
        paddingRight: '15px',
        marginLeft: '4px',
    }

    const inputMessageButton = {
      height: 'calc(3rem + 13px)',
      // height: '100%',
      width: '8rem',
      backgroundColor: '#595ff2',

      borderRadius: '17px',
      border: '2px solid #AAAAAA', 

      color: theme === 'light' ? 'black' : 'white',

      fontSize: '18px',
      fontFamily: "'SF Pro', sans-serif",
      marginTop: '0px',
      marginBottom: '0px',
      marginLeft: '4px',
      marginRight: '4px',
        
    }

    console.log ('themeaggjag:', theme)

    const inputMessageForm = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: '10px',
        position: 'fixed',
        // bottom: '0',
        bottom: isKeyboardVisible ? '0' : (phoneLayout ? 'calc(0.5rem + 125px)' : '0'),
        paddingBottom: '35px',
        paddingTop: '10px',
        // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Lägg till en semi-transparent bakgrundsfärg
        // color: theme === 'light' ? 'black' : 'white',
        backgroundColor: theme === 'light' ?  'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)', // Lägg till blur-effekten
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 999,
        left: '0px',


        // position: 'fixed',
    }


    const isDayBeforeYesterday = (date) => {
      const dayBeforeYesterday = subDays(new Date(), 2);
      return date.getFullYear() === dayBeforeYesterday.getFullYear() &&
            date.getMonth() === dayBeforeYesterday.getMonth() &&
            date.getDate() === dayBeforeYesterday.getDate();
    };





    useEffect(() => {
      if (typeof Notification !== 'undefined') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          } else {
            console.log('Unable to get permission to notify.');
          }
        });
      } else {
        console.log('Web Notifications not available');
      }
    }, []);


    // useEffect(() => {
    //   if (socket) {
    //     socket.on('chat message', (message) => {
    //       setMessages((prevMessages) => [...prevMessages, message]);
    
    //       // Show a notification if the user has granted permission
    //       if (Notification.permission === 'granted') {
    //         new Notification('New message', { body: message.content });
    //       }
    //     });
    //   }
    // }, [socket]);
    
    // useEffect(() => {
    //     if (userId && reciverUserId) {
    //       fetch(`/api/getMessages?senderId=${userId}&recipientId=${reciverUserId}`)
    //         .then(response => response.json())
    //         .then(setMessages);
    //     }
    //   }, [userId, reciverUserId]);
      
    //   useEffect(() => {
    //     if (userId && reciverUserId) {
    //       fetch(`/api/getMessages?senderId=${userId}&recipientId=${reciverUserId}`)
    //         .then(response => response.json())
    //         .then(setMessages);
    //     }
    //   }, [messageText]);
    useEffect(() => {
      if (userId && reciverUserId) {
        fetch(`/api/getMessages?senderId=${userId}&recipientId=${reciverUserId}`)
          .then(response => response.json())
          .then(messages => {
            const sent = messages.filter(message => message.senderId === userId);
            const received = messages.filter(message => message.recipientId === userId);
            const combined = [...sent, ...received];
            combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setSentMessages(sent);
            setReceivedMessages(received);
            setMessages(combined);
          });
      }
    }, [userId, reciverUserId, messageText]);

    console.log('messages:', messages);


    
    



      // useEffect(() => {
      //   // Listen for incoming messages
      //   socket.on('chat message', (message) => {
      //     setMessages((prevMessages) => [...prevMessages, message]);
      //   });
      // }, []);
    
      





    return (

          // <div>
          //   {messages.map((message, index) => {
          //     const messageClass = message.senderId === userId ? 'sent' : 'received';

          //     return (
          //       <div key={index} className="message-wrapper">
          //         <p className={messageClass}>{message.content}</p>
          //       </div>
          //     );
          //   })}
          // <div ref={messagesEndRef} />

          <div>
          {messages.map((message, index) => {
            const messageClass = message.senderId === userId ? 'sent' : 'received';
            const currentTimestamp = new Date(message.createdAt);
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const previousTimestamp = previousMessage ? new Date(previousMessage.createdAt) : null;
            const showTimestamp = index === 0 || !previousMessage || (currentTimestamp - previousTimestamp > 3600000) || (previousMessage.senderId !== message.senderId && (currentTimestamp - previousTimestamp > 3600000));
            const sameSenderWithinHour = previousMessage && previousMessage.senderId === message.senderId && (currentTimestamp - previousTimestamp <= 3600000);
            
            let formattedTimestamp;
            if (isToday(currentTimestamp)) {
              formattedTimestamp = `idag ${format(currentTimestamp, 'HH:mm', { locale: sv })}`;
            } else if (isYesterday(currentTimestamp)) {
              formattedTimestamp = `igår ${format(currentTimestamp, 'HH:mm', { locale: sv })}`;
            } else if (isDayBeforeYesterday(currentTimestamp)) {
              formattedTimestamp = `iförrgår ${format(currentTimestamp, 'HH:mm', { locale: sv })}`;
            } else if (isThisWeek(currentTimestamp, { locale: sv })) {
              formattedTimestamp = format(currentTimestamp, 'EEEE HH:mm', { locale: sv }); // Ex: "Måndag 16:00"
            } else {
              formattedTimestamp = format(currentTimestamp, 'EEE d MMM HH:mm', { locale: sv }); // Ex: "mån 10 juli 16:30"
            }
            
            return (
              <React.Fragment key={index}>
                {showTimestamp && (
                  <div className="timestamp-wrapper">
                    <div className="timestamp">
                      {formattedTimestamp}
                    </div>
                  </div>
                )}
                <div className={`message-wrapper ${sameSenderWithinHour ? 'same-sender' : ''}`}>
                  <p className={messageClass}>{message.content}</p>
                </div>
              </React.Fragment>
            );
          })}

          <div ref={messagesEndRef} />



      <style jsx>{`
        .message-wrapper {
          display: flex;
          // margin-bottom: 10px; // Avstånd mellan meddelanden
        }

        .message-wrapper.same-sender .sent,
        .message-wrapper.same-sender .received {
          margin-top: 2px;
          // margin-bottom: 2px;
        }

        .sent {
          justify-content: flex-end;
          text-align: left;
          // background-color: #dcf8c6;
          // background-color: #60ed3f;
          background-color: #3ae364;
          display: inline-block;
          border-radius: 15px;
          padding: 0.8rem;
          color: #ffffff;
          margin-bottom: 2px;
          margin-top: 16px;
          font-size: 1.3rem;
          font-family: 'SF Pro', sans-serif;
          align-self: flex-end; // Håller elementet till höger
          margin-left: auto; // Flyttar elementet till höger
          margin-right: 5px;
          max-width: calc(100% - 20%);
          
        }

        .received {
          justify-content: flex-start;
          text-align: left;
          // background-color: #e9e9e9;
          background-color: ${theme === 'light' ? '#e9e9e9' : '#262629'};
          display: inline-block;
          border-radius: 15px;
          padding: 0.8rem;
          // color: black;
          color: ${theme === 'light' ? 'black' : '#ffffff'};
          margin-bottom: 2px;
          margin-top: 16px;
          font-size: 1.3rem;
          font-family: 'SF Pro', sans-serif;
          align-self: flex-start; // Håller elementet till vänster
          margin-right: auto; // Flyttar elementet till vänster
          margin-left: 5px;
          max-width: calc(100% - 20%);
        }

        .timestamp {
          font-size: 0.7rem;
          color: gray;
          text-align: center;
          margin-bottom: 5px;
          margin-top: 5px;
          // margin-left: auto;
          // margin-right: auto;
          font-family: 'SF Pro', sans-serif;
          width: 100%; /* Gör att timestampen tar upp hela bredden */
          display: block; /* Säkerställer att timestampen visas på en egen rad */
        }

        @media (min-width: 1000px) {
          .sent {
            margin-right: 10%;
            max-width: calc(100% - 40%);
          }
        
          .received {
            margin-left: 10%;
            max-width: calc(100% - 40%);
          }
        }

        @media (max-width: 600px) {
        .sent {
          // margin-right: 0%;
        }
      
          .received {
            // margin-left: 0%;
          }
        }

      `}</style>


{/* {messages.map((message, index) => {
  const messageClass = message.userId === session.token.sub ? 'sent' : 'received';

  return (
    <p key={index} className={messageClass}>{message.content}</p>
  );
})} */}


         
          <form onSubmit={handleSubmit} style={inputMessageForm}>
            <input
              style={inputMessage}
              ref={inputRef}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              // placeholder={intl.formatMessage({ id: 'writeMessage' })}
            />
            <button
              type="submit"
              style={inputMessageButton}
              onClick={handleSubmit}
            >
              <FormattedMessage id="send" />
            </button>
          </form>
      {/* <style jsx>{`
      .sent {
        text-align: right;
        background-color: #dcf8c6;
        margin-left: 20%;
        border-radius: 5px;
        padding: 10px;
      }

      .received {
        text-align: left;
        background-color: #ffffff;
        margin-right: 20%;
        border-radius: 5px;
        padding: 10px;
      }
    `}</style> */}
        </div>
      
  );
};

export default ChatPage;