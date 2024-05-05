
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Modal,
} from "react-native";
import Header from "@/components/header";
import { Stack } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/app/context/AuthContext";
import { useServerUrl } from "@/app/context/ServerUrlContext";
import { Image } from "expo-image";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";


interface PantryItem {
  id: number;
  name: string;
  quantity: number;
  expiry_date?: string;
  website_url?: string;
}


const MealPlanning = () => {
  const [chatHistory, setChatHistory] = useState("Let's generate some meals");
  const [userInput, setUserInput] = useState("");
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();
  const serverUrl = useServerUrl();


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPantryItems();
    });
    fetchPantryItems();
    return unsubscribe;
  }, [user, navigation]);


  const sendMessage = async (message: string) => {
    setChatHistory("Processing...");
    try {
      const response = await fetch(`${serverUrl}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.bot_response);
      } else {
        console.error("Fetch error:", response.statusText);
        setChatHistory("Error: Could not fetch response.");
      }
    } catch (error: any) {
      console.error("Fetch error:", error.message);
      setChatHistory("Exception: Could not fetch response.");
    }
    setUserInput("");
  };


  const fetchPantryItems = async () => {
    if (!user || user.id === undefined) {
      return;
    }
    try {
      const response = await fetch(
          `${serverUrl}/backend/get_pantry_items_by_user?user_id=${user.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
      );
      const data = await response.json();
      if (response.ok) {
        setPantryItems(data);
      } else {
        throw new Error("Failed to fetch pantry items");
      }
    } catch (error: any) {
      console.log(`Fetch error: ${error.message}`);
    }
  };


  const toggleSelectItem = (itemId: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };


  const handleGenerateRecipes = () => {
    setIsModalVisible(true);
  };


  const generateRecipesForSelectedItems = () => {
    setIsModalVisible(false);
    const itemsToGenerateRecipesFor = pantryItems.filter((item) =>
        selectedItems.has(item.id)
    );
    sendMessage(
        `Generate recipes for: ${itemsToGenerateRecipesFor.map((item) => item.name).join(", ")}`
    );
  };


  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
      >
        <Stack.Screen
            options={{
              header: () => <Header />,
            }}
        />
        <ScrollView style={styles.chatContainer}>
          <Text style={styles.botMessage}>
            <Text style={styles.PantryAI}>PantryAI:</Text> {chatHistory}
          </Text>
        </ScrollView>
        <TouchableOpacity
            onPress={handleGenerateRecipes}
            style={styles.SelectItemsButton}
        >
          <Text style={styles.SelectItemsButtonText}>
            Select Items to Generate Recipes With
          </Text>
        </TouchableOpacity>
        <Modal
            animationType="slide"
            transparent={false}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            style={styles.modalView}
        >
          <ScrollView>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Items in Your Pantry</Text>
              {pantryItems.map((item) => (
                  <View key={item.id} style={styles.box}>
                    <View style={styles.item}>
                      <Image source={item.website_url} style={styles.imageHolder} />
                      <View>
                        <Text style={styles.itemNameStyle}>{item.name}</Text>
                        <Text style={styles.itemQuantityStyle}>
                          Quantity: {item.quantity}
                        </Text>
                      </View>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: "white" }}
                        thumbColor={
                          selectedItems.has(item.id) ? Colors.primary : "white"
                        }
                        onValueChange={() => toggleSelectItem(item.id)}
                        value={selectedItems.has(item.id)}
                    />
                  </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
            >
              <MaterialIcons name="cancel" size={50} color={Colors.red} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.GenerateRecipesButton}
                onPress={generateRecipesForSelectedItems}
            >
              <FontAwesome name="check" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  PantryAI: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "mon-sb",
  },
  botMessage: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: "mon",
  },
  SelectItemsButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  SelectItemsButtonText: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: "mon-sb",
  },
  modalView: {
    flex: 1,
    padding: 50,
    backgroundColor: Colors.background,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: Colors.white,
    fontFamily: "mon-b",
  },
  imageHolder: {
    width: 30,
    height: 30,
    alignSelf: "center",
    borderRadius: 5,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.white,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  itemNameStyle: {
    color: "white",
    fontFamily: "mon-sb",
    marginLeft: 10,
  },
  itemQuantityStyle: {
    color: "white",
    fontFamily: "mon",
    marginLeft: 10,
    fontSize: 12,
  },
  modalButtonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    justifyContent: "space-between",
  },
  GenerateRecipesButton: {
    backgroundColor: Colors.primary,
    width: 45,
    height: 45,
    alignSelf:'center',
    alignItems:'center',
    justifyContent: "center",
    borderRadius: 50,
    marginLeft: 5,
  },
  closeButton: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 5,
  },
});
export default MealPlanning;
