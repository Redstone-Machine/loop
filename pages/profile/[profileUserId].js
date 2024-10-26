import { usePageSetup } from '../../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';
import Head from 'next/head';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import React from 'react';
// import { profile } from 'console';

const SettingsPage = () => {

    const { userId, userName, session, status, userLanguage, userTheme, theme, router } = usePageSetup();
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [profileUserName, setProfileUserName] = useState(null);
    const [profileFirstName, setProfileFirstName] = useState(null);
    const [profileSurName, setProfileSurName] = useState(null);
    const [profileEmail, setProfileEmail] = useState(null);

    const [file, setFile] = useState(null);

    const { profileUserId } = router.query;

    useEffect(() => {
      const fetchProfilePicture = async () => {
        const response = await fetch(`/api/getProfilePictureById?id=${profileUserId}&userId=${userId}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setProfilePictureUrl(url);
        }
      };
      
      if (profileUserId) {
        fetchProfilePicture();
      }
    }, [profileUserId, userId]);
    
    useEffect(() => {
        if (profileUserId) {
            fetch(`/api/getUserById?id=${profileUserId}`)
                .then(response => response.json())
                .then(user => {
                  setProfileUserName(user.userName);
                  setProfileFirstName(user.firstName);
                  setProfileSurName(user.surName);
                  setProfileEmail(user.email);
              });
        }
    }, [profileUserId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('profileUserId', profileUserId);
        
        const response = await fetch('/api/uploadProfilePictureOfAnotherUser', {
            method: 'POST',
            body: formData,
        });
        
        if (response.ok) {
            console.log('File uploaded successfully');
            router.reload();
        } else {
            const errorData = await response.json();
            window.alert(`File upload failed: ${errorData.error}`);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    

    return (
        <>
            {userTheme && (
                <>
                    <div>
                        {/* <h1><FormattedMessage id="settingsTitle" /></h1>
                        <button onClick={() => router.push('/settings/profile-picture')}> <FormattedMessage id="profilePicture" /> </button> */}

                        <h1>{profileUserName}</h1>

                        <p>Namn: {profileFirstName} {profileSurName}</p>
                        {/* <p>Mail: {profileEmail}</p> */}

                        {profilePictureUrl && <img src={profilePictureUrl} alt="Profilbild" style={{ width: '200px', height: '200px' }} />}
                        
                        <br />
                        <br />
                        
                        <button onClick={async () => {
                            await router.prefetch(`/chat/${profileUserId}`);
                                router.push(`/chat/${profileUserId}`);
                            }}>
                            Chatta med {profileUserName}
                        </button>

                        <form onSubmit={handleUpload}>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <button type="submit"><FormattedMessage id="uppload" /></button>
                        </form>

                    </div>
                </>
            )}
        </>
    );
};

export default SettingsPage;