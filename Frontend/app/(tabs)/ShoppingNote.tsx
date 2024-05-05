import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { useAuth } from "../context/AuthContext";
import { useServerUrl } from "../context/ServerUrlContext";
import Header from "@/components/header";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

interface Note {
  id: number;
  content?: string;
}

const ShoppingNote = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const { user } = useAuth();
  const serverUrl = useServerUrl();

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user || user.id === undefined) {
      Alert.alert("Error", "User ID is not set. Please log in.");
      return;
    }
    try {
      const response = await fetch(`${serverUrl}/backend/get_notes?user_id=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setNotes(data);
      } else {
        throw new Error(data.error || 'Failed to fetch notes');
      }
    } catch (error:any) {
      Alert.alert('Error', error.message);
    }
  };
  const addNote = async () => {
    if (input.trim() && user) {
      try {
        const response = await fetch(`${serverUrl}/backend/add_note`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: input.trim(), user_id: user.id }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotes([...notes, { id: data.note_id, content: input.trim() }]);
          setInput('');
        } else {
          throw new Error(data.error || 'Failed to add note');
        }
      } catch (error:any) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Input Error', 'Please enter a note or check login status');
    }
  };




  const deleteNote = async (noteId: number) => {
    try {
      const response = await fetch(`${serverUrl}/backend/delete_note?note_id=${noteId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== noteId));
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete note');
      }
    } catch (error:any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Increased offset for iOS
      >
        <Stack.Screen
            options={{
              header: () => <Header />,
            }}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Shopping Notes</Text>
          {notes.map((note) => (
              <View key={note.id} style={styles.noteItem}>
                <Text style={styles.noteText}> {note.content} </Text>
                <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.deleteButton}>
                  <FontAwesome name="trash-o" size={24} color="white" />
                </TouchableOpacity>
              </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder="Add a note here..."
              value={input}
              onChangeText={setInput}
          />
          <TouchableOpacity onPress={addNote} style={styles.enterButton}>
            <FontAwesome name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    fontFamily: "mon-b",
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: Colors.box,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  noteText: {
    fontSize: 16,
    color: Colors.white,
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 10,
    fontFamily: "mon",
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    fontSize: 16,
    color: Colors.dark,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginRight: 10,
    fontFamily: "mon",
  },
  enterButton: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
});

export default ShoppingNote;
