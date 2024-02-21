import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Link, Stack } from "expo-router";
import Header from "@/components/header";

const Account = () => {
  const { signOut, isSignedIn } = useAuth();
  return (
    <View>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />

      <Button title="Log out" onPress={() => signOut()} />
      {!isSignedIn && (
        <Link href={"/(modals)/Login"}>
          <Text>Loign</Text>
        </Link>
      )}
    </View>
  );
};

export default Account;
