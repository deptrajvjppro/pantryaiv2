import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Header from '@/components/header'

const MealPlanning = () => {
  return (
    <View>
      <Stack.Screen options ={{
          header: () => <Header/>, 
        }}
        />
      <Text>mealplanning</Text>
    </View>
  )
}

export default MealPlanning