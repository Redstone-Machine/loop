// pages/create-loop.js

import { usePageSetup } from '../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';

import React from 'react';
import useSWR from 'swr'
import { useState } from 'react';

async function fetcher(url) {
    const res = await fetch(url)
    return res.json()
}

const CreateLoop = () => {
const { userId, userName, session, status, userLanguage, userTheme, theme, router } = usePageSetup();
const { data: users, error } = useSWR('/api/getUsers', fetcher)

const [name, setName] = useState('');
const [color, setColor] = useState('#ff0000');
const [selectedFriends, setSelectedFriends] = useState([]);

const { data: Friends, error: FriendError } = useSWR(`/api/getFriendsById?userId=${userId}`, fetcher)

const handleFriendChange = (event) => {
    const friendId = event.target.value;
    if (event.target.checked) {
    setSelectedFriends([...selectedFriends, friendId]);
    } else {
    setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('name:', name);
    console.log('color:', color);
    console.log('selectedFriends:', selectedFriends);
    
    const response = await fetch('/api/createLoop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color, friends: selectedFriends, ownerId: userId }),
    });

    if (response.ok) {
        const loop = await response.json();
        // Redirect to the new loop page using the id of the created loop
        router.push(`/loop/${loop.id}`);
    } else {
        // handle error
        console.error('Failed to create loop');
    }
};

return (
    <>
    <h1><FormattedMessage id="loopTitle" /></h1>
    <form onSubmit={handleSubmit}>
        <label>
        <FormattedMessage id="name" />:

        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <br />
        <br />
        <label>
        <FormattedMessage id="color" />:
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} required />
        </label>
        <br />
        <p><FormattedMessage id="friends" />:</p>
        {Friends && users && userId
        
            ? users
            .filter(user => Friends.includes(user.id) && user.id !== userId)
            .map(user => (
            <label key={user.id}>
                <input type="checkbox" value={user.id} onChange={handleFriendChange} />
                {user.userName}
                <br />

            </label>
            ))
            : <div>Loading... friends</div>
        }
        <br />
        <button type="submit"><FormattedMessage id="createLoop" /></button>
    </form>
    </>
);
};

export default CreateLoop;