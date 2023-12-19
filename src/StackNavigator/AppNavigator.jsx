import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import HomeWeather from '../components/HomeWeather';

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="HomeWeather" component={HomeWeather}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
