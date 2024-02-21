import {  SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'

import React from 'react'


const Header = () => {
  
  return (
      <SafeAreaView style = {{flex: 1, backgroundColor: "#FFFF"}}>
         
        <View style ={styles.container}>
          <Image source = {require('@/assets/images/logo.png')}
            style = {styles.logoStyle}/>
        </View>
      </SafeAreaView>
      
   
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
      backgroundColor: "#FFFF",
      height: 50,
      alignItems: 'center',
    },
    logoStyle: {
      top: -50,
      position: 'absolute',
      height: 150,
      width: 150,
    
    },
   
  
})