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
import { useRouter } from "expo-router";
import { defaultStyle } from "@/constants/Styles";
import { useUser } from "../context/UserContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUserId } = useUser(); 
  
  const handleLogin = async () => {
    const response = await fetch("http://10.0.0.201:5000/backend/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    const id = await response.json();
    if (id && response.ok) {
      console.log("Login successful, user ID:", id['user_id']);
      // Redirect or perform further actions
      setUserId(id);
      router.push('/(tabs)/Index')
    } else {
      Alert.alert(
        "Login failed",
        "No user found with that email and password combination"
      );
    }
  };

  const handleSignup = async () => {
    const response = await fetch("http://10.0.0.201:5000/backend/add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const id = await response.json();
    if (id) {
      console.log("Signup successful, new user ID:", id);
      // Redirect or perform further actions
    } else {
      Alert.alert("Signup failed", id.error || "Could not create user");
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
        style={[defaultStyle.inputBox, { marginTop: 20 }]}
      />

      <Text style={styles.inputLabel}>Enter Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        placeholderTextColor="black"
        secureTextEntry
        style={[defaultStyle.inputBox, { marginTop: 20 }]}
      />

      <TouchableOpacity style={defaultStyle.loginButton} onPress={handleLogin }>
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
  inputLabel: {
    left: 30,
    fontSize: 15,
    marginTop: 20,
  },
  textStyle: {
    fontFamily: "mon-sb",
    left: 70,
    fontSize: 20,
  },
  btnIcon: {
    position: "absolute",
    padding: 10,
    left: 15,
  },
  logoStyle: {
    alignSelf: "center",
    justifyContent: "center",
    width: 350,
    height: 100,
    marginTop:50
  
  },
  textBox: {
    fontFamily: "mon-sb",
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
  continueButton: {
    height: 55,
    width: 350,
    borderWidth: 1.1,
    backgroundColor: "white",
    borderColor: "black",
    justifyContent: "center",
    borderRadius: 7,
    marginTop: 20,
    alignSelf: "center",
  },
});

export default Login;
