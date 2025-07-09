import { useState } from "react";
import { View, TextInput, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { authStyles } from "@/assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "./verify-email";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    if (password.length < 8) {
      return Alert.alert("Error", "Password must be at least 8 characters");
    }

    setLoading(true);

    try {
      // create new user
      const signUpAttempt = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (signUpAttempt.error) {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        return Alert.alert("Error", "Sign-up failed. Please try again.");
      }

      // send verification code to user email
      const sendEmailAttempt = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      console.log("sending verification code to", signUpAttempt.data.user.email);
      if (sendEmailAttempt.error) {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        return Alert.alert("Error", "Failed to send verification email. Please try again.");
      }

      setPendingVerification(true)

    } catch (error) {
      console.error("Error", error);

    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification)
    return <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />;

  return (
    <View style={authStyles.container}>
      {/* Prevent the keyboard from blocking the text input */}
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* IMAGE CONTAINER */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            {/* NAME INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                value={name}
                placeholder="Full name"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setName}
              />
            </View>

            {/* EMAIL INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                value={email}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                value={password}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* SIGN UP BUTTON */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
            </TouchableOpacity>

            {/* SIGN IN LINK */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.back()}
            >
              <Text style={authStyles.linkText}>
                Already have an account? <Text style={authStyles.link}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
