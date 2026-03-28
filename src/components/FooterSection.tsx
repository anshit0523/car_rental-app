import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ORANGE = "#ff5a1f";
const DARK = "#020617";

export default function FooterSection() {
  return (
    <View style={styles.footer}>
      <View style={styles.topSection}>
        <View style={styles.block}>
          <Text style={styles.logo}>EZE Car Rental</Text>
          <Text style={styles.description}>
            Dumaguete EZE Car Rental provides clean, reliable, and affordable
            vehicles for locals and travelers.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.heading}>Quick Links</Text>

          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.link}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.link}>Available Cars</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.block}>
          <Text style={styles.heading}>Contact</Text>

          <View style={styles.contactRow}>
            <Ionicons name="location-sharp" size={16} color={ORANGE} />
            <Text style={styles.contactText}>
              Mangnao Dumaguete City, Philippines
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="call" size={16} color={ORANGE} />
            <Text style={styles.contactText}>0981-225-5442</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="mail" size={16} color={ORANGE} />
            <Text style={styles.contactText}>EZECARRENTAL@gmail.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.copyright}>
          © 2026 Dumaguete EZE Car Rental. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: DARK,
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
  },
  topSection: {
    gap: 24,
  },
  block: {
    gap: 10,
  },
  logo: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 22,
  },
  heading: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  link: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  contactText: {
    flex: 1,
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 22,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginTop: 24,
    paddingTop: 16,
  },
  copyright: {
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
});