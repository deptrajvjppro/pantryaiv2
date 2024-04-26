import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from 'expo-router';
import Header from "@/components/header";

const Account = () => {
  const rotuer = useRouter();

  const handleLogout = () => {
    // Perform any necessary logout operations like clearing token or user data
    // For example, if using AsyncStorage: await AsyncStorage.removeItem('userToken');

    // Navigate to the login screen
    rotuer.navigate('Login'); // Make sure 'Login' matches the route name of your login screen
  };

  return (
    <View style={styles.container}>
      <Header />
      {/* Your account details UI here */}
      <Text style={styles.text}>Account Page</Text>

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} color="#841584" />

      {/* Your other account UI elements */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
  text: {
    alignSelf: "center",
    fontFamily: "mon-sb",
    margin: 20,
    fontSize: 20,
    color: "#333", // Updated for visibility against the background
  },
  // Add other styles if necessary
});

export default Account;