import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";
import Items from "@/components/items";
import SearchBar from "@/components/searchbar";
import Colors from "@/constants/Colors";

const index = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <SearchBar />
      <Items />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems:'center',
  
  },
  text:{
    fontFamily: "mon-b", 
    textAlign:'center',
    
    marginTop:5
  },
  textInActive: { 
    color: Colors.lessgrey,
  },
  textActive: { 
    color: "white",

  },
  tab: {
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    width: 150,
    backgroundColor: "black",
    alignItems: "center",
  },

  contentContainer: {
    marginTop: 20,
    padding: 15,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  pantry: {
    backgroundColor: "black",
    height: 300,
    alignItems: "center",
  },
  rectangle:{
    borderWidth: 2,
    height:1,
    width: 70,
    marginTop: 15,
    borderRadius: 10,
    
  },
  rectangleActive:{
    borderColor: Colors.primary
  },
  rectangleInActive:{
    borderColor: "black"
  }
});

export default index;
