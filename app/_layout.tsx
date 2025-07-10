import { Stack } from "expo-router";
import SafeScreen from "@/components/safe-screen";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeScreen>
  );
}
