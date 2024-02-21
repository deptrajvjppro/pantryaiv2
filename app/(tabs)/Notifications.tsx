import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <View style={styles.notiView}>
        
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
  notiView: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    flex: 1,
    top: 50, //default height for the header
  },
});

export default Notifications;
