// utils/NavigationListener.jsx
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeEventEmitter, NativeModules } from "react-native";

// Create an event emitter
const navigationEmitter = new NativeEventEmitter(NativeModules.NavigationEmitter || {});

export const emitNavigationEvent = (path) => {
  navigationEmitter.emit("navigateTo", { path });
};

const NavigationListener = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = navigationEmitter.addListener("navigateTo", (event) => {
      if (event?.path) {
        navigation.navigate(event.path);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  return null;
};

export default NavigationListener;
