import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

let echoInstance = null;

export const getEcho = async () => {
  if (!echoInstance) {
    const token = await AsyncStorage.getItem('token');

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: process.env.EXPO_PUBLIC_PUSHER_KEY || '7f815a0491262fa62aa6',
      wsHost: 'realtime-pusher.ably.io',
      wsPort: 443,
      wssPort: 443,
      forceTLS: true,
      disableStats: true,
      cluster: 'mt1',
      authEndpoint: `${config.API_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });
  }

  return echoInstance;
};
