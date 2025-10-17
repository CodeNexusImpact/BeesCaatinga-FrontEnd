import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import cores from "@/constants/cores";

export default function RootLayout() {
  return <Stack screenOptions={{
    headerStyle: {
      backgroundColor: cores.fundo
    }
  }} />;
}

