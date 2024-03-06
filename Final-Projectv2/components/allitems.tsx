import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'





const Allitems = () => {



  return (
    <View style = {styles.container}>
      <Text>List of all items</Text>
     
   
    </View>
  )
}



const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: Colors.background,
    width:'100%',
    margin:10
  },
  scrollView: {
    flex: 1
  },
  addButton:{
    
  }
})

export default Allitems