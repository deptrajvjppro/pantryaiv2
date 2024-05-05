import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import {Stack, useRouter} from 'expo-router';
import Header from "@/components/header";
import { useAuth } from "../context/AuthContext";
import { useServerUrl } from "../context/ServerUrlContext";
import { useTab } from "../context/TabContext"; // Import useTab from your context
import Colors from "@/constants/Colors";

interface UserDetails {
  username: string;
  email: string;
  pantry_item_count: number;
  note_count: number;
}

const Account = () => {
  const router = useRouter();
  const { user } = useAuth();
  const serverUrl = useServerUrl();
  const { activeTab } = useTab(); // Get the active tab state
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    if (!user || user.id === undefined) {
      Alert.alert("User not found");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/backend/get_user_details?user_id=${user.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user details');
      }
      setUserDetails(data);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Account') { // Only fetch details when the Account tab is active
      fetchUserDetails();
    }
  }, [activeTab, user, serverUrl]); // Add activeTab to the dependency array

  const handleLogout = () => {
    router.navigate('Login'); // Ensure this is the correct route name
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
      <View style={styles.container}>
        <Stack.Screen
            options={{
              header: () => <Header />,
            }}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.header}>Account Details</Text>
          {userDetails ? (
              <>
                <View style={styles.detailBox}>
                  <Text style={styles.detailText}>Username: {userDetails.username}</Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailText}>Email: {userDetails.email}</Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailText}>Pantry Items: {userDetails.pantry_item_count}</Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailText}>Shopping Notes: {userDetails.note_count}</Text>
                </View>
              </>
          ) : (
              <Text style={styles.detailText}>No user details available</Text>
          )}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: Colors.white,
    marginBottom: 20,
    fontFamily: "mon-b",
  },
  detailBox: {
    width: '100%',
    backgroundColor: Colors.box,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "mon-sb",
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "mon-sb",
  },
});

export default Account;
