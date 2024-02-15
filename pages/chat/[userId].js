import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import io from 'socket.io-client';



const ChatPage = () => {
    const { data: session } = useSession()
    // const { data, status } = useSession();
    // const session = data?.session;
    // const loading = status === "loading";
    const router = useRouter();
    const { userId } = router.query;

    const [userName, setUserName] = useState(null);
    const [messageText, setMessageText] = useState('');

    const [messages, setMessages] = useState([]);



    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const newSocket = io('http://localhost:3001'); // Replace with your server URL
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to the server');
      });

      // Listen for incoming messages
      newSocket.on('chat message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
  
      return () => {
        newSocket.close();
      };
    }, []);

    useEffect(() => {
        if (session) {
          console.log('User is logged in:', session)
        } else {
          console.log('User is not logged in')
          router.push('/login');
        }
      }, [session])



    useEffect(() => {
        if (userId) {
            fetch(`/api/getUserById?id=${userId}`)
                .then(response => response.json())
                .then(user => setUserName(user.userName));
        }
    }, [userId]);





    const handleSubmit = async (event) => {
      event.preventDefault();
    
      console.log('Submitting message:', messageText);
      console.log('Sender UserID:', session.token.sub);
      console.log('Reciver UserID:', userId);
    
      const message = {
        content: messageText,
        userId: session.token.sub,
        recipientId: userId,
      };
    
      // Send the message in real-time
      socket.emit('chat message', message);
    
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
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Unable to get permission to notify.');
        }
      });
    }, []);


    useEffect(() => {
      if (socket) {
        socket.on('chat message', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
    
          // Show a notification if the user has granted permission
          if (Notification.permission === 'granted') {
            new Notification('New message', { body: message.content });
          }
        });
      }
    }, [socket]);
    
    useEffect(() => {
        if (session && userId) {
          fetch(`/api/getMessages?senderId=${session.token.sub}&recipientId=${userId}`)
            .then(response => response.json())
            .then(setMessages);
        }
      }, [session, userId]);
      
      useEffect(() => {
        if (session && userId) {
          fetch(`/api/getMessages?senderId=${session.token.sub}&recipientId=${userId}`)
            .then(response => response.json())
            .then(setMessages);
        }
      }, [messageText]);





      // useEffect(() => {
      //   // Listen for incoming messages
      //   socket.on('chat message', (message) => {
      //     setMessages((prevMessages) => [...prevMessages, message]);
      //   });
      // }, []);
    





    return (
        <div>
          <h1>Chat between {session?.session?.user?.name} and {userName}</h1>

          {messages.map((message, index) => (
            <p key={index}>{message.content}</p>
        ))}

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
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
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