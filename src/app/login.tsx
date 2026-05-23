import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#ff6a00";
const WHITE = "#ffffff";
const BLACK = "#000000";
const BG = "#f8fafc";

export default function LoginScreen() {
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("password");

  const handleLogin = () => {
    Alert.alert("Static Login", "Login UI only. No API connected yet.");

    // Change this route depending on your current app route.
    // If you use bottom tabs, use "/(tabs)/home".
    router.push("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.wrapper}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.logoWrap}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.subtitle}>
              Sign in to your Dumaguete EZE Car Rental account
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don’t have an account? </Text>

              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.footerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.push("/(tabs)/home")}
            >
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  logoImage: {
    width: 140,
    height: 80,
    alignSelf: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: WHITE,
    marginBottom: 26,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    color: WHITE,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: BLACK,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  loginButtonText: {
    color: ORANGE,
    fontWeight: "700",
    fontSize: 15,
  },
  footerRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  footerText: {
    color: BLACK,
    fontSize: 14,
  },
  footerLink: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  guestButton: {
    marginTop: 16,
    alignItems: "center",
  },
  guestText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});