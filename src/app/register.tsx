import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
const RED = "#DC2626";

const formatPhoneDisplay = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
};

const getPhoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, 11);

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const phoneDigits = getPhoneDigits(phoneDisplay);

  const handlePhoneChange = (value: string) => {
    setPhoneDisplay(formatPhoneDisplay(value));
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your full name.");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return false;
    }

    if (!phoneDigits) {
      Alert.alert("Missing Phone Number", "Please enter your phone number.");
      return false;
    }

    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("09")) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone number must be 11 digits and start with 09. Example: 0912-111-1111",
      );
      return false;
    }

    if (!address.trim()) {
      Alert.alert("Missing Address", "Please enter your address.");
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return false;
    }

    if (password !== passwordConfirmation) {
      Alert.alert("Password Mismatch", "Password and confirm password do not match.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          address: address.trim(),
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const message =
          data.message ||
          data.errors?.email?.[0] ||
          data.errors?.phone?.[0] ||
          data.errors?.password?.[0] ||
          "Registration failed. Please check your details.";
        Alert.alert("Registration Failed", message);
        return;
      }

      Alert.alert(
        "Verify Email",
        data.message || "Account created. Please verify your email OTP.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.replace({
                pathname: "/verify-register-otp",
                params: {
                  email: email.trim().toLowerCase(),
                },
              }),
          },
        ],
      );
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to server.");
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={DARK} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="person-add-outline" size={34} color={ORANGE} />
            </View>

            <Text style={styles.title}>
              Create Your <Text style={styles.orangeText}>Account</Text>
            </Text>

            <Text style={styles.subtitle}>
              Join Dumaguete EZE Car Rental and start booking reliable vehicles
              with ease.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={21} color={MUTED} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Fernando Sarana"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={21} color={MUTED} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="call-outline" size={21} color={MUTED} />
                <TextInput
                  value={phoneDisplay}
                  onChangeText={handlePhoneChange}
                  placeholder="0912-111-1111"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={13}
                />
              </View>

              <Text
                style={[
                  styles.helperText,
                  phoneDigits.length > 0 &&
                    (phoneDigits.length !== 11 || !phoneDigits.startsWith("09")) &&
                    styles.helperTextError,
                ]}
              >
                Phone number must be 11 digits and start with 09.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="location-outline" size={21} color={MUTED} />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Dumaguete City"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={21} color={MUTED} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Minimum 8 characters"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={MUTED}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="shield-checkmark-outline" size={21} color={MUTED} />
                <TextInput
                  value={passwordConfirmation}
                  onChangeText={setPasswordConfirmation}
                  placeholder="Re-enter password"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  secureTextEntry={!showPasswordConfirmation}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswordConfirmation((prev) => !prev)}
                >
                  <Ionicons
                    name={showPasswordConfirmation ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={MUTED}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && { opacity: 0.75 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={23} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <Ionicons name="mail-unread-outline" size={22} color={ORANGE} />
              <Text style={styles.securityText}>
                After registration, we will send a 6-digit OTP to verify your email.
              </Text>
            </View>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFBF7",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 22,
    paddingBottom: 34,
  },
  topBar: {
    height: 56,
    justifyContent: "center",
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 22,
  },
  logoBadge: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    color: DARK,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
  },
  orangeText: {
    color: ORANGE,
  },
  subtitle: {
    marginTop: 10,
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFE4CC",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: DARK,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  inputWrap: {
    minHeight: 56,
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  helperText: {
    marginTop: 7,
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
  },
  helperTextError: {
    color: RED,
  },
  registerButton: {
    marginTop: 6,
    height: 58,
    borderRadius: 18,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: ORANGE,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  securityNote: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  securityText: {
    flex: 1,
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  loginRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: MUTED,
    fontWeight: "700",
  },
  loginLink: {
    color: ORANGE,
    fontWeight: "900",
  },
});
