import {  SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'

import React from 'react'
import Colors from '@/constants/Colors'


const Header = () => {
  
  return (
      <SafeAreaView style = {{backgroundColor:  Colors.background}}>
         
      
          <Image source = {require('@/assets/images/logowhite.png')}
            style = {styles.logoStyle}/>
       
      </SafeAreaView>
      
   
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
      backgroundColor: Colors.background,
      alignItems: 'center',
    },
    logoStyle: {
      height: 50,
      width: 150,
      alignSelf: 'center',
      
    },
   
  
})