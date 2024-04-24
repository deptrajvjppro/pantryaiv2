import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { useWarmupBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyle } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

enum Strategy {
  Google = "oauth_google",
}
const Login = () => {
  //dont mind this
  useWarmupBrowser();

  const router = useRouter();

  // Authentication sign in with Google block
  /////////////////////////////////
  const { startOAuthFlow: googleAuthentication } = useOAuth({
    strategy: "oauth_google",
  });
  const onClick = async (strategy: Strategy) => {
    const selectAuth = {
      [Strategy.Google]: googleAuthentication,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error("O-Authentication error: " + err);
    }
  };
  /////////////////////////////////

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logoStyle}
      />
      <Text
        style={{
          left: 30,
          top: -200,
          fontSize: 15,
        }}
      >
        {" "}
        Enter Email Address
      </Text>
      <TextInput
        autoCapitalize="none"
        placeholderTextColor="black"
        style={[defaultStyle.inputBox, { top: -190 }]}
      />

      <Text
        style={{
          left: 30,
          top: -180,
          fontSize: 15,
        }}
      >
        {" "}
        Enter Password
      </Text>
      <TextInput
        autoCapitalize="none"
        placeholderTextColor="black"
        style={[defaultStyle.inputBox, { top: -170 }]}
        secureTextEntry
      />

      <TouchableOpacity style={[defaultStyle.loginButton, { top: -150 }]}>
        <Text style={styles.textBox}>Log in</Text>
      </TouchableOpacity>

      <View style={styles.separatorView}>
        <View
          style={{
            flex: 1,
            borderBottomWidth: StyleSheet.hairlineWidth,
            top: -135,
          }}
        >
          <Text style={styles.separator}>or</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={() => onClick(Strategy.Google)}
          style={[styles.continueButton, { top: -105 }]}
        >
          <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
          <Text style={styles.textStyle}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    top: -110,
    left: 20,
    height: 350,
    width: 350,
  },
  separator: {
    fontFamily: "mon",
    color: "black",
    fontSize: 15,
    textAlign: "center",
  },
  textBox: {
    fontFamily: "mon-sb",
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
  separatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  continueButton: {
    height: 55,
    width: 350,
    left: 20,
    borderWidth: 1.1,
    backgroundColor: "white",
    borderColor: "black",
    justifyContent: "center",
    borderRadius: 7,
  },
});
export default Login;
