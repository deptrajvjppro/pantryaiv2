import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useTab } from '../context/TabContext';
import Colors from '@/constants/Colors';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

const Layout = () => {
    const { setActiveTab } = useTab(); // This will get the setActiveTab method from the context

    return (
        <View style={{ flex: 1 }}>
            <Tabs screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.lessgrey,
                tabBarLabelStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 9,
                    paddingBottom: 5,
                },
                tabBarStyle: {
                    backgroundColor: Colors.background
                },
            }}>
                <Tabs.Screen
                    name='index'
                    listeners={{
                        tabPress: () => setActiveTab('index'),
                    }}
                    options={{
                        tabBarLabel: 'Pantry',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={30} color={color} />
                    }}
                />
                <Tabs.Screen
                    name='MealPlanning'
                    listeners={{
                        tabPress: () => setActiveTab('MealPlanning'),
                    }}
                    options={{
                        tabBarLabel: 'Meal Planning',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="set-meal" size={20} color={color} />
                    }}
                />
                <Tabs.Screen
                    name='ShoppingNote'
                    listeners={{
                        tabPress: () => setActiveTab('ShoppingNote'),
                    }}
                    options={{
                        tabBarLabel: 'Shopping Note',
                        tabBarIcon: ({ color, size }) => <Entypo name="open-book" size={20} color={color}/>
                    }}
                />
                <Tabs.Screen
                    name='Account'
                    listeners={{
                        tabPress: () => setActiveTab('Account'),
                    }}
                    options={{
                        tabBarLabel: 'Account',
                        tabBarIcon: ({ color, size }) => <Ionicons name='person' size={20} color={color}/>
                    }}
                />
            </Tabs>
        </View>
    );
};

export default Layout;
