import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

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
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Add Pantry" onPress={handleSubmit} />
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
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addPantry:{
    
  }
});

export default AddPantryDetail;