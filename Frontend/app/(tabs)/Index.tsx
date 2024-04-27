import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";
import Items from "@/components/items";
import SearchBar from "@/components/searchbar";
import Colors from "@/constants/Colors";

const index = () => {
  const [items, setItems] = useState([]); // This will hold the list of items
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(async (term:string) => {
    setSearchTerm(term); // If you need to display the search term somewhere

    const url = `http://10.0.0.201:5000/backend/search_pantry_item_by_name?name=${encodeURIComponent(term)}`;

    try {
      const response = await fetch(url, {
        method: 'GET', // or 'POST', if required by your backend
        headers: {
          'Content-Type': 'application/json',
          // Include other headers if needed, like an Authorization token
        },
        // Include body if method is POST
      });

      const result = await response.json();
      if (response.ok && result) {
        console.log("Searched: " + result)
        console.log ("Found " + result['name'])
        setItems(result); // Update the items with the search result
      } else {
        console.error('Search failed:', result?.message || 'No message');
        setItems([]); // Consider how you want to handle no results
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setItems([]); // Handle the error as needed
    }
  }, []);
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <SearchBar onSearch={handleSearch}/>
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
