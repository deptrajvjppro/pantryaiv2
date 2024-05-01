import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { defaultStyle } from "@/constants/Styles";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { useServerUrl } from "../context/ServerUrlContext"; // Make sure the path is correct

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();
  const serverUrl = useServerUrl(); // Using the server URL from the context

  const handleLogin = async () => {
    try {
      await login(email, password);
      if (user) {
        router.navigate('/(tabs)/Index');
      }
    } catch (error) {
      Alert.alert("Login Error", error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(serverUrl + "/backend/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Signup successful, new user ID:", result.id);
        await login(email, password);
      } else {
        Alert.alert("Signup failed", result.error || "Could not create user");
      }
    } catch (error) {
      Alert.alert("Signup Error", error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
      <View style={styles.container}>
        <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logoStyle}
        />

        <Text style={styles.inputLabel}>Enter Email Address</Text>
        <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="black"
            style={[styles.inputBox, { marginTop: 20 }]}
        />

        <Text style={styles.inputLabel}>Enter Password</Text>
        <TextInput
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            placeholderTextColor="black"
            secureTextEntry
            style={[styles.inputBox, { marginTop: 20 }]}
        />

        <TouchableOpacity style={defaultStyle.loginButton} onPress={handleLogin}>
          <Text style={styles.textBox}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={defaultStyle.loginButton} onPress={handleSignup}>
          <Text style={styles.textBox}>Sign up</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: 'column',
  },
  inputBox: {
    borderWidth: 0.7,
    height: 35,
    width: 350,
    alignSelf: "center",
    borderRadius: 5,
    borderColor: "black",
    padding: 10
  },
  inputLabel: {
    left: 30,
    fontSize: 15,
    fontFamily: "mon-b"
  },
  logoStyle: {
    alignSelf: "center",
    justifyContent: "center",
    width: 350,
    height: 100,
    marginTop: 50
  },
  textBox: {
    fontFamily: "mon-sb",
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
});

export default Login;
