import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // Base URL of backend api
  plugins: [
    expoClient({
      scheme: "recipeapp",
      storagePrefix: "recipeapp",
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});
