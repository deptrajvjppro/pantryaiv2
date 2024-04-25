import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";


interface Item {
  id: number;
  name: string;
  quantity: number;
  // ... any other properties of the item
}
const Items = () => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemExpiryDate, setNewItemExpiryDate] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/backend/get_pantry_items_by_user"
      ); // Adjust according to actual API
      const data = await response.json();
      if (response.ok) {
        setItems(data);
      } else {
        throw new Error(data.message || "Error fetching items");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/backend/delete_pantry_item",
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchItems(); // Refresh the list after deleting an item
      } else {
        throw new Error("Error deleting item");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

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
            user_id: 1, // Assuming user_id is 1
            quantity: parseInt(newItemQuantity, 10)
          }),
        }
      );
      if (response.ok) {
        setModalVisible(false);
        fetchItems(); // Refresh the list after adding an item
      } else {
        throw new Error("Error adding item");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>List of all items</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.name} - Qty: {item.quantity}
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
              onChangeText={setNewItemName}  // This updates the state for newItemName
          />
          <TextInput
              style={styles.input}
              placeholder="Expiration date (YYYY/MM/DD)"
              placeholderTextColor={"black"}
              onChangeText={setNewItemExpiryDate}  // This updates the state for newItemExpiryDate
          />
          <TextInput
              keyboardType="numeric"
              placeholderTextColor={"black"}
              style={styles.input}
              placeholder="Quantity"
              onChangeText={(text) => setNewItemQuantity(text)}  // This updates the state for newItemQuantity
          />
          <View style={styles.addOrCancelArea}>
            <TouchableOpacity style={styles.checkStyle} onPress={addItem}>
              <FontAwesome name="check" size={50} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelStyle} onPress={toggleModal}>
              <MaterialIcons name="cancel" size={50} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Items;

const styles = StyleSheet.create({
  text: {
    fontFamily: "mon-sb",
  },
  addOrCancelArea: {
    flexDirection: "row",
  },
  checkStyle: { padding: 50 },
  cancelStyle: { padding: 50 },
  container: {
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
