import AsyncStorage from '@react-native-async-storage/async-storage';

const geocodeCache = {};

export const reverseGeocode = async (lat, lng) => {
  const key = `${lat},${lng}`;

  try {
    // Try to get from cache first
    const cachedData = await AsyncStorage.getItem('geocodeCache');
    const cache = cachedData ? JSON.parse(cachedData) : {};
    
    if (cache[key]) {
      console.log(`Cache hit for ${key}`);
      return cache[key];
    }

    console.log(`Calling HERE API for ${key}`);
    const response = await fetch(
      `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=en-US&apikey=${process.env.EXPO_PUBLIC_HERE_API_KEY}`
    );
    const data = await response.json();
    const address = (data.items && data.items.length > 0) 
      ? data.items[0].address.label 
      : `${lat}, ${lng}`;

    // Update cache
    cache[key] = address;
    await AsyncStorage.setItem('geocodeCache', JSON.stringify(cache));

    return address;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `${lat}, ${lng}`;
  }
};