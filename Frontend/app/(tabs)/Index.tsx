import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";
import SearchBar from "@/components/searchbar";
import Colors from "@/constants/Colors";


const index = () => {
  const [items, setItems] = useState([]); // This will hold the list of items
  const [searchTerm, setSearchTerm] = useState("");


  const handleSearch = useCallback(async (term:string) => {
    setSearchTerm(term); // If you need to display the search term somewhere


    const url = `http://192.168.1.15:5000/backend/search_pantry_item_by_name?name=${encodeURIComponent(term)}`;


    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });


      const result = await response.json();
      if (response.ok && result.length) {
        setItems(result); // Update the items with the search result
      } else {
        setItems([]);
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
  text: {
    fontFamily: "mon-b",
    textAlign: "center",


    marginTop: 5,
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
  rectangle: {
    borderWidth: 2,
    height: 1,
    width: 70,
    marginTop: 15,
    borderRadius: 10,
  },
  rectangleActive: {
    borderColor: Colors.primary,
  },
  rectangleInActive: {
    borderColor: "black",
  },


  addOrCancelArea: {
    flexDirection: "row",
  },
  checkStyle: { padding: 50 },
  cancelStyle: { padding: 50 },
  container1: {
    flex: 1,
    backgroundColor: Colors.background,
    width: "100%",
    marginTop: 30,
    borderRadius: 10,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    padding: 10,
    height: 50,
    width: 300,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontFamily: "mon-sb",
  },
  flatListView: {
    flex: 1,
  },
  headerText: {
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "center",
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 10,
    fontFamily: "mon-b",
  },
  modalView: {
    marginTop: 20,
    width: 350,
    height: 350,
    alignSelf: "center",


    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    top: 90,
    gap: 10,
  },
  closeButton: {
    backgroundColor: "#FFF",
    padding: 10,


    marginTop: 10,
  },


  item: {
    backgroundColor: Colors.box,
    width: 350,
    height: 100,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
  },
});


export default index;