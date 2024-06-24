function subscribeUserToPush(registration: ServiceWorkerRegistration) {
    const vapidPublicKey = 'YOUR_PUBLIC_VAPID_KEY'; // VAPID公開鍵を設定
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    }).then(subscription => {
      console.log('User is subscribed:', subscription);
      // サーバーにサブスクリプション情報を送信
      fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }).catch(err => {
      console.log('Failed to subscribe the user: ', err);
    });
}
  
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default subscribeUserToPush;