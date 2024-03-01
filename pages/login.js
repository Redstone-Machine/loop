import { FormattedMessage } from 'react-intl';
import Head from 'next/head';

// import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';



const Login = () => {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const result = await signIn('credentials', {
      callbackUrl: window.location.href,
      redirect: false,
      username,
      password,
    });
  
    if (result.error) {
      alert('Failed to log in. Please check your username and password.');
    } else {
      router.push('/main-page');
    }
  };

  const signInGoogle = async (event) => {
    signIn('google', {
      // callbackUrl: window.location.href,
      callbackUrl: '/main-page',
      //callbackUrl: 'http://localhost:3000/main-page',
      redirect: false,
    })
    // router.push('/main-page');
    // .then(result => {
    //   if (result.error) {
    //     alert('Failed to log in. Please check your username and password.');
    //   } else {
    //     router.push('/main-page');
    //   }
    // })
    // .catch(err => {
    //   console.error('Failed to sign in:', err);
    // });


  };
  
  // const signInGoogle = async () => {
  //   const result = await signIn('google', {
  //     callbackUrl: window.location.href,
  //     redirect: false,
  //   });
  
  //   if (result.error) {
  //     alert('Failed to log in. Please check your Google account.');
  //   } else {
  //     router.push('/main-page');
  //   }
  // };

  const handleRegister = () => {
    router.push('/register')
  }

  // const handleSubmit = async (event) => {
  //   console.log('Handling submit...');
  //   console.log(username, password); // Log the username and password

  //   event.preventDefault();

  //   const response = await fetch('/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username, password }),
  //   });

  //   console.log('This is the server response:');
  //   console.log(response); // Log the response

  //   const data = await response.json();

  //   if (data.success) {
  //     // Handle successful login
  //     router.push('/dashboard'); // Redirect to dashboard page
  //   } else {
  //     // Handle failed login
  //     alert('Failed to log in. Please check your username and password.');
  //   }
  // };

  return (
    <div>

      {/* <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head> */}

      <h1><FormattedMessage id="logInTitle" /></h1>
      <button><FormattedMessage id="logInApple" /></button>
      <button onClick={signInGoogle}><FormattedMessage id="logInGoogle" /></button>
      

      <form onSubmit={handleSubmit}>
        <label htmlFor="username"><FormattedMessage id="username" />:</label>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <label htmlFor="password"><FormattedMessage id="password" />:</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit"><FormattedMessage id="signIn" /></button>
      </form>

      <button onClick={handleRegister}>
      <FormattedMessage id="register" />
      </button>

      {/* <Link href="/create-account">
        <button>Skapa ett konto</button>
      </Link> */}
    </div>
  );
};

export default Login;