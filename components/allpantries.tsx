import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AddPantryDetail from "./addpantry";
import Colors from "@/constants/Colors";

const initialData = [
  {
    id: "",
    title: "",
  },
];

type ItemProps = { title: string };

const Item = ({ title } : ItemProps) => {
  if (!title) return null; // Don't render if title is undefined or null

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const AllPantries = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(initialData); // Use state to manage pantry data

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleAddPantry = (title: string) => {
    const newItem = {
      id: Math.random().toString(), // Generate a random ID for the new pantry
      title,
    };
    setData((currentData) => [...currentData, newItem]); // Add the new pantry to the
    // pantry list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>List of all pantries</Text>

      <FlatList
        data={data}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
        style = {styles.flatListView}
      />

      <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Pantry</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View
          style={styles.modalView}
          
        >
          <AddPantryDetail onAdd={handleAddPantry} />
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    </View>
  );
};

export default AllPantries;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flatListView:{
    flex: 1
  },
  headerText: {
    color: "black",
    textAlign: "center",
    padding: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom:20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 20
  },
  modalView: {
    margin: 20,
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
    elevation: 5,
  },
  closeButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  item: {
    backgroundColor: Colors.box,
    width: 350,
    height: 100,
    borderRadius:10,
    padding: 10,
    borderWidth:1,

  },
  title: {
    fontSize: 32,
  },
});
