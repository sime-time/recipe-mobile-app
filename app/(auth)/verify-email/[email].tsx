
import { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authStyles } from "@/assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sendVerificationEmail = async () => {
      // send verification code to user email
      const sendEmailAttempt = await authClient.emailOtp.sendVerificationOtp({
        email: email as string,
        type: "email-verification",
      });

      console.log("sending verification code to", email);
      if (sendEmailAttempt.error) {
        console.error(JSON.stringify(sendEmailAttempt, null, 2));
        return Alert.alert("Error", "Failed to send verification email. Please try again.");
      }
    };
    sendVerificationEmail();
  }, [email]);

  const handleVerification = async () => {
    setLoading(true);

    try {
      // use the code input to attempt verification
      const verifyEmailAttempt = await authClient.emailOtp.verifyEmail({
        email: email as string,
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
  };

  const handleResendEmail = async () => {
    // this is a duplicate of the email sending logic, but it's okay because
    // it's explicitly for the resend button.
    const resendEmailAttempt = await authClient.emailOtp.sendVerificationOtp({
      email: email as string,
      type: "email-verification",
    });

    console.log("resending verification code to", email);
    if (resendEmailAttempt.error) {
      console.error(JSON.stringify(resendEmailAttempt, null, 2));
      return Alert.alert("Error", "Failed to resend verification email. Please try again.");
    } else {
      Alert.alert("Verification", `Sent code to ${email}`);
    }
  };

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
          <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

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

            {/* RESEND EMAIL */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={handleResendEmail}
            >
              <Text style={authStyles.linkText}>
                Didn&apos;t get an email? <Text style={authStyles.link}>Resend code to email</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
