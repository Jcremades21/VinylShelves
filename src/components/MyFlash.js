import React from "react";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";

export default function MyFlash() {
  return (
    <View style={{ flex: 1 }}>
      {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
      <FlashMessage position="top" /> {/* <--- here as last component */}
    </View>
  );
}