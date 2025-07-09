import { useState } from "react";
import { View, Text, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { authStyles } from "@/assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";

interface VerifyEmailProps {
  email: string;
  onBack: () => void;
}

export default function VerifyEmail(props: VerifyEmailProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    setLoading(true);

    try {
      // use the code input to attempt verification
      const verifyEmailAttempt = await authClient.emailOtp.verifyEmail({
        email: props.email,
        otp: code,
      });

      if (verifyEmailAttempt.error) {
        return Alert.alert("Error", "Verification failed. Please try again.")
      }

      console.log("email verified!");
      router.push("/")

    } catch (error) {
      console.error("Error", error);

    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={authStyles.container}>
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
              source={require("@/assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {props.email}</Text>

          <View style={authStyles.formContainer}>
            {/* VERIFICATION CODE INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify Email"}</Text>
            </TouchableOpacity>

            {/* SIGN IN LINK */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={props.onBack}
            >
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign up</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
