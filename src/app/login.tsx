import { useState } from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
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
import { API_URL } from "../lib/api/config";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";
const SOFT_BG = "#FFFBF7";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert("Login Failed", data.message || "Invalid login credentials.");
        return;
      }

      await AsyncStorage.setItem("auth_token", data.token);
      await AsyncStorage.setItem("auth_user", JSON.stringify(data.user));

      router.replace("/(tabs)/browse");
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <View style={styles.decorCircleTop} />
          <View style={styles.decorCircleBottom} />

          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logos.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue your rental journey.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={22} color={ORANGE} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={22} color={ORANGE} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={23}
                  color={MUTED}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => router.push("/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, !canSubmit && styles.disabledButton]}
              onPress={handleLogin}
              disabled={!canSubmit}
              activeOpacity={0.86}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.createAccountPlain}>
              <Text style={styles.registerQuestion}>Don’t have an account?</Text>

              <Link href="/register" asChild>
                <TouchableOpacity style={styles.createAccountLink} activeOpacity={0.75}>
                  <Text style={styles.registerText}>Create Account</Text>
                  <Ionicons name="chevron-forward" size={20} color={ORANGE} />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SOFT_BG,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 34,
    justifyContent: "center",
  },
  decorCircleTop: {
    position: "absolute",
    left: -78,
    top: -48,
    width: 190,
    height: 190,
    borderRadius: 999,
    backgroundColor: "#FFEDD5",
    opacity: 0.24,
  },
  decorCircleBottom: {
    position: "absolute",
    right: -90,
    bottom: 34,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#FED7AA",
    opacity: 0.16,
  },
  header: {
    alignItems: "center",
    marginBottom: 26,
  },
  logo: {
    width: 155,
    height: 130,
    marginBottom: 16,
  },
  title: {
    color: DARK,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    color: MUTED,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#F8E7D8",
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  inputWrap: {
    minHeight: 60,
    borderRadius: 18,
    backgroundColor: "#FFFCF9",
    borderWidth: 1,
    borderColor: "#E7DED8",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 0,
  },
  eyeButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 20,
  },
  forgotText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "800",
  },
  loginButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    shadowColor: ORANGE,
    shadowOpacity: 0.22,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.62,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  dividerRow: {
    marginTop: 26,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#737373",
    fontSize: 13,
    fontWeight: "800",
  },
  createAccountPlain: {
    alignItems: "center",
    paddingTop: 2,
    paddingBottom: 4,
  },
  registerQuestion: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  createAccountLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  registerText: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "900",
  },
});
