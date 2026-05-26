import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";
const SOFT_BG = "#FFF7ED";

export default function WelcomeScreen() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("auth_token");

    if (token) {
      router.replace("/(tabs)/browse");
      return;
    }

    setChecking(false);
  };

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorCircleTop} />
      <View style={styles.decorCircleBottom} />
      <View style={styles.decorSmallDotOne} />
      <View style={styles.decorSmallDotTwo} />

      <View style={styles.hero}>
        <Image
          source={require("../../assets/images/logos.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.welcomeText}>Welcome to</Text>

        <Text style={styles.title}>
          Dumaguete{"\n"}
          <Text style={styles.orangeText}>EZE</Text> Car Rental
        </Text>

        <View style={styles.titleLine} />

        
      </View>

      <View style={styles.card}>
        <View style={styles.featureTop}>
          <View style={styles.featureIcon}>
            <Ionicons name="car-sport-outline" size={30} color={ORANGE} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Fast. Simple. Reliable.</Text>
            <Text style={styles.cardText}>
              Browse cars, reserve your schedule, upload receipts, and track
              your booking status anytime.
            </Text>
          </View>
        </View>

        <Link href="/login" asChild>
          <TouchableOpacity activeOpacity={0.88} style={styles.primaryButton}>
            <View style={styles.buttonIcon}>
              <Ionicons name="log-in-outline" size={24} color={ORANGE} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.primaryButtonText}>Login</Text>
              <Text style={styles.primaryButtonSub}>
                Welcome back! Sign in to continue.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={25} color="#FFFFFF" />
          </TouchableOpacity>
        </Link>

        <Link href="/register" asChild>
          <TouchableOpacity activeOpacity={0.88} style={styles.secondaryButton}>
            <View style={styles.secondaryIcon}>
              <Ionicons name="person-add-outline" size={23} color={ORANGE} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
              <Text style={styles.secondaryButtonSub}>
                Create a new account to get started.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={25} color={ORANGE} />
          </TouchableOpacity>
        </Link>

        <View style={styles.benefits}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={23}
                color={ORANGE}
              />
            </View>
            <Text style={styles.benefitTitle}>Trusted</Text>
            <Text style={styles.benefitText}>Safe rentals</Text>
          </View>

          <View style={styles.benefitDivider} />

          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="car-outline" size={23} color={ORANGE} />
            </View>
            <Text style={styles.benefitTitle}>Quality</Text>
            <Text style={styles.benefitText}>Clean vehicles</Text>
          </View>

          <View style={styles.benefitDivider} />

          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="headset-outline" size={23} color={ORANGE} />
            </View>
            <Text style={styles.benefitTitle}>Support</Text>
            <Text style={styles.benefitText}>Ready to help</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: SOFT_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFBF7",
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  decorCircleTop: {
    position: "absolute",
    right: -86,
    top: 104,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#FFEDD5",
    opacity: 0.18,
  },
  decorCircleBottom: {
    position: "absolute",
    left: -92,
    bottom: -76,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "#FED7AA",
    opacity: 0.16,
  },
  decorSmallDotOne: {
    position: "absolute",
    right: 44,
    top: 154,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#FDBA74",
    opacity: 0.32,
  },
  decorSmallDotTwo: {
    position: "absolute",
    right: 68,
    top: 176,
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#FDBA74",
    opacity: 0.25,
  },
  hero: {
    flex: 1,
    paddingTop: 18,
    justifyContent: "center",
  },
  logo: {
    width: 112,
    height: 92,
    marginBottom: 22,
  },
  welcomeText: {
    color: "#FB923C",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  title: {
    color: DARK,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  orangeText: {
    color: ORANGE,
  },
  titleLine: {
    width: 72,
    height: 4,
    borderRadius: 999,
    backgroundColor: ORANGE,
    marginTop: 20,
    marginBottom: 20,
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
    maxWidth: 330,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE4CC",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  featureTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  featureIcon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: DARK,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "900",
    marginBottom: 5,
  },
  cardText: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  primaryButton: {
    minHeight: 72,
    borderRadius: 22,
    backgroundColor: ORANGE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 14,
    marginBottom: 12,
    shadowColor: ORANGE,
    shadowOpacity: 0.2,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  primaryButtonSub: {
    color: "#FFF7ED",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
  secondaryButton: {
    minHeight: 70,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FDBA74",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 14,
  },
  secondaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryButtonSub: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
  benefits: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  benefitItem: {
    flex: 1,
    alignItems: "center",
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  benefitTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: "900",
  },
  benefitText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
    textAlign: "center",
  },
  benefitDivider: {
    width: 1,
    height: 54,
    backgroundColor: "#FED7AA",
  },
});
