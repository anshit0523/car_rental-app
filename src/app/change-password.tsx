import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#f97316";
const API_URL = "https://car-rental.free.laravel.cloud/api";

export default function ChangePasswordScreen() {
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const otp = otpBoxes.join("");

  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumberSymbol =
    /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const getToken = async () => {
    return await AsyncStorage.getItem("auth_token");
  };

  const sendOtp = async () => {
    setError("");

    if (!currentPassword.trim()) {
      setError("Please enter your current password.");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_URL}/user/change-password/send-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP.");
        return;
      }

      setTimer(60);
      setStep(2);
      Alert.alert("OTP Sent", data.message || "Please check your email.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...otpBoxes];

    updated[index] = digit;
    setOtpBoxes(updated);
    setError("");

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (updated.join("").length === 6) {
      Keyboard.dismiss();
    }
  };

  const verifyOtpStep = () => {
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setStep(3);
  };

  const updatePassword = async () => {
    setError("");

    if (!password || !passwordConfirmation) {
      setError("Please fill in all password fields.");
      return;
    }

    if (!hasMinLength || !hasUpperLower || !hasNumberSymbol) {
      setError("Please follow the password requirements.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_URL}/user/change-password`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otp,
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setStep(4);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {step !== 4 && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Change Password</Text>

          <View style={{ width: 24 }} />
        </View>
      )}

      <View style={styles.card}>
        {step === 4 ? (
          <>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={64} color="#fff" />
            </View>

            <Text style={styles.title}>Password Changed!</Text>
            <Text style={styles.subtitle}>
              Your password has been updated successfully.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Back to Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.iconCircle}>
              <Ionicons
                name={step === 2 ? "mail" : "shield-checkmark"}
                size={42}
                color={ORANGE}
              />
            </View>

            {step === 1 && (
              <>
                <Text style={styles.title}>Verify Current Password</Text>
                <Text style={styles.subtitle}>
                  Enter your current password first. We will send an OTP to your
                  email.
                </Text>

                <PasswordInput
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    setError("");
                  }}
                  visible={showCurrent}
                  setVisible={setShowCurrent}
                  placeholder="Enter current password"
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={styles.button}
                  onPress={sendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>
                  We sent a 6-digit verification code to your email.
                </Text>

                <View style={styles.otpRow}>
                  {otpBoxes.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        otpRefs.current[index] = ref;
                      }}
                      style={[styles.otpBox, digit && styles.otpBoxActive]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                    />
                  ))}
                </View>

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity style={styles.button} onPress={verifyOtpStep}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={sendOtp}
                  disabled={loading || timer > 0}
                >
                  <Text
                    style={[
                      styles.resendText,
                      timer > 0 && styles.resendDisabled,
                    ]}
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === 3 && (
              <>
                <Text style={styles.title}>Create New Password</Text>
                <Text style={styles.subtitle}>
                  Your new password must be strong and secure.
                </Text>

                <PasswordInput
                  label="New Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                  }}
                  visible={showNew}
                  setVisible={setShowNew}
                  placeholder="Enter new password"
                />

                <View style={styles.requirements}>
                  <Requirement
                    valid={hasMinLength}
                    text="At least 8 characters"
                  />
                  <Requirement
                    valid={hasUpperLower}
                    text="Includes uppercase and lowercase"
                  />
                  <Requirement
                    valid={hasNumberSymbol}
                    text="Includes number or symbol"
                  />
                </View>

                <PasswordInput
                  label="Confirm New Password"
                  value={passwordConfirmation}
                  onChangeText={(text) => {
                    setPasswordConfirmation(text);
                    setError("");
                  }}
                  visible={showConfirm}
                  setVisible={setShowConfirm}
                  placeholder="Confirm new password"
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={styles.button}
                  onPress={updatePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Update Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function PasswordInput({
  label,
  value,
  onChangeText,
  visible,
  setVisible,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
  placeholder: string;
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.passwordBox}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
        />

        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={21}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

function Requirement({ valid, text }: { valid: boolean; text: string }) {
  return (
    <View style={styles.requirementRow}>
      <Ionicons
        name={valid ? "checkmark-circle" : "ellipse-outline"}
        size={17}
        color={valid ? "#16A34A" : "#94A3B8"}
      />

      <Text style={[styles.requirementText, valid && styles.requirementValid]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7ED",
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  card: {
    margin: 20,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 28,
    marginBottom: 24,
  },
  title: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  passwordBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  otpBox: {
    width: 45,
    height: 54,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 13,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    backgroundColor: "#fff",
  },
  otpBoxActive: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7ED",
  },
  requirements: {
    marginBottom: 14,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  requirementText: {
    marginLeft: 7,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  requirementValid: {
    color: "#16A34A",
  },
  button: {
    height: 54,
    borderRadius: 15,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  resendText: {
    marginTop: 18,
    textAlign: "center",
    color: ORANGE,
    fontWeight: "800",
  },
  resendDisabled: {
    color: "#94A3B8",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
});
