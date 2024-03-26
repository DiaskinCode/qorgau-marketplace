import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { store, persistor } from './store/index';
import Navigation from './navigation/index';
import { enableScreens } from 'react-native-screens';

enableScreens();

// Prevent the splash screen from hiding on app load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          regular: require('./assets/fonts/SF-Pro-Display-Regular.otf'),
          medium: require('./assets/fonts/SF-Pro-Display-Medium.otf'),
          semibold: require('./assets/fonts/SF-Pro-Display-Semibold.otf'),
          bold: require('./assets/fonts/SF-Pro-Display-Bold.otf'),
          'bold-italic': require('./assets/fonts/SF-Pro-Display-BoldItalic.otf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
        setFontsLoaded(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator />; // or a placeholder/loading view until fonts are loaded
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation/>
      </PersistGate>
    </Provider>
  );
}
