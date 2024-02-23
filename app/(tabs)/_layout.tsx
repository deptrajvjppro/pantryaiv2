import { View} from 'react-native'
import React from 'react'
import { Tabs} from 'expo-router';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Entypo  } from '@expo/vector-icons';


//                                {*/  TABS_LAYOUT /*}             //
const Layout = () => {
  return (
    <View style={{ flex: 1 }}>
        
        <Tabs screenOptions={{
            
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.secondary,
            tabBarLabelStyle: {
                fontFamily: 'mon-sb',
                fontSize: 9,
                paddingBottom: 5,
                
            },
            tabBarStyle: {
                backgroundColor: Colors.background
            }
           
            
        }}>
            
            <Tabs.Screen 
                name = 'index' 
                options = {{
                    tabBarLabel: 'Pantry',
                    tabBarIcon: ({ color, size}) =>
                    <MaterialIcons name="home" size={30} color= {color} />
                }}
            />
            
            <Tabs.Screen 
                name = 'Notifications'
                
                options = {{
                    tabBarLabel: 'Notifications',
                    tabBarIcon: ({ color, size}) =>
                    <Entypo name="bell" size={20} color= {color} />,
                    
                }}
            />

            <Tabs.Screen 
                name = 'MealPlanning' 
                options = {{
                    tabBarLabel: 'Meal Planning',
                    tabBarIcon: ({ color, size}) =>
                    <MaterialIcons name="set-meal" size={20} color= {color} />
                }}
            />      
            
          

            <Tabs.Screen 
                name = 'ShoppingNote' 
                options = {{
                    tabBarLabel: 'Shopping Note',
                    tabBarIcon: ({ color, size}) =>
                    <Entypo name="open-book" size={20} color= {color}/>

                }}
            />   

            
            
            <Tabs.Screen 
            name = 'Account' 
            options = {{
                tabBarLabel: 'Account',
                tabBarIcon: ({ color, size}) =>
                <Ionicons name ='person' size={20} color= {color}/>
            }}
        />    
        
        </Tabs>
    </View>
  );
};

export default Layout;