import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const index = () => {
  return (
    <View>
      
      <Link href = {"/(modals)/login"}>Login</Link>

      <Link href = {"/listing/1111"}>Listing</Link>
      
    </View>
  )
}

export default index