import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Make sure the path is correct
import { useRouter } from "expo-router";
import { useServerUrl } from "../context/ServerUrlContext"; // Make sure the path is correct
import Colors from "@/constants/Colors"; // Ensure you have this path

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to track login or signup
  const [keyboardPadding, setKeyboardPadding] = useState(0); // State for keyboard padding
  const { login, user } = useAuth();
  const router = useRouter();
  const serverUrl = useServerUrl(); // Using the server URL from the context

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardPadding(100); // Adds an extra 100 pixels of padding when the keyboard is shown
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardPadding(0); // Removes the padding when the keyboard is hidden
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleLogin = async () => {
    const response = await fetch(`${serverUrl}/backend/loginUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Login successful, user ID:", result.user_id);
      await login(email, password);
      if (user) {
        router.navigate('/(tabs)');
      }
    } else {
      Alert.alert("Login failed", result.error || "Invalid credentials");
    }
  };




  const handleSignup = async () => {
    const response = await fetch(`${serverUrl}/backend/sign_up_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Signup successful, new user ID:", result.user_id);
      await login(email, password);
      if (user) {
        router.navigate('/(tabs)');
      }
    } else {
      Alert.alert("Signup failed", result.error || "Could not create user");
    }
  };


  const toggleMode = () => {
    setIsLogin(prevState => !prevState);
  };

  return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <KeyboardAvoidingView
            style={[styles.container, { marginBottom: keyboardPadding }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.logoContainer}>
            <Image
                source={require("@/assets/images/logowhite.png")}
                style={styles.logoStyle}
            />
          </View>

          {isLogin ? null : (
              <View>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholder="Username"
                    style={styles.inputBox}
                />
              </View>
          )}

          <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholder="Email Address"
              style={styles.inputBox}
          />

          <TextInput
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              placeholder="Password"
              secureTextEntry
              style={styles.inputBox}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isLogin ? 'Log in' : 'Sign up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.toggleText}>{isLogin ? 'Switch to Sign up' : 'Switch to Log in'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginTop: -50, // Shit UI up 50
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoStyle: {
    width: 400,
    height: 100,
  },
  inputBox: {
    width: 300,
    height: 40,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    width: 300,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontFamily: "mon",
  },
  toggleText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontFamily: "mon",
  },
});


export default Login;
