/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Image, StatusBar, StyleSheet, Dimensions, Text, Vibration, Alert, AppState } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Host, Portal } from 'react-native-portalize';
import AppStack from './AppStack';
import AuthStack from './AuthStack'
import analytics from '@react-native-firebase/analytics';
import VersionCheck from 'react-native-version-check';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();

const RootContainerScreen = () => {
  const accessToken = useSelector(state => state.accessToken);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="AppStack" component={AppStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootContainerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
