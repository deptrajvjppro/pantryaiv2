import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Button } from "react-native";

const MealPlanning = () => {
  const [chatHistory, setChatHistory] = useState([{ user: "", bot: "Hello, how may I assist you?" }]);
  const [userInput, setUserInput] = useState("");
  const [inputKey, setInputKey] = useState(Math.random().toString());
  const [recipeSuggestion, setRecipeSuggestion] = useState("Generate recipe suggestion");

  const fetchPantryItemAndGenerateRecipe = async (user_id = 1) => {
    try {
      const response = await fetch(`http://192.168.1.15:5000/backend/get_pantry_items_by_user?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      try {
        const pantryItems = await response.json();
        if (pantryItems.length > 0) {
          const item = pantryItems[0].name; // Assume we take the first item for simplicity
          setRecipeSuggestion(`Generate a recipe suggestion for ${item}`);
        } else {
          setRecipeSuggestion("No pantry items found for user.");
        }
      } catch (e) {
        console.error("Error parsing JSON!", e);
        setRecipeSuggestion("Error parsing JSON!");
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setRecipeSuggestion(`Fetch error: ${error.message}`);
    }
  };

  const sendMessage = async () => {
    if (userInput.trim()) {
      const updatedChatHistory = [...chatHistory, { user: userInput, bot: "..." }];
      setChatHistory(updatedChatHistory);

      try {
        const response = await fetch("http://192.168.1.15:5000/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userInput }),
        });

        if (response.ok) {
          const data = await response.json();
          updatedChatHistory[updatedChatHistory.length - 1].bot = data.bot_response;
          setChatHistory(updatedChatHistory);
        } else {
          console.error("Fetch error:", response.statusText);
          updatedChatHistory[updatedChatHistory.length - 1].bot = "Error: Could not fetch response.";
          setChatHistory(updatedChatHistory);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        updatedChatHistory[updatedChatHistory.length - 1].bot = "Exception: Could not fetch response.";
        setChatHistory(updatedChatHistory);
      }

      setUserInput("");
      setInputKey(Math.random().toString());
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
                  <Text style={styles.userMessage}>User: {chat.user}</Text>
                  <Text style={styles.botMessage}>PantryAI: {chat.bot}</Text>
                </View>
            ))}
          </ScrollView>
          <TextInput
              key={inputKey}
              value={userInput}
              onChangeText={setUserInput}
              style={styles.input}
              placeholder="Type your message here..."
              placeholderTextColor="gray"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <Button title={recipeSuggestion} onPress={fetchPantryItemAndGenerateRecipe} />
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 10,
  },
  userMessage: {
    fontWeight: 'bold',
  },
  botMessage: {
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MealPlanning;
