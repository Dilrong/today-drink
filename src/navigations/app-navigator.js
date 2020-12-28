import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY_DARK } from '_styles/colors';

import TodayScreen from '../scenes/today';
import RecordScreen from '../scenes/record';

const Drawer = createDrawerNavigator();

const AppNavigator = () => (
    <Drawer.Navigator>
        <Drawer.Screen name="오늘" component={TodayScreen} options={{
            drawerIcon: () => <MaterialCommunityIcons name="tea" color={GRAY_DARK} size={26}/>
        }}/>
        <Drawer.Screen name="기록" component={RecordScreen} options={{
            drawerIcon: () => <MaterialCommunityIcons name="animation-outline" color={GRAY_DARK} size={26}/>
        }}/>
    </Drawer.Navigator>
)

export default AppNavigator;