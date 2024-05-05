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
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";
import SearchBar from "@/components/searchbar";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import DateTimePicker from "@react-native-community/datetimepicker";


import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useServerUrl } from "../context/ServerUrlContext";


interface Item {
  id: number;
  name: string;
  quantity: number;
  expiry_date?: string;
  website_url?: string;
  // ... any other properties of the item
}


const Index = () => {
  // CONSTANTS //


  const [newItemName, setNewItemName] = useState("");
  const [newItemExpiryDate, setNewItemExpiryDate] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [newItemImageWbsiteURL, setNewItemItemImageWebsiteURL] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const { user } = useAuth();


  const serverUrl = useServerUrl();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  const fetchItems = async () => {
    if (!user || user.id === undefined) {
      Alert.alert("Fetch error: No user or user id");
      return;
    }
    const url = `${serverUrl}/backend/get_pantry_items_by_user?user_id=${user.id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const items = await response.json();
      if (items && response.ok) {
        setItems(items);
      } else {
        throw new Error(items.message || "Error fetching items");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch items");
    }
  };


  const incrementQuantity = async (itemId: number) => {
    const item = items.find((item) => item.id === itemId);
    if (!item) {
      Alert.alert(
          "Erg why are you trying to increment an item that has not been added"
      );
      return;
    }


    const newQuantity = item.quantity + 1;
    console.log(item.name + "'s quantity is incremented by 1");
    updateQuantityOnServer(itemId, newQuantity); // Move API call here to ensure it uses correct quantity
  };


  const decrementQuantity = async (itemId: number) => {
    const item = items.find((item) => item.id === itemId);


    if (!item) {
      Alert.alert(
          "Erg why are you trying to decrement an item that has not been added"
      );
      return;
    }
    console.log(item.quantity);
    if (item.quantity - 1 <= 0) {
      // Ask user if they want to delete the item
      Alert.alert(
          "DELETE",
          "Delete " + item.name + " from your pantry ?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => deleteItem(itemId),
            },
          ],
          { cancelable: false }
      );
    }


    const newQuantity = item.quantity - 1;
    console.log(item.name + "'s quantity is dremented by 1");
    updateQuantityOnServer(itemId, newQuantity);
  };


  const updateQuantityOnServer = async (
      itemId: number,
      newItemQuantity: number
  ) => {
    // Implement API call to update the quantity on the server


    const url = `${serverUrl}/backend/update_pantry_item_quantity?item_id=${itemId}&quantity=${newItemQuantity}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      fetchItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };


  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");


    if (!selectedDate) {
      console.warn("Please select a date");
      return;
    }
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const dateString = `${year}-${month}-${day}`;
    setDate(date);
    setNewItemExpiryDate(dateString);
    console.log(dateString);
  };


  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const handleSearch = useCallback(
      async (term: string) => {
        if (!user || user.id === undefined) {
          Alert.alert("Fetch error: No user or user id");
          return;
        }
        const url = `${serverUrl}/backend/search_pantry_item_by_name?name=${encodeURIComponent(
            term
        )}&user_id=${user.id}`;
        if (!term) {
          fetchItems();
          return;
        }
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const result = await response.json();
          if (response.ok && result.length) {
            setItems(result);
          } else {
            setItems([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setItems([]);
        }
      },
      [user]
  );


  const deleteItem = async (itemId: number) => {
    if (!user || user.id === undefined) {
      console.error("User ID is undefined or not properly set.");
      return;
    }
    const url = `${serverUrl}/backend/delete_pantry_item?item_id=${itemId}&user_id=${user.id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        fetchItems();
      } else {
        throw new Error("Failed to delete the item");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  const addItem = async () => {
    if (!user || user.id === undefined) {
      Alert.alert("Error", "User not logged in or user data not available.");
      return;
    }
    const url = `${serverUrl}/backend/add_pantry_item`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName,
          expiry_date: newItemExpiryDate,
          quantity: newItemQuantity,
          user_id: user.id,
          website_url: newItemImageWbsiteURL,
        }),
      });
      if (response.ok) {
        setModalVisible(false);
        fetchItems();
      } else {
        throw new Error("Error adding item");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };


  useEffect(() => {
    if (user && user.id !== undefined) {
      fetchItems();
    } else {
      console.log("Waiting for user data before fetching items.");
    }
  }, [user]);


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


        <Text style={styles.headerText}>List of all items</Text>
        <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                  <Image source={item.website_url} style={styles.imageHolder} />
                  <View>
                    <Text style={styles.text}>{item.name}</Text>
                    <View style={styles.quantityShow}>
                      <Text style={styles.textNormal}>Quantity:</Text>
                      <TouchableOpacity
                          style={styles.Decrement}
                          onPress={() => decrementQuantity(item.id)}
                      >
                        <FontAwesome name="minus" size={5} color="black" />
                      </TouchableOpacity>
                      <Text style={styles.textNormal}>{item.quantity}</Text>
                      <TouchableOpacity
                          style={styles.Increment}
                          onPress={() => incrementQuantity(item.id)}
                      >
                        <FontAwesome name="plus" size={5} color="black" />
                      </TouchableOpacity>
                    </View>


                    <Text style={styles.textNormal}>
                      Expired in: {item.expiry_date}
                    </Text>
                  </View>


                  <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteItem(item.id)}
                  >
                    <FontAwesome name="trash-o" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
            )}
        />


        <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
          <Entypo name="plus" size={30} color="black" />
        </TouchableOpacity>


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}
        >
          <View style={styles.modalView}>
            <View>
              <Text style={styles.expText}>Enter item name: </Text>
              <TextInput
                  style={styles.input}
                  placeholderTextColor={Colors.white}
                  onChangeText={setNewItemName} // This updates the state for newItemName
              />
            </View>
            <View>
              <Text style={styles.expText}>Enter item quantity: </Text>
              <TextInput
                  keyboardType="numeric"
                  placeholderTextColor={Colors.white}
                  style={styles.input}
                  onChangeText={(text) => setNewItemQuantity(Number(text))} // This updates the state for newItemQuantity
              />
            </View>
            <View style ={styles.exp}>
              <Text style={styles.expText}>Expiration Date: </Text>
              <TouchableOpacity
                  onPress={showDatepicker}
                  style ={styles.expButton}
              >
                <FontAwesome name="calendar" size={24} color={Colors.white} />
                <Text style={styles.expTextCalendar}>
                  {date.toISOString().split("T")[0]}
                </Text>
              </TouchableOpacity>
            </View>


            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}


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


const styles = StyleSheet.create({
  expText: {
    fontFamily: "mon-sb",
    fontSize: 12,
    color: Colors.white,
  },
  Decrement: {
    alignSelf: "center",
    padding: 5,
    backgroundColor: Colors.red,
  },
  Increment: {
    alignSelf: "center",
    padding: 5,
    backgroundColor: Colors.green,
  },
  quantityShow: {
    flexDirection: "row",
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    bottom: 10,
    right: 30,
  },
  camera: {
    flex: 1,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  deleteButton: {
    position: "absolute",
    bottom: 10,
    right: 15,
  },
  list: {
    width: "100%",
  },
  imageHolder: {
    width: 70,
    height: 70,
    alignSelf: "center",
    borderRadius: 5,
  },
  noResults: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.red,
  },
  exp:{
    flexDirection: "row",
    paddingHorizontal:40
  },
  expButton:{
    flexDirection: "row",
    paddingHorizontal:40
  },
  expTextCalendar:{
    marginLeft: 20,
    alignSelf:'center',
    fontFamily:'mon',
    color: Colors.white
  },
  text: {
    fontFamily: "mon-b",
    fontSize: 18,
    marginLeft: 15,
    color: Colors.white,
    marginTop: 5,
  },
  calendarButton: {
    fontSize: 15,
    marginHorizontal: 15,
  },
  textNormal: {
    fontFamily: "mon",
    color: Colors.white,
    fontSize: 15,
    marginHorizontal: 15,
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
    margin: 5,
    padding: 10,
    height: 50,
    width: 300,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontFamily: "mon-sb",
    fontSize: 12,
    color: Colors.white,
  },
  flatListView: {
    flex: 1,
  },
  headerText: {
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  modalView: {
    marginTop: 20,
    width: 350,
    height: 350,
    alignSelf: "center",
    backgroundColor: Colors.grey,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    top: 90,
  },
  closeButton: {
    backgroundColor: "#FFF",
    padding: 10,
    marginTop: 10,
  },

  item: {
    backgroundColor: Colors.box,
    width: 350,
    height: 120,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
    borderWidth: 1,
    alignSelf: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 32,
  },
});


export default Index;





