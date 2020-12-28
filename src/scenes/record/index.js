import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListScreen from './list';
import DetailScreen from './detail';

const RecordStack = createStackNavigator();

const RecordStackScreen = ({navigation}) => (
    <RecordStack.Navigator>
        <RecordStack.Screen name="list" component={ListScreen} options={{headerShown:false}}/>
        <RecordStack.Screen name="detail" component={DetailScreen} options={{headerShown:false}}/>
    </RecordStack.Navigator>
)

export default RecordStackScreen;