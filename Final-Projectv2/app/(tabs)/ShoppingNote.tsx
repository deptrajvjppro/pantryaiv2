import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Header from '@/components/header'

const ShoppingNote = () => {
  return (
    <View style={styles.container}>
    <Stack.Screen
      options={{
        header: () => <Header />,
      }}
    />
    <View style={styles.notiView}>
      <Text style = {styles.header}> Shopping Notes </Text>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
  notiView: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    flex: 1,
   
  },
  header:{
    fontFamily: "mon-b",
    color: "#FFF",
    fontSize: 25,
    margin: 20
  }
});

export default ShoppingNote