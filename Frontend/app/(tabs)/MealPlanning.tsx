import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Switch, Modal  } from "react-native";
import Header from "@/components/header";
import { Stack } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";
import { useServerUrl } from "../context/ServerUrlContext"; // Make sure the path is correct

const MealPlanning = () => {
  const [chatHistory, setChatHistory] = useState([{ user: "", bot: "Hello, how may I assist you?" }]);
  const [userInput, setUserInput] = useState("");
  const [inputKey, setInputKey] = useState(Math.random().toString());
  const [pantryItems, setPantryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();
  const serverUrl = useServerUrl();  // Using the server URL from the context

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPantryItems(); // Call your fetch method here
    });
    setChatHistory([{ user: "", bot: "Hello, how may I assist you?" }]);
    fetchPantryItems();

    return unsubscribe;
  }, [user , navigation]);

  const sendMessage = async (message: string) => {
    setChatHistory(prevHistory => [...prevHistory, { user: message, bot: "Processing..." }]);
    try {
      const response = await fetch(`${serverUrl}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory(prevHistory => [...prevHistory, { user: message, bot: data.bot_response }]);
      } else {
        console.error("Fetch error:", response.statusText);
        setChatHistory(prevHistory => [...prevHistory, { user: message, bot: "Error: Could not fetch response." }]);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setChatHistory(prevHistory => [...prevHistory, { user: message, bot: "Exception: Could not fetch response." }]);
    }
    setUserInput("");
  };

  const fetchPantryItems = async () => {
    if (!user || user.id === undefined) {
      // sendMessage("User ID is not set. Please log in.");
      return;
    }
    try {
      const response = await fetch(`${serverUrl}/backend/get_pantry_items_by_user?user_id=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setPantryItems(data);
      } else {
        throw new Error("Failed to fetch pantry items");
      }
    } catch (error) {
      sendMessage(`Fetch error: ${error.message}`);
    }
  };

  const toggleSelectItem = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleGenerateRecipes = () => {
    setIsModalVisible(true);
  };

  const generateRecipesForSelectedItems = () => {
    setIsModalVisible(false);
    const itemsToGenerateRecipesFor = pantryItems.filter(item => selectedItems.has(item.id));
    sendMessage(`Generate recipes for: ${itemsToGenerateRecipesFor.map(item => item.name).join(", ")}`);
  };

  return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Stack.Screen
            options={{
              header: () => <Header />,
            }}
        />
        <ScrollView style={styles.chatContainer}>
          {chatHistory.map((chat, index) => (
              <View key={index} style={styles.messageContainer}>
                <Text style={styles.user}>User: <Text style={styles.userMessage}>{chat.user}</Text></Text>
                <Text style={styles.botMessage}><Text style={styles.PantryAI}>PantryAI:</Text> {chat.bot}</Text>
              </View>
          ))}
        </ScrollView>
        <TextInput key={inputKey} value={userInput} onChangeText={setUserInput} style={styles.input} placeholder="Type your message here..." placeholderTextColor="gray" />
        <TouchableOpacity onPress={() => sendMessage(userInput)} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGenerateRecipes} style={styles.SelectItemsButton}>
          <Text style={styles.SelectItemsButtonText}>Select Items to Generate Recipes</Text>
        </TouchableOpacity>

        <Modal
            animationType="slide"
            transparent={false}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Items for Recipes</Text>
            {pantryItems.map((item) => (
                <View key={item.id} style={styles.item}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Switch
                      trackColor={{ false: "#767577", true: "white" }}
                      thumbColor={selectedItems.has(item.id) ? "#007bff" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => toggleSelectItem(item.id)}
                      value={selectedItems.has(item.id)}
                  />
                </View>
            ))}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.GenerateRecipesButton} onPress={generateRecipesForSelectedItems}>
                <Text style={styles.GenerateRecipesButtonText}>Generate Recipes</Text>
              </TouchableOpacity>

            </View>

          </View>
        </Modal>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  chatContainer: {
    flex: 1,
  },
  pantryContainer: {
    // flex: 1, // Adjust this as needed to allocate space for the pantry items
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  messageContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',  
    borderRadius: 5,             
    borderWidth: 1,              
    borderColor: '#ddd',         
    shadowColor: '#000',         
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },

  user: {
    fontWeight: 'bold',
  },

  userMessage: {
    fontStyle: 'normal',
    fontWeight: "normal",
  },
  PantryAI: {
    fontWeight: "bold",
  },
  botMessage: {
    fontStyle: 'italic',
    // color: '#666',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderColor: '#ccc',       
    backgroundColor: '#fff', 
    
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    margin: 5,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    
  },
  customButton: {
    backgroundColor: '#007bff', // Blue background
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 5,
  },
  customButtonText: {
    color: 'white', // White text
    fontSize: 16,
  },
  SelectItemsButton: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 5,
   
  },

  SelectItemsButtonText: {
    color: 'white',
    fontSize: 16,
  },

  modalView: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
    paddingTop: 50,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: 'white',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    color: 'white',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    justifyContent: 'space-between',
  },
  GenerateRecipesButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 5,
  },
  GenerateRecipesButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ff6347',  // Using a different color for distinction
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginRight: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

});
export default MealPlanning;
