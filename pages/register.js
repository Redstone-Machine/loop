import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import React from 'react';

const RegisterPage = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

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
              password: password,
              email: email,
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
            <h1>Registrera dig</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Användarnamn:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label htmlFor="email">E-post:</label> {/* Lägg till detta */}
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} /> {/* Lägg till detta */}
                <br />
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">Registrera dig</button>
            </form>
        </div>
    );
};

export default RegisterPage;
