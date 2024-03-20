import { View, Text, Button, StyleSheet, Image } from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link, Stack } from "expo-router";
import Header from "@/components/header";

const Account = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <View style={styles.notiView}>
    
        <Image style={styles.avartaStyle} source={{ uri: user?.imageUrl }} />
        <Text style = {styles.text}>{user?.fullName}</Text>
        
        {/* Log out button */}
        <Button title="Log out" onPress={() => signOut()} />
        {!isSignedIn && (
          <Link href={"/(modals)/Login"}>
            <Text style={{ color: "#FFF" }}>Loign</Text>
          </Link>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
  text:{
    color: "#FFFF",
    alignSelf:"center",
    fontFamily: "mon-sb",
    margin: 20,
    fontSize: 20
  },
  notiView: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  
  avartaStyle: {
    width: 100,
    height: 100,
    alignSelf:"center",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 50,
    marginTop:40
  },
});
export default Account;
