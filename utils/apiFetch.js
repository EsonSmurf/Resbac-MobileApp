
import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiFetch = async (url, options = {}) => {
  const token = await AsyncStorage.getItem('token'); // use AsyncStorage in RN
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // ✅ force JSON
        'Authorization': token ? `Bearer ${token}` : '',
        ...(options.headers || {}),
      },
    });

    const text = await response.text(); // 👈 get raw response
    console.log('RAW API RESPONSE:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error('Response was not JSON: ' + text);
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (err) {
    console.error('API Fetch Error:', err);
    throw err;
  }
};
