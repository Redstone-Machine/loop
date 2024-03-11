// pages/settings/profile-picture.js

import { usePageSetup } from '../../hooks/usePageSetup';
import Head from 'next/head';
import { FormattedMessage } from 'react-intl';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import React from 'react';
import { Form } from 'react-router-dom';


const SettingsProfilePicture = () => {

    const { userId, userName, session, status, userLanguage, userTheme, theme, router } = usePageSetup();
    const [file, setFile] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
      const fetchProfilePicture = async () => {
        const response = await fetch(`/api/getCurrentProfilePictureById?id=${userId}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setProfilePictureUrl(url);
        }
      };
  
      if (userId) {
        fetchProfilePicture();
      }
    }, [userId]);

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleUpload = async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
    
      const response = await fetch('/api/uploadProfilePicture', {
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
  
    return (
        <>
            {userTheme && (
                <>
                    <div>
                        <h1><FormattedMessage id="upploadProfilePicture" /></h1>

                        <form onSubmit={handleUpload}>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <button type="submit"><FormattedMessage id="uppload" /></button>
                        </form>
                        
                        <p><FormattedMessage id="infoAboutProfilePicture" /></p>
                        <h2><FormattedMessage id="currentProfilePicture" /></h2>
                        {profilePictureUrl && <img src={profilePictureUrl} alt="Profilbild" style={{ width: '100px', height: '100px' }} />}
                    </div>
                </>
            )}
        </>
    );
};

export default SettingsProfilePicture;