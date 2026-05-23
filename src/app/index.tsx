import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>EZE</Text>
        </View>

        <Text style={styles.title}>Dumaguete EZE Car Rental</Text>
        <Text style={styles.subtitle}>
          Book reliable rental cars, upload payment receipts, and monitor your rentals in one app.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fast. Simple. Reliable.</Text>
          <Text style={styles.cardText}>
            Browse available cars, reserve your rental schedule, and track your booking status anytime.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/home" asChild>
          <TouchableOpacity>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const ORANGE = "#F97316";
const DARK = "#0F172A";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7ED",
    padding: 24,
    justifyContent: "space-between",
  },
  hero: {
    flex: 1,
    justifyContent: "center",
  },
  logoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    color: DARK,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#475569",
    marginBottom: 26,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    paddingBottom: 12,
  },
  primaryButton: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FDBA74",
  },
  secondaryButtonText: {
    color: ORANGE,
    fontWeight: "800",
    fontSize: 16,
  },
  guestText: {
    textAlign: "center",
    color: "#64748B",
    fontWeight: "700",
    marginTop: 4,
  },
});