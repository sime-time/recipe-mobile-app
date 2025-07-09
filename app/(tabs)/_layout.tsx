import { Redirect, Stack } from 'expo-router';
import { authClient } from '@/lib/auth-client';

export default function TabsLayout() {
  const { data: session } = authClient.useSession();

  // if not signed in, redirect to sign-in screen
  if (!session) {
    return <Redirect href={"/sign-in"} />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
