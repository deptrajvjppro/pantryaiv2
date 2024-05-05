import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";


import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState("");


    const submitSearch = () => {
        onSearch(localSearchTerm);
    };



    const handleChange = (searchTerm: string) => {
        setLocalSearchTerm(searchTerm);
        onSearch(searchTerm); // Trigger search on change
    };
    return (
        <View style={styles.actionRow}>
            <Ionicons name="search" size={20} color={Colors.lessgrey} />
            <TextInput
                style={{
                    fontFamily: "mon",
                    fontSize: 15,
                    justifyContent: "center",
                    flex: 1,
                    color:Colors.white,
                }}
                value={localSearchTerm}
                onChangeText={handleChange}
                placeholder="Search for pantries or items ..."
                placeholderTextColor={Colors.lessgrey}
                returnKeyType="search" // Adds a "search" button on the keyboard
            />
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

