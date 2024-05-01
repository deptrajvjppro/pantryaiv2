import { View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useServerUrl } from '../context/ServerUrlContext';  // Adjust the path as necessary

const Layout = () => {
    const serverUrl = useServerUrl();  // Using the server URL context

    // You can now use serverUrl in your component or pass it to children
    console.log("Server URL in Layout:", serverUrl); // For demonstration, you can remove it or use it as needed

    return (
        <View style={{ flex: 1 }}>
            <Tabs screenOptions={{
                tabBarActiveTintColor: "white",
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
                    name='Index'
                    options={{
                        tabBarLabel: 'Pantry',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={30} color={color} />
                    }}
                />
                <Tabs.Screen
                    name='MealPlanning'
                    options={{
                        tabBarLabel: 'Meal Planning',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="set-meal" size={20} color={color} />
                    }}
                />
                <Tabs.Screen
                    name='ShoppingNote'
                    options={{
                        tabBarLabel: 'Shopping Note',
                        tabBarIcon: ({ color, size }) => <Entypo name="open-book" size={20} color={color}/>
                    }}
                />
                <Tabs.Screen
                    name='Account'
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
