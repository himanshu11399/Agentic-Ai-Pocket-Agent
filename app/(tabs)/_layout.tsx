import Home from './Home';
import Explore from './Explore';
import History from './History';
import Profile from './Profile';
import color from '@/shared/color';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BrainCircuitIcon } from 'lucide-react-native';
import { HomeIcon, Globe, UserCircle, HistoryIcon } from 'lucide-react-native'

const Tab = createMaterialTopTabNavigator();


import React from 'react'
import Assistant from './Assistant';

const _layout = () => {
    return (

        <Tab.Navigator
            initialRouteName="home"
            tabBarPosition="bottom"
            screenOptions={{
                swipeEnabled: true,
                tabBarShowLabel: true,
                tabBarShowIcon: true,
                tabBarActiveTintColor: color.PRIMARY,
                tabBarInactiveTintColor: color.GREY,
                tabBarIndicatorStyle: { display: 'none' },
                tabBarStyle: {
                    position: "absolute",
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    elevation: 5, // Android shadow
                    backgroundColor: "#cfd0e5ff",
                    borderRadius: 25,
                    height: 70,
                    shadowColor: "#000000ff",
                    shadowOpacity: 0.15,
                    shadowOffset: { width: 0, height: 5 },
                    shadowRadius: 10,
                },
            }}
        >
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    tabBarShowLabel:false,
                    tabBarLabel: 'Home12',
                    tabBarIcon: ({ focused }) => (
                        <HomeIcon color={focused ? '#3692ff' : '#222121ff'} size={focused ? 28 : 26} />
                    ),
                }}
            />
            <Tab.Screen
                name="explore"
                component={Explore}
                options={{
                    tabBarShowLabel:false,
                    tabBarLabel: 'Explore',
                    tabBarIcon: ({ focused }) => (
                        <Globe color={focused ? '#3692ff' : '#222121ff'} size={focused ? 28 : 26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Assistant"
                component={Assistant}
                options={{
                    tabBarShowLabel:false,
                    tabBarLabel: 'Assistant',
                    tabBarIcon: ({ focused }) => (
                        <BrainCircuitIcon
                            color={focused ? '#3692ff' : '#222121ff'} // blue when active, dark when inactive
                            size={focused ? 40 : 35} // slightly bigger when focused
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="history"
                component={History}
                options={{
                    tabBarShowLabel:false,
                    tabBarLabel: 'History',
                    tabBarIcon: ({ focused }) => (
                        <HistoryIcon color={focused ? '#3692ff' : '#222121ff'} size={focused ? 28 : 26} />
                    ),
                }}
            />
            <Tab.Screen
                name="profile"
                component={Profile}
                options={{
                    tabBarShowLabel:false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <UserCircle color={focused ? '#3692ff' : '#222121ff'} size={focused ? 28 : 26} />
                    ),
                }}
            />
        </Tab.Navigator>

    )
}

export default _layout