import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Header from '@/components/header'

const ShoppingNote = () => {
  return (
    <View>
      <Stack.Screen options ={{
          header: () => <Header/>, 
        }}
        />
      <Text>Shopping note</Text>
    </View>
  )
}

export default ShoppingNote