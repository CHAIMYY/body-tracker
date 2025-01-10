import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import BodyFatScreen from './screens/BodyFatScreen';
import PhotoScreen from './screens/PhotoScreen';
import TimelapseScreen from './screens/TimelapseScreen';

type RootTabParamList = {
  Accueil: undefined;
  'Graisse corporelle': undefined;
  Photos: undefined;
  Timelapse: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Graisse corporelle') {
              iconName = focused ? 'body' : 'body-outline';
            } else if (route.name === 'Photos') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Timelapse') {
              iconName = focused ? 'film' : 'film-outline';
            } else {
              iconName = 'alert-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Graisse corporelle" component={BodyFatScreen} />
        <Tab.Screen name="Photos" component={PhotoScreen} />
        <Tab.Screen name="Timelapse" component={TimelapseScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

