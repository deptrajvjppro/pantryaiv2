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
import { useUser } from "../context/UserContext";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
interface Item {
  id: number;
  name: string;
  quantity: number;
  expiry_date?: string;
  // ... any other properties of the item
}
const index = () => {
  // CONSTANTS //

  const [newItemName, setNewItemName] = useState("");
  const [newItemExpiryDate, setNewItemExpiryDate] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const { user_id } = useUser();


  // HANDLE SEARCH //
  const handleSearch = useCallback(async (term: string) => {
    const url = `http://127.0.0.1:5000/backend/search_pantry_item_by_name?name=${encodeURIComponent(term)}`;
    if (!term) {
      fetchItems();
      return;
    }
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
      console.error('Error fetching data:', error);
      setItems([]);
    }
  }, []);


  // FETCH ITEMS FROM THE DATA BASE
  const fetchItems = async () => {
    // Ensure you have a valid user_id
    if (!user_id || user_id === undefined) {
      console.error("User ID is undefined or not properly set.");
      return; // Exit the function if user_id is not set
    }


    // Construct the URL with the correct user_id
    const url = `http://127.0.0.1:5000/backend/get_pantry_items_by_user?user_id=${user_id}`;
    try {
      const response = await fetch(url, {
        method: "GET", // Assuming GET is the correct method for your endpoint
        headers: {
          "Content-Type": "application/json",
        },
      });
      const items = await response.json();
      console.log("Current user_id object:", user_id);
      console.log("Using user_id for fetch:", user_id ? user_id : "Not Set");
      if (items && response.ok) {
        setItems(items);
      } else {
        throw new Error(items.message || "Error fetching items");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch items");
    }
  };


  // DELTE THE ITEMS FROM THE DATA BASE
  const deleteItem = async (itemId: number) => {
    try {
      const response = await fetch(
          `http://127.0.0.1:5000/backend/delete_pantry_item?item_id=${itemId}&user_id=${user_id}`, // Make sure the URL and parameters match your backend API requirements
          {
            method: "DELETE", // Use the DELETE HTTP method
            headers: {
              "Content-Type": "application/json",
            },
          }
      );
      if (response.ok) {
        // Option 1: Refetch the items list to update the UI
        console.log("Deleted item with ID", itemId);
        console.log("Delted item with ID", itemId, "from user", user_id);
        fetchItems();
      } else {
        throw new Error("Failed to delete the item");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };


  // ADD ITEMS TO THE DATA BASE
  const addItem = async () => {
    try {
      const response = await fetch(
          "http://127.0.0.1:5000/backend/add_pantry_item",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newItemName,
              expiry_date: newItemExpiryDate,
              quantity: parseInt(newItemQuantity, 10),
              user_id: user_id,
            }),
          }
      );
      if (response.ok) {
        setModalVisible(false);
        fetchItems(); // Refresh the list after adding an item
        console.log("Added item to User :", user_id);
      } else {
        throw new Error("Error adding item");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };


  // DYNAMICALLY UPDATE THE USER ID BASED ON THE USER LOG IN
  useEffect(() => {
    if (user_id && user_id !== undefined) {
      fetchItems();
    }
  }, [user_id]); // Depend on user_id.user_id to re-trigger the effect when it changes


  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };


  return (
      <View style={styles.container}>
        <Stack.Screen
            options={{
              header: () => <Header />,
            }}
        />
        <SearchBar onSearch={handleSearch} />

        <View style={styles.container1}>
          <Text style={styles.headerText}>List of all items</Text>
          <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text>
                      {item.name} - Qty: {item.quantity}
                    </Text>
                    <Text>
                      {item.expiry_date}
                    </Text>
                    <Button title="Delete" onPress={() => deleteItem(item.id)} />
                  </View>
              )}
          />
          <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New Item</Text>
          </TouchableOpacity>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={toggleModal}
          >
            <View style={styles.modalView}>
              <TextInput
                  style={styles.input}
                  placeholder="Item Name"
                  placeholderTextColor={"black"}
                  onChangeText={setNewItemName} // This updates the state for newItemName
              />
              <TextInput
                  style={styles.input}
                  placeholder="Expiration date (YYYY/MM/DD)"
                  placeholderTextColor={"black"}
                  onChangeText={setNewItemExpiryDate} // This updates the state for newItemExpiryDate
              />
              <TextInput
                  keyboardType="numeric"
                  placeholderTextColor={"black"}
                  style={styles.input}
                  placeholder="Quantity"
                  onChangeText={(text) => setNewItemQuantity(text)} // This updates the state for newItemQuantity
              />
              <View style={styles.addOrCancelArea}>
                <TouchableOpacity style={styles.checkStyle} onPress={addItem}>
                  <FontAwesome name="check" size={50} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelStyle}
                    onPress={toggleModal}
                >
                  <MaterialIcons name="cancel" size={50} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
  );
};


const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  list: {
    width: "100%",
  },

  noResults: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.red,
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





