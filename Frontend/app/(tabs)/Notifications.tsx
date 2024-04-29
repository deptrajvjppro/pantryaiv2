import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, {useState} from 'react'
import { Stack } from 'expo-router'
import Header from '@/components/header'

const ShoppingNote = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  const addNote = () => {
    if (input.trim()) {
      setNotes([...notes, input.trim()]);
      setInput('');  
    }
  };

  const deleteNote = (index) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    setNotes(newNotes);
  };
  return (
    <View style={styles.container}>
    <Stack.Screen
      options={{
        header: () => <Header />,
      }}
    />
    <View style={styles.notiView}>
        <Text style={styles.header}>Shopping Notes</Text>
        
        <ScrollView style={styles.notesContainer}>
          {notes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <Text style={styles.noteText}>• {note}</Text>
              <TouchableOpacity onPress={() => deleteNote(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter a note..."
          placeholderTextColor="#ccc"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addNote}
        />
        <TouchableOpacity onPress={addNote} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Note</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  notiView: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontFamily: "mon-b",
    color: "#FFF",
    fontSize: 25,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    color: 'black',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 40,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  notesContainer: {
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
  },
  inputContainer: {
    padding: 20,
  },
});

export default ShoppingNote
