import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useWarmupBrowser } from '@/hooks/useWarmUpBrowser';

const Login = () => {
  //dont mind this
  useWarmupBrowser();
  
  return (
    <View style = {styles.container}>
      <Image source = {require('@/assets/images/logo.png')}
        style = {styles.logoStyle}/>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white',
    padding: 2,
  },
  logoStyle: {
    padding: 20,
    height: 24,
    width: 24,
  }
})
export default Login