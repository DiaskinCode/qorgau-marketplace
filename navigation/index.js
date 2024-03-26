
import React, { Component } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigation from './BottomTabNavigation'
import { useSelector } from 'react-redux';
import AuthStackNavigator from './AuthStackNavigation';



export default function Navigation() {

    const theme = {...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#FFFFFF',
        },
      };
    
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <NavigationContainer theme={theme}>
            {isAuthenticated ? (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen component={BottomTabNavigation} name='root'/>
              </Stack.Navigator>
            ) : (
              <AuthStackNavigator />
            )}
        </NavigationContainer>
    );
  }

  const Stack = createNativeStackNavigator()
