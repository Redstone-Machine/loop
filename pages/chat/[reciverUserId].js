import { usePageSetup } from '../../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import io from 'socket.io-client';

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

    console.log('reciverUserId:', reciverUserId);
    
    const [reciverUserName, setReciverUserName] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);


    const [socket, setSocket] = useState(null);

    // useEffect(() => {
    //   const newSocket = io('http://localhost:3001'); // Replace with your server URL
    //   setSocket(newSocket);

    //   newSocket.on('connect', () => {
    //     console.log('Connected to the server');
    //   });

    //   // Listen for incoming messages
    //   newSocket.on('chat message', (message) => {
    //     setMessages((prevMessages) => [...prevMessages, message]);
    //   });
  
    //   return () => {
    //     newSocket.close();
    //   };
    // }, []);
    
    useEffect(() => {
      console.log('process.env.SERVER_URL', process.env.NEXT_PUBLIC_EXTRA_URL);
      const newSocket = io(process.env.NEXT_PUBLIC_EXTRA_URL); // Replace with your server URL
      setSocket(newSocket);
    
      newSocket.on('connect', () => {
        console.log('Connected to the server');
      });
    
      // Define the message handler
      const messageHandler = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    
        // Show a notification if the user has granted permission
        if (Notification.permission === 'granted') {
          new Notification('New message', { body: message.content });
        }
      };
    
      // // Add the message handler
      // newSocket.on('chat message', messageHandler);
      newSocket.on('chat message', message => {
        console.log('Received message:', message);
        if (message.userId === reciverUserId) {
          setReceivedMessages(prevMessages => [...prevMessages, message]);
          setMessages(prevMessages => [...prevMessages, message]); // Add this line
        }
      });
    
      return () => {
        // Remove the message handler when the component unmounts
        newSocket.off('chat message', messageHandler);
        newSocket.close();
      };
    }, []);

    // useEffect(() => {
    //     if (session) {
    //       console.log('User is logged in:', session)
    //     } else {
    //       console.log('User is not logged in')
    //       router.push('/login');
    //     }
    //   }, [session])



    useEffect(() => {
        if (reciverUserId) {
            fetch(`/api/getUserById?id=${reciverUserId}`)
                .then(response => response.json())
                .then(user => setReciverUserName(user.userName));
        }
    }, [reciverUserId]);





    const handleSubmit = async (event) => {
      event.preventDefault();
    
      console.log('Submitting message:', messageText);
      console.log('Sender UserID:', userId);
      console.log('Reciver UserID:', reciverUserId);
    
      const message = {
        content: messageText,
        userId: userId,
        recipientId: reciverUserId,
      };
    
      // // Send the message in real-time
      // socket.emit('chat message', message);
      socket.emit('chat message', message);
      setSentMessages(prevMessages => [...prevMessages, message]);
    
      const response = await fetch('/api/createMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        // handle error
      } else {
        // clear the message input
        setMessageText('');
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



      // useEffect(() => {
      //   // Listen for incoming messages
      //   socket.on('chat message', (message) => {
      //     setMessages((prevMessages) => [...prevMessages, message]);
      //   });
      // }, []);
    





    return (
        <div>
          <h1><FormattedMessage id="chatTitlePart1" /> {userName} <FormattedMessage id="chatTitlePart2" /> {reciverUserName}</h1>

          {/* {messages.map((message, index) => (
            <p key={index}>{message.content}</p>
        ))} */}

{/* {sentMessages.map((message, index) => (
  <p key={index} style={{textAlign: 'right'}}>
    {message.content}
  </p>
))}

{receivedMessages.map((message, index) => (
  <p key={index} style={{textAlign: 'left'}}>
    {message.content}
  </p>
))} */}

{messages.map((message, index) => {
  const messageClass = message.senderId === userId ? 'sent' : 'received';

  return (
    <p key={index} className={messageClass}>{message.content}</p>
  );
})}
      <style jsx>{`
        .sent {
          text-align: right;
          background-color: #dcf8c6;
          margin-left: 40%;
          margin-right: 20%;
          border-radius: 5px;
          padding: 10px;
          color: black;
        }

        .received {
          text-align: left;
          background-color: #ffffff;
          margin-right: 40%;
          margin-left: 20%;
          border-radius: 5px;
          padding: 10px;
          color: black;
        }

        @media (max-width: 600px) {
          .sent {
            margin-right: 0%;
          }
      
          .received {
            margin-left: 0%;
          }
        }
      `}</style>


{/* {messages.map((message, index) => {
  const messageClass = message.userId === session.token.sub ? 'sent' : 'received';

  return (
    <p key={index} className={messageClass}>{message.content}</p>
  );
})} */}


         
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={intl.formatMessage({ id: 'writeMessage' })}
            />
            <button type="submit"><FormattedMessage id="send" /></button>
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