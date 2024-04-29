import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from 'expo-router';
import { Stack } from "expo-router";
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
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      {/* Your account details UI here */}
      <Text style={styles.text}>Account Page</Text>

      {/* Logout Button */}
      <TouchableOpacity  onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>

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
  logoutButton: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    left : 50,
    right: 50,
  },
  logoutButtonText: {
    fontSize: 16,
    color: 'white',

  },
});

export default Account;