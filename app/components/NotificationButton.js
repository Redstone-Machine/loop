// components/NotificationButton.js
import React from 'react';
import { subscribeUserToPush } from '../../public/pushNotifications';

const NotificationButton = () => {
  const askPermissionAndSubscribe = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        subscribeUserToPush();
      } else {
        console.error('Tillstånd för notiser nekades.');
      }
    }).catch(error => {
      console.error('Ett fel inträffade vid begäran om notistillstånd:', error);
    });
  };

  return (
    <button onClick={askPermissionAndSubscribe}>
      Ge tillstånd för notiser
    </button>
  );
};

export default NotificationButton;
