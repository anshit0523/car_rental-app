import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.title}>Dumaguete EZE</Text>
          </View>

          <View style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color={DARK} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>Car Rental Made Easy</Text>
            <Text style={styles.heroTitle}>
              Find and book your rental car today.
            </Text>
            <Text style={styles.heroText}>
              Browse available vehicles, reserve your schedule, and upload your
              payment receipt.
            </Text>

            <Link href="/(tabs)/browse" asChild>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Browse Cars</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons name="car-sport" size={54} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Rentals</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Pending Payments</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickGrid}>
          <Link href="/(tabs)/browse" asChild>
            <TouchableOpacity style={styles.quickCard}>
              <View style={styles.quickIcon}>
                <Ionicons name="car-outline" size={22} color={ORANGE} />
              </View>
              <Text style={styles.quickTitle}>Browse Cars</Text>
              <Text style={styles.quickText}>View available vehicles</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/payments" asChild>
            <TouchableOpacity style={styles.quickCard}>
              <View style={styles.quickIcon}>
                <Ionicons name="wallet-outline" size={22} color={ORANGE} />
              </View>
              <Text style={styles.quickTitle}>Payments</Text>
              <Text style={styles.quickText}>Upload payment proof</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/rentals" asChild>
            <TouchableOpacity style={styles.quickCard}>
              <View style={styles.quickIcon}>
                <Ionicons name="calendar-outline" size={22} color={ORANGE} />
              </View>
              <Text style={styles.quickTitle}>My Rentals</Text>
              <Text style={styles.quickText}>Track your bookings</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/profile" asChild>
            <TouchableOpacity style={styles.quickCard}>
              <View style={styles.quickIcon}>
                <Ionicons name="person-outline" size={22} color={ORANGE} />
              </View>
              <Text style={styles.quickTitle}>Profile</Text>
              <Text style={styles.quickText}>Manage account</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.sectionTitle}>Current Rental</Text>

        <View style={styles.rentalCard}>
          <View style={styles.carPlaceholder}>
            <Ionicons name="car-sport-outline" size={38} color={ORANGE} />
          </View>

          <View style={styles.rentalInfo}>
            <Text style={styles.rentalTitle}>Toyota Camry</Text>
            <Text style={styles.rentalText}>Pickup: May 10, 2026</Text>
            <Text style={styles.rentalText}>Return: May 12, 2026</Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 20,
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: DARK,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 2,
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: ORANGE,
    position: "absolute",
    top: 11,
    right: 12,
  },
  heroCard: {
    marginTop: 22,
    backgroundColor: ORANGE,
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    overflow: "hidden",
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    color: "#FFEDD5",
    fontWeight: "800",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  heroText: {
    color: "#FFF7ED",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  heroButton: {
    marginTop: 18,
    backgroundColor: DARK,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  heroIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    alignSelf: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: DARK,
  },
  statLabel: {
    fontSize: 11,
    color: MUTED,
    marginTop: 3,
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  quickTitle: {
    color: DARK,
    fontWeight: "900",
    fontSize: 15,
  },
  quickText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  rentalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
  },
  carPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  rentalInfo: {
    flex: 1,
    marginLeft: 14,
  },
  rentalTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: "900",
  },
  rentalText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 9,
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "800",
  },
});