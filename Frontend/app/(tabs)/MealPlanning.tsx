import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Button } from "react-native";

const MealPlanning = () => {
  const [chatHistory, setChatHistory] = useState([{ user: "", bot: "Hello, how may I assist you?" }]);
  const [userInput, setUserInput] = useState("");
  const [inputKey, setInputKey] = useState(Math.random().toString());
  const [pantryItemNames, setPantryItemNames] = useState([]);

  const sendMessage = async (message) => {
    setChatHistory(prevHistory => [...prevHistory, { user: message, bot: "Processing..." }]);
    try {
      const response = await fetch("http://192.168.1.15:5000/chatbot", {
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

  const fetchPantryItemAndGenerateRecipe = async (user_id = 1) => {
    try {
      const response = await fetch(`http://192.168.1.15:5000/backend/get_pantry_items_by_user?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pantryItems = await response.json();
      if (pantryItems.length > 0) {
        const names = pantryItems.map(item => item.name);
        setPantryItemNames(names);
        sendMessage(`Generate recipe for ${names.join(", ")}`);
      } else {
        setPantryItemNames([]);
        sendMessage("No pantry items found.");
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setPantryItemNames([]);
      sendMessage(`Fetch error: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.container}>
        <ScrollView style={styles.chatContainer} contentContainerStyle={{ flexGrow: 1 }}>
          {chatHistory.map((chat, index) => (
            <View key={index} style={styles.messageContainer}>
              <Text style={styles.user}>User: <Text style={styles.userMessage}>{chat.user}</Text> </Text>
              <Text style={styles.botMessage}><Text style={styles.PantryAI}>PantryAI:</Text> {chat.bot}</Text>
            </View>
          ))}
          {/* {pantryItemNames.map((name, index) => (
            <Text key={index}>{name}</Text>
          ))} */}
        </ScrollView>
        <TextInput
          key={inputKey}
          value={userInput}
          onChangeText={setUserInput}
          style={styles.input}
          placeholder="Type your message here..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity onPress={() => sendMessage(userInput)} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => fetchPantryItemAndGenerateRecipe(1)} style={styles.customButton}>
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
