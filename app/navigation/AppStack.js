import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions, Vibration, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { MAIN_HomeScreen } from '../screens/main';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BranchUserScreen } from '../screens/chooseBranch';
import VehicleDetailScreen from '../screens/VehicleDetailScreen'
import HistoryEventVehicleScreen from '../screens/HistoryEventVehicleScreen'
import BlacklistScreen from '../screens/BlacklistScreen';
import CheckinVehicleScreen from '../screens/CheckinVehicleScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import RevenueStatisticsScreen from '../screens/RevenueStatisticsScreen';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const App_ = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    return (
        <Stack.Navigator
            initialRouteName="BranchUserScreen"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BranchUserScreen" component={BranchUserScreen} />
            <Stack.Screen name="MAIN_HomeScreen" component={MAIN_HomeScreen} />
            <Stack.Screen name="VehicleDetailScreen" component={VehicleDetailScreen} />
            <Stack.Screen name="HistoryEventVehicleScreen" component={HistoryEventVehicleScreen} />
            <Stack.Screen name="BlacklistScreen" component={BlacklistScreen} />
            <Stack.Screen name="CheckinVehicleScreen" component={CheckinVehicleScreen} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
            <Stack.Screen name="RevenueStatisticsScreen" component={RevenueStatisticsScreen} />

        </Stack.Navigator>
    );
};

export default App_;
