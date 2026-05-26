import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
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

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<Array<TextInput | null>>([]);

  const sendOtp = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/forgot-password/send-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert("Failed", data.message || "Unable to send OTP.");
        return;
      }

      Alert.alert("OTP Sent", "Please check your email for the verification code.");
      setStep("reset");
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, "");

    if (cleanValue.length > 1) {
      const pasted = cleanValue.slice(0, 6).split("");
      const nextOtp = ["", "", "", "", "", ""];

      pasted.forEach((digit, i) => {
        nextOtp[i] = digit;
      });

      setOtp(nextOtp);

      if (pasted.length >= 6) {
        Keyboard.dismiss();
      } else {
        inputs.current[pasted.length]?.focus();
      }

      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = cleanValue;
    setOtp(nextOtp);

    if (cleanValue && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (index === 5 && cleanValue) {
      Keyboard.dismiss();
    }
  };

  const handleBackspace = (value: string, index: number) => {
    if (!value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const resetPassword = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert("Password Mismatch", "Password confirmation does not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/forgot-password/reset`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: code,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert("Reset Failed", data.message || "Unable to reset password.");
        return;
      }

      Alert.alert("Success", "Your password has been reset successfully.", [
        {
          text: "Back to Login",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={DARK} />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/logos.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {step === "email" ? (
          <>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we’ll send you a verification code.
            </Text>

            <View style={styles.card}>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={22} color={ORANGE} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                onPress={sendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send OTP</Text>
                    <Ionicons name="paper-plane-outline" size={22} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.noteBox}>
                <Ionicons name="shield-checkmark-outline" size={25} color={ORANGE} />
                <Text style={styles.noteText}>
                  We’ll send a 6-digit code to your email address.
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.bottomText}>
                Remember your password?{" "}
                <Text style={styles.bottomLink}>Back to Login</Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code we sent to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <View style={styles.card}>
              <Text style={styles.label}>Enter 6-digit code</Text>

              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace") {
                        handleBackspace(digit, index);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={[styles.otpBox, digit && styles.otpBoxActive]}
                    textAlign="center"
                    selectionColor={ORANGE}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.resendInline} onPress={sendOtp}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={22} color={ORANGE} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="New Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={23}
                    color={MUTED}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={22} color={ORANGE} />
                <TextInput
                  value={passwordConfirmation}
                  onChangeText={setPasswordConfirmation}
                  placeholder="Confirm Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={23}
                    color={MUTED}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                onPress={resetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                    <Ionicons name="arrow-forward" size={23} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.bottomText}>
                Remember your password?{" "}
                <Text style={styles.bottomLink}>Back to Login</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFBF7",
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    width: 150,
    height: 120,
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    color: DARK,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 26,
  },
  emailText: {
    color: DARK,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  inputWrap: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFBF7",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontWeight: "700",
  },
  primaryButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: ORANGE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: ORANGE,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  noteBox: {
    marginTop: 18,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  noteText: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  bottomText: {
    marginTop: 24,
    color: MUTED,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomLink: {
    color: ORANGE,
    fontWeight: "900",
  },
  label: {
    color: DARK,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  otpBox: {
    flex: 1,
    height: 54,
    borderRadius: 13,
    backgroundColor: "#FFFBF7",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: DARK,
    fontSize: 22,
    fontWeight: "900",
  },
  otpBoxActive: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7ED",
  },
  resendInline: {
    alignSelf: "center",
    marginBottom: 18,
  },
  resendText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "900",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: MUTED,
    fontWeight: "800",
  },
});