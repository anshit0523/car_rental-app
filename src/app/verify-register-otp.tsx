import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
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

export default function VerifyRegisterOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (value: string, index: number) => {
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

  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/register/verify-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert("Verification Failed", data.message || "Invalid OTP.");
        return;
      }

      if (data.token) {
        await AsyncStorage.setItem("auth_token", data.token);
      }

      Alert.alert("Success", "Your account has been verified.", [
        {
          text: "Continue",
          onPress: () => router.replace("/(tabs)/browse"),
        },
      ]);
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color={DARK} />
          </TouchableOpacity>
        </View>

        <Image
          source={require("../../assets/images/logos.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Verify <Text style={styles.orangeText}>Your Email</Text>
        </Text>

        <Text style={styles.subtitle}>We sent a 6-digit code to:</Text>
        <Text style={styles.emailText}>{email || "your email"}</Text>

        <View style={styles.iconWrap}>
          <Ionicons name="mail-open-outline" size={64} color={ORANGE} />
        </View>

        <Text style={styles.inputLabel}>Enter the 6-digit code</Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
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

        <TouchableOpacity
          style={[styles.verifyButton, loading && { opacity: 0.7 }]}
          onPress={verifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.verifyButtonText}>Verify Account</Text>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Didn’t receive the code?</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.resendButton}>
          <Ionicons name="refresh" size={21} color={ORANGE} />
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.changeEmailButton} onPress={changeEmail}>
          <View style={styles.changeEmailIcon}>
            <Ionicons name="mail-outline" size={22} color={ORANGE} />
          </View>

          <Text style={styles.changeEmailText}>Change Email</Text>

          <Ionicons name="chevron-forward" size={22} color={MUTED} />
        </TouchableOpacity>

        <View style={styles.securityBox}>
          <Ionicons name="lock-closed-outline" size={22} color={MUTED} />
          <Text style={styles.securityText}>
            For your security, this code will expire soon. Do not share this code
            with anyone.
          </Text>
        </View>
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
    paddingHorizontal: 22,
    paddingBottom: 34,
  },
  topBar: {
    height: 54,
    justifyContent: "center",
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 118,
    height: 96,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 28,
  },
  title: {
    color: DARK,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  orangeText: {
    color: ORANGE,
  },
  subtitle: {
    marginTop: 28,
    color: MUTED,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  emailText: {
    marginTop: 10,
    color: DARK,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  iconWrap: {
    width: 126,
    height: 126,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 28,
    marginBottom: 28,
  },
  inputLabel: {
    color: MUTED,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FED7AA",
    color: DARK,
    fontSize: 24,
    fontWeight: "900",
  },
  otpBoxActive: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7ED",
  },
  verifyButton: {
    marginTop: 30,
    height: 58,
    borderRadius: 17,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    shadowColor: ORANGE,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  dividerRow: {
    marginTop: 28,
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
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
  },
  resendButton: {
    marginTop: 18,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignSelf: "center",
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  resendText: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: "900",
  },
  changeEmailButton: {
    marginTop: 22,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 13,
  },
  changeEmailIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  changeEmailText: {
    flex: 1,
    color: DARK,
    fontSize: 16,
    fontWeight: "800",
  },
  securityBox: {
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  securityText: {
    flex: 1,
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },
});