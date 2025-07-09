import { COLORS } from "@/constants/colors";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
