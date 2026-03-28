import { router } from "expo-router";
import FooterSection from "@/components/FooterSection";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LandingPage() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>EZE Car Rental</Text>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.subtitle}>Eze Car Rental</Text>
          <Text style={styles.title}>
            Drive Dumaguete with{"\n"}
            <Text style={styles.orange}>Comfort & Confidence</Text>
          </Text>
          <Text style={styles.description}>
            Premium and affordable car rentals for your next city ride,
            out-of-town trip, or island adventure.
          </Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Book Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Explore Cars</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Booking Preview</Text>
          <Text style={styles.cardText}>
            Static UI first. We will turn your web landing page into mobile next.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How It Works</Text>
          <Text style={styles.sectionTitle}>How it works</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Sign up Account</Text>
            <Text style={styles.infoText}>
              Create your account to start booking quickly and easily.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Search your Vehicle</Text>
            <Text style={styles.infoText}>
              Browse the available cars and choose the best one for your trip.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Pay the Car Rent</Text>
            <Text style={styles.infoText}>
              Confirm your reservation and complete the payment securely.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Take Car to Road</Text>
            <Text style={styles.infoText}>
              Pick up the car and enjoy a smooth ride on your journey.
            </Text>
          </View>
        </View>

        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const ORANGE = "#ff5a1f";
const DARK = "#0f172a";
const BG = "#f8fafc";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: DARK,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  loginBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  loginText: {
    color: DARK,
    fontWeight: "600",
  },
  registerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: ORANGE,
  },
  registerText: {
    color: "#fff",
    fontWeight: "600",
  },
  hero: {
    backgroundColor: DARK,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  subtitle: {
    color: "#fb923c",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 12,
  },
  orange: {
    color: "#fb923c",
  },
  description: {
    color: "#e5e7eb",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  secondaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: DARK,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  section: {
    marginTop: 8,
  },
  sectionLabel: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: DARK,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: DARK,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 21,
  },
});