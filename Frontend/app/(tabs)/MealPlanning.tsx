import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useUser } from "../context/UserContext"; // Assuming this is the correct path to your context

const MealPlanning = () => {
  const [chatHistory, setChatHistory] = useState([{ user: "", bot: "Hello, how may I assist you?" }]);
  const [userInput, setUserInput] = useState("");
  const [inputKey, setInputKey] = useState(Math.random().toString());
  const { user_id } = useUser(); // Use the useUser hook to get the userId

  const sendMessage = async (message: string) => {
    setChatHistory(prevHistory => [...prevHistory, { user: message, bot: "Processing..." }]);
    try {
      const response = await fetch("http://10.0.0.201:5000/chatbot", {
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
    } catch (error: any) {
      console.error("Fetch error:", error.message);
      setChatHistory(prevHistory => [...prevHistory, { user: message, bot: "Exception: Could not fetch response." }]);
    }
    setUserInput("");
  };

  const fetchPantryItemAndGenerateRecipe = async () => {
    if (!user_id) {
      console.error("No user ID available");
      sendMessage("User ID is not set. Please log in.");
      return;
    }
  
    console.log("Fetching items for user ID:", user_id); // Assuming user_id is just a string
    try {
      const url = `http://10.0.0.201:5000/backend/get_pantry_items_by_user?user_id=${user_id}`;
      console.log("Request URL:", url); // Ensure this outputs a URL with a simple numeric ID
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const pantryItems = await response.json();
      console.log("Pantry items received:", pantryItems);
  
      if (pantryItems.length > 0) {
        const names = pantryItems.map((item: { name: any; }) => item.name);
        sendMessage(`Generate recipe for ${names.join(", ")}`);
      } else {
        sendMessage("No pantry items found.");
      }
    } catch (error:any) {
      console.error("Fetch error:", error.message);
      sendMessage(`Fetch error: ${error.message}`);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      <View style={styles.container}>
        <ScrollView style={styles.chatContainer} contentContainerStyle={{ flexGrow: 1 }}>
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
        <TouchableOpacity onPress={fetchPantryItemAndGenerateRecipe} style={styles.customButton}>
          <Text style={styles.customButtonText}>Generate Pantry Items</Text>
        </TouchableOpacity>
      </View>
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

});

export default MealPlanning;