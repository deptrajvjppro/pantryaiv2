import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState('');

    const searchHandle = (query : string) =>{
        setSearchInput(query);
       
    }
  return (
    <View style={styles.actionRow}>
      <Ionicons name="search" size={20} color= {Colors.lessgrey} />

      <TextInput
        style={{
          fontFamily: "mon",
          fontSize: 15,
          justifyContent: "center",
          flex: 1,
        }}
        value={searchInput}
        onChangeText={(query) => searchHandle(query)}
        placeholder="Search for pantries or items ..."
        placeholderTextColor= {Colors.lessgrey}
      />

      {/* <TouchableOpacity style = {styles.sortingButton}>
              <FontAwesome name="sort" size={24} color="black"  />
            </TouchableOpacity> */}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    width: 350,
    height: 50,
    alignSelf:'center',
    alignItems:'center',
    borderRadius: 30,
    gap: 20,
    marginTop: 20,
 
    backgroundColor: Colors.grey,
  },
});
