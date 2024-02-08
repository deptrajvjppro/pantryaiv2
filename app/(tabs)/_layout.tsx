import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Tabs, router } from 'expo-router';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Entypo  } from '@expo/vector-icons';


//                                {*/  TABS_LAYOUT /*}             //
const Layout = () => {
  return (
    <View style={{ flex: 1 }}>
        
        <Tabs screenOptions={{
            
            tabBarActiveTintColor: Colors.primary,
            tabBarLabelStyle: {
                fontFamily: 'mon-sb',
            },
            
        }}>
            <Tabs.Screen 
                name = 'index' 
                options = {{
                    tabBarLabel: 'Pantry',
                    tabBarIcon: ({ color, size}) =>
                    <MaterialIcons name="home" size={size + 10} color= {color} />
                }}
            />

            <Tabs.Screen 
                name = 'noti'
                
                options = {{
                    tabBarLabel: 'Notifications',
                    tabBarIcon: ({ color, size}) =>
                    <Entypo name="bell" size={size} color= {color} />,
                    
                }}
            />

            <Tabs.Screen 
                name = 'mealplanning' 
                options = {{
                    tabBarLabel: 'Meal Planning',
                    tabBarIcon: ({ color, size}) =>
                    <MaterialIcons name="set-meal" size={size} color= {color} />
                }}
            />      
            
            
            <Tabs.Screen 
                name = 'shoppingnote' 
                options = {{
                    tabBarLabel: 'Shopping Note',
                    tabBarIcon: ({ color, size}) =>
                    <Entypo name="open-book" size={size} color= {color}/>
                }}
            />   

            
            
            <Tabs.Screen 
            name = 'account' 
            options = {{
                tabBarLabel: 'Account',
                tabBarIcon: ({ color, size}) =>
                <Ionicons name ='person' size={size} color= {color}/>
            }}
        />    
        
        </Tabs>
    </View>
  );
};

export default Layout;