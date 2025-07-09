import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import SignOutButton from "@/components/sign-out";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>Audentes Fortuna Iuvat</Text>
      <Image source={{ uri: "https://videos.openai.com/vg-assets/assets%2Ftask_01jzeaxm3pekkb1j0ddajhh2fg%2F1751754179_img_1.webp?st=2025-07-07T18%3A22%3A11Z&se=2025-07-13T19%3A22%3A11Z&sks=b&skt=2025-07-07T18%3A22%3A11Z&ske=2025-07-13T19%3A22%3A11Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=k9IpNRtKcOxFCYXwJtlWK26kdctl5PatVyx8yua3Fm4%3D&az=oaivgprodscus" }} style={styles.image} />

      <TextInput placeholder="your name" style={styles.input} />

      <Link href={"/sign-up"} style={styles.link}>
        Sign Up
      </Link>

      <Link href={"/sign-in"} style={styles.link}>
        Sign In
      </Link>

      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  link: {
    textAlign: "center",
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 20,
    fontStyle: "italic",
  },
  text: {
    textAlign: "center",
    color: "magenta",
    fontSize: 32,
  },
  input: {
    width: 200,
    borderWidth: 1,
    padding: 8,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
  }
})
