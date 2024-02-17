import { usePageSetup } from '../../hooks/usePageSetup';
import Head from 'next/head';

import { useState } from 'react';
import { useRouter } from 'next/router';

import React from 'react';

const SettingsPage = () => {

    const { userId, userName, session, status, userLanguage, userTheme, theme, users, error, router } = usePageSetup();
    
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
                    </div>
                </>
            )}
        </>
    );
};

export default SettingsPage;