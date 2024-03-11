import { usePageSetup } from '../../hooks/usePageSetup';
import { FormattedMessage } from 'react-intl';
import Head from 'next/head';

import { useState } from 'react';
import { useRouter } from 'next/router';

import React from 'react';

const SettingsPage = () => {

    const { userId, userName, session, status, userLanguage, userTheme, theme, router } = usePageSetup();
    
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
                        <h1>Settings</h1>

                        <button onClick={() => router.push('/settings/profile-picture')}> <FormattedMessage id="profilePicture" /> </button>
                    </div>
                </>
            )}
        </>
    );
};

export default SettingsPage;