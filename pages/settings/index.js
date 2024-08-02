import { usePageSetup } from '../../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';
import Head from 'next/head';

import { useState } from 'react';
import { useRouter } from 'next/router';

import React from 'react';

import { subscribeUserToPush } from '../../public/pushNotifications';


import NotificationButton from '../../app/components/NotificationButton';

const SettingsPage = () => {

    const { userId, userName, session, status, userLanguage, userTheme, theme, router } = usePageSetup();
    

    const askPermission = () => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
            console.log('Tillstånd för notiser beviljat.');
            } else {
            console.error('Tillstånd för notiser nekades.');
            }
        }).catch(error => {
            console.error('Ett fel inträffade vid begäran om notistillstånd:', error);
        });
    };

    const sendTestNotification = () => {
        fetch('/api/send-test-notification', {
        method: 'POST',
        })
        .then(response => {
        if (response.ok) {
            console.log('Testnotis skickad.');
        } else {
            console.error('Misslyckades att skicka testnotis.');
        }
        })
        .catch(error => {
        console.error('Ett fel inträffade:', error);
        });
    };

    async function handleSubscription() {
        try {
        //   await askPermission();
          await subscribeUserToPush(userId); // Pass the userId to the function
          console.log('Prenumeration framgångsrik.');
        } catch (error) {
          console.error('Error during subscription process:', error);
        }
    }


    return (
        <>
            {userTheme && (
                <>
                    {/* <Head>
                        <style>
                        {`
                            body {
                            background-color: ${theme === 'light' ? 'white' : 'black'};
                            color: ${theme === 'light' ? 'black' : 'white'};
                            }
                        `}
                        </style>
                    </Head> */}


                    <div>
                        <h1><FormattedMessage id="settingsTitle" /></h1>

                        <button onClick={async () => {
                            await router.prefetch('/settings/profile-picture');
                                router.push('/settings/profile-picture');
                            }}>
                            <FormattedMessage id="profilePicture" />
                        </button>

                        <h1>Välkommen till min PWA!</h1>
                        
                        <button onClick={askPermission}>
                            Ge tillstånd för notiser
                        </button>
                        <div>

                        {/* <NotificationButton /> */}

                        <button onClick={handleSubscription}>
                        Prenumerera på notiser
                        </button>

                        <button onClick={sendTestNotification}>
                        Skicka testnotis
                        </button>
                        </div>
                        
                        
                    </div>
                </>
            )}
        </>
    );
};

export default SettingsPage;