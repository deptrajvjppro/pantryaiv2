import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import add_pantry_item from 'Backend/SampleDBOps.py'


type AddPantryProps = {
  onAdd: (title: string) => void;
};

const AddPantryDetail: React.FC<AddPantryProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a pantry name.');
      return;
    }
    onAdd(title);
    setTitle(''); // Clear the input field after submission
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name your pantry..."
        placeholderTextColor={'black'}
        value={title}
        onChangeText={setTitle}
      />
      

      <TouchableOpacity style = {styles.addButton} onPress={() => handleSubmit()}>
        <Text style = {styles.addPantry}>Add pantry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    height:50,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth:StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontFamily:'mon-sb',
  
  },
  addPantry:{
    color: "white",
    fontFamily: 'mon-sb',
    paddingHorizontal:10
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop:20,
    alignSelf: "center",
    shadowColor: "#000",
   
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default AddPantryDetail;