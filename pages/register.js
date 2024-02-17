import { FormattedMessage } from 'react-intl';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import React from 'react';

const RegisterPage = () => {


    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [language, setLanguage] = useState('automatic');
    const [theme, setTheme] = useState('automatic');

    const router = useRouter();
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              firstname: firstname,
              surname: surname,
              email: email,
              password: password,
              language: language,
              theme: theme,
            }),
          })


        if (response.ok) {
            // Begäran var framgångsrik, omdirigera användaren till inloggningssidan
            router.push('/login');
        } else {
            // Något gick fel, visa ett felmeddelande
            const errorData = await response.json();
            alert('Failed to register. The username might already exist.');
            //alert(errorData.message);
        }
        };


    return (
        <div>
            <h1><FormattedMessage id="registerTitle" /></h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username"><FormattedMessage id="username" />:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label htmlFor="firstname"><FormattedMessage id="firstName" />:</label>
                <input type="text" id="firstname" name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                <br />
                <label htmlFor="username"><FormattedMessage id="surname" />:</label>
                <input type="text" id="surname" name="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                <br />
                <label htmlFor="email"><FormattedMessage id="email" />:</label> {/* Lägg till detta */}
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} /> {/* Lägg till detta */}
                <br />
                <label htmlFor="password"><FormattedMessage id="password" />:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <label htmlFor="language"><FormattedMessage id="language" />:</label>
                <select id="language" name="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="swedish">Svenska</option>
                    <option value="english">English</option>
                    <option value="automatic"><FormattedMessage id="automatic" /></option>
                </select>
                <br />
                <label htmlFor="theme"><FormattedMessage id="theme" />:</label>
                <select id="theme" name="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light"><FormattedMessage id="light" /></option>
                    <option value="dark"><FormattedMessage id="dark" /></option>
                    <option value="automatic"><FormattedMessage id="automatic" /></option>
                </select>
                <br />
                <button type="submit" disabled={!username || !firstname || !surname || !password || !email}><FormattedMessage id="registerButton" /></button>
                {/* <button type="submit">Registrera dig</button> */}
            </form>
        </div>
    );
};

export default RegisterPage;
