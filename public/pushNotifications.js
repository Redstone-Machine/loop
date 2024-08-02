// public/pushNotifications.js

export async function subscribeUserToPush(userId) {
    return navigator.serviceWorker.ready.then(registration => {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      console.log('VAPID Public Key:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);

  
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    }).then(subscription => {
      const subscriptionData = {
        ...subscription.toJSON(),
        userId, // Include the userId
      };
  
      return fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });
    }).then(response => {
      if (!response.ok) {
        throw new Error('Misslyckades med att spara prenumerationen på servern.');
      }
      return response.json();
    }).catch(error => {
      console.error('Kunde inte prenumerera på push:', error);
    });
  }
  
  export function urlBase64ToUint8Array(base64String) {
    console.log('Base64 String:', base64String);
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  


  