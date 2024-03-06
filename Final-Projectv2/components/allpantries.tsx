import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
 
} from "react-native";
import AddPantryDetail from "./addpantry";
import Colors from "@/constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import {FIRESTORE_DATABASE} from '@/firebaseConfig'
import { addDoc, collection } from "firebase/firestore";

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

  useEffect(() => {},[]);

  const addPantry = async () =>{
    const doc = addDoc(collection(FIRESTORE_DATABASE, ' pantry'),{title:'Test'})
    console.log(doc);
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleAddPantry = (title: string) => {
    const newItem = {
      id: Math.random().toString(), // Generate a random ID for the new pantry
      title,
    };
    console.log("Handling this:", title);
    setData((currentData) => [...currentData, newItem]); // Add the new pantry to the
    // pantry list
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>List of all pantries</Text>
      <TouchableOpacity onPress = {() => addPantry()} style={styles.addButton}><Text>1</Text></TouchableOpacity>
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
          <AddPantryDetail onAdd={ handleAddPantry} />
          <TouchableOpacity onPress={() => toggleModal()} style={styles.closeButton}>
            <AntDesign name="close" size={30} color="black" />
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
    backgroundColor:  Colors.background,
    width: "100%",
    marginTop: 30,
    borderRadius: 10,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  flatListView:{
    flex: 1
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
    marginBottom:20,
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
    fontFamily: 'mon-b'
    
  },
  modalView: {
    margin: 20,
    width: 350,
    height: 350,
    alignSelf: "center",
    justifyContent:'center',
    backgroundColor: 'white',

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
    gap: 50,

  },
  closeButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    borderWidth: 1,
  },
  
  item: {
    backgroundColor: Colors.box,
    width: 350,
    height: 100,
    borderRadius:10,
    padding: 10,
    borderWidth:1,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
  },
});
