import {View, Text, TextInput, Button, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack } from 'expo-router'
import Header from '@/components/header'

const MealPlanning = () => {
  console.log("ChatScreen is rendering");
  const [chatHistory, setChatHistory] = useState([
    { user: "", bot: "Hello, how may I assist you?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [inputKey, setInputKey] = useState(Math.random().toString());

  const sendMessage = async () => {
    if (userInput.trim()) {

      // Add user message to chat history
      const updatedChatHistory = [...chatHistory, { user: userInput, bot: "..." },];
      setChatHistory(updatedChatHistory);

      // Send the userInput to the Flask backend
      try {
        const response = await fetch("http://127.0.0.1:5000/chatbot", {
          method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({ message: userInput }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Data received:", data);

          // Update chat history with ChatGPT's response
          updatedChatHistory[updatedChatHistory.length - 1].bot = data.bot_response;
          setChatHistory(updatedChatHistory);

        } else {
          console.error("Fetch error:", response.statusText);
          updatedChatHistory[updatedChatHistory.length - 1].bot = "Error: Could not fetch response.";
        }
      } catch (error: any) {
        console.error("Fetch error:", error.message);
        updatedChatHistory[updatedChatHistory.length - 1].bot = "Exception: Could not fetch response.";
      }
      // Update the chat history and clear the input field
      setChatHistory(updatedChatHistory);
      setUserInput(""); // Reset the input field
      setInputKey(Math.random().toString()); // Update the key to force re-render
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
            <Text style = {styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white', // Ensure background is not black
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
    backgroundColor: '#007bff', // Example: Blue background
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

  sendButtonText: {
    color: 'white', // Text color
    fontSize: 16,
  },
});

export default MealPlanning