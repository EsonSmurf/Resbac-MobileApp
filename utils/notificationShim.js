// utils/notificationShim.js
import * as Notifications from 'expo-notifications';

/**
 * Simple shim (fallback) if notifications fail or aren't configured.
 * It just logs instead of crashing.
 */
export const NotificationShim = async (title, message) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'Notification',
        body: message || 'No message provided',
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.log('[NotificationShim Error]', error);
  }
};