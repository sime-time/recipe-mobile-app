import { COLORS } from "@/constants/colors";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeScreen({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      backgroundColor: COLORS.background,
    }}>
      {children}
    </View>
  );
}
