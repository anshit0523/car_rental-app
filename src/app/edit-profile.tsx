import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

const ORANGE = "#f97316";
const API_URL = "https://car-rental.free.laravel.cloud/api";

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;

  return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
};

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");

  const getToken = async () => {
    return await AsyncStorage.getItem("auth_token");
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load profile.");
        return;
      }

      const user = data.user || data;

      setName(user.name || "");
      setEmail(user.email || "");
      setPhone((user.phone || "").replace(/\D/g, "").slice(0, 11));
      setAddress(user.address || "");
    } catch {
      setError("Something went wrong while loading profile.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (phone && phone.length !== 11) {
      setError("Phone number must be exactly 11 digits.");
      return;
    }

    if (phone && !/^09\d{9}$/.test(phone)) {
      setError("Phone number must start with 09.");
      return;
    }

    try {
      setSaving(true);
      const token = await getToken();

      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          address: address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      Alert.alert("Profile Updated", "Your profile has been updated successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      setError("Something went wrong while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={ORANGE} />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : (
            <>
              <View style={styles.topCard}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={52} color="#fff" />
                </View>

                <View style={styles.topTextBox}>
                  <Text style={styles.topTitle}>Update your information</Text>
                  <Text style={styles.topSubtitle}>
                    Make changes to your profile information below.
                  </Text>
                </View>
              </View>

              <View style={styles.formCard}>
                <ProfileInput
                  label="Name"
                  icon="person-outline"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setError("");
                  }}
                  placeholder="Enter your name"
                />

                <ProfileInput
                  label="Email"
                  icon="mail-outline"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  editable={false}
                  helperText="Email cannot be changed"
                />

                <ProfileInput
                  label="Phone Number"
                  icon="call-outline"
                  value={formatPhoneNumber(phone)}
                  onChangeText={(text) => {
                    const digitsOnly = text.replace(/\D/g, "").slice(0, 11);
                    setPhone(digitsOnly);
                    setError("");
                  }}
                  placeholder="0912-122-1111"
                  keyboardType="phone-pad"
                  helperText="11 digits only, example: 0912-122-1111"
                />

                <ProfileInput
                  label="Address"
                  icon="location-outline"
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                    setError("");
                  }}
                  placeholder="Enter address"
                  multiline
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.button, saving && styles.buttonDisabled]}
                  onPress={updateProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="save-outline" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Update Profile</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProfileInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  editable = true,
  helperText,
  keyboardType = "default",
  multiline = false,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  editable?: boolean;
  helperText?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputBox,
          !editable && styles.disabledInput,
          multiline && styles.textareaBox,
        ]}
      >
        <Ionicons name={icon} size={21} color={ORANGE} />

        <TextInput
          style={[styles.input, multiline && styles.textarea]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={editable}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {!!helperText && <Text style={styles.helperText}>{helperText}</Text>}
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
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#FED7AA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingBox: {
    marginTop: 80,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontWeight: "700",
  },
  topCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  topTextBox: {
    flex: 1,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 5,
  },
  topSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 8,
  },
  inputBox: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 15,
    paddingHorizontal: 13,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  disabledInput: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    marginLeft: 10,
    paddingVertical: 10,
  },
  textareaBox: {
    minHeight: 95,
    alignItems: "flex-start",
    paddingTop: 13,
  },
  textarea: {
    minHeight: 70,
  },
  helperText: {
    marginTop: 7,
    fontSize: 12,
    color: ORANGE,
    fontWeight: "700",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
});