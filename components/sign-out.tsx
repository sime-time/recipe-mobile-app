import { TouchableOpacity, Text } from "react-native";
import { authStyles } from "@/assets/styles/auth.styles";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  async function handleSignOut() {
    await authClient.signOut();
    console.log("signed out");
  }

  return (
    <TouchableOpacity onPress={handleSignOut} style={authStyles.authButton}>
      <Text style={authStyles.buttonText}>Sign Out</Text>
    </TouchableOpacity>
  );
}
