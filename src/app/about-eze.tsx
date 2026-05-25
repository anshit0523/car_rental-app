

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";
const GREEN = "#15803D";

export default function AboutEzeScreen() {
  const callSupport = () => {
    Linking.openURL("tel:09812255442");
  };

  const messageSupport = () => {
    Linking.openURL("sms:09812255442");
  };

  const featureCards = [
    {
      icon: "location",
      title: "Local Service",
      text: "Proudly serving Dumaguete City and nearby areas with dedication.",
    },
    {
      icon: "car-sport",
      title: "Reliable Vehicles",
      text: "Well-maintained cars for a safe and comfortable journey.",
    },
    {
      icon: "calendar",
      title: "Easy Booking",
      text: "Simple and fast booking process anytime, anywhere.",
    },
    {
      icon: "headset",
      title: "Responsive Support",
      text: "Quick and friendly assistance for your rental concerns.",
    },
  ] as const;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={DARK} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>About EZE</Text>

          <View style={styles.placeholder} />
        </View>

        <View style={styles.hero}>
          <View style={styles.logoGlow}>
            <Image
              source={require("../../assets/images/logos.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandTitle}>Dumaguete EZE Car Rental</Text>

          <Text style={styles.brandSubtitle}>
            Reliable and affordable transportation in{" "}
            <Text style={styles.orangeText}>Dumaguete City.</Text>
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {featureCards.map((item, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={item.icon} size={28} color={ORANGE} />
              </View>

              <Text style={styles.featureTitle}>{item.title}</Text>

              <View style={styles.smallLine} />

              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.missionCard}>
          <View style={styles.largeIcon}>
            <Ionicons name="locate" size={34} color={ORANGE} />
          </View>

          <View style={styles.verticalLine} />

          <View style={{ flex: 1 }}>
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              To provide convenient, safe, and affordable car rentals.
            </Text>
          </View>
        </View>

        <View style={styles.visionCard}>
          <View style={[styles.largeIcon, styles.visionIcon]}>
            <Ionicons name="eye" size={34} color={GREEN} />
          </View>

          <View style={[styles.verticalLine, styles.visionLine]} />

          <View style={{ flex: 1 }}>
            <Text style={styles.visionTitle}>Our Vision</Text>
            <Text style={styles.missionText}>
              To become a trusted car rental provider in Dumaguete.
            </Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <View style={styles.supportIcon}>
            <Ionicons name="headset-outline" size={30} color={ORANGE} />
          </View>

          <Text style={styles.supportTitle}>We’re Here for You!</Text>
          <Text style={styles.supportText}>
            Have questions or need assistance? Feel free to reach out to us.
          </Text>

          <View style={styles.supportButtons}>
            <TouchableOpacity style={styles.callButton} onPress={callSupport}>
              <View style={styles.buttonIconCircle}>
                <Ionicons name="call" size={24} color={ORANGE} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.callButtonTitle}>Call Support</Text>
                <Text style={styles.callButtonSub}>0981-225-5442</Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color={ORANGE} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton} onPress={messageSupport}>
              <View style={[styles.buttonIconCircle, styles.messageIconCircle]}>
                <Ionicons name="chatbubble-ellipses" size={23} color="#2563EB" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.messageButtonTitle}>Message Us</Text>
                <Text style={styles.messageButtonSub}>Send SMS</Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerText}>Dumaguete EZE Car Rental App</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFDFB",
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  topBar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: DARK,
  },
  placeholder: {
    width: 44,
  },
  hero: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 24,
  },
  logoGlow: {
    width: 210,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  logo: {
    width: 220,
    height: 180,
  },
  brandTitle: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: "900",
    color: DARK,
    textAlign: "center",
  },
  brandSubtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    textAlign: "center",
    fontWeight: "700",
    paddingHorizontal: 14,
  },
  orangeText: {
    color: ORANGE,
    fontWeight: "900",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  featureIcon: {
    width: 62,
    height: 62,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  smallLine: {
    width: 28,
    height: 3,
    borderRadius: 999,
    backgroundColor: ORANGE,
    marginVertical: 10,
  },
  featureText: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  missionCard: {
    marginTop: 22,
    minHeight: 112,
    backgroundColor: "#FFF7ED",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FED7AA",
    overflow: "hidden",
  },
  visionCard: {
    marginTop: 14,
    minHeight: 112,
    backgroundColor: "#F0FDF4",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    overflow: "hidden",
  },
  largeIcon: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F97316",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  visionIcon: {
    shadowColor: GREEN,
  },
  verticalLine: {
    width: 2,
    height: 68,
    backgroundColor: "#FDBA74",
    marginHorizontal: 16,
  },
  visionLine: {
    backgroundColor: "#86EFAC",
  },
  missionTitle: {
    fontSize: 18,
    color: ORANGE,
    fontWeight: "900",
    marginBottom: 6,
  },
  visionTitle: {
    fontSize: 18,
    color: GREEN,
    fontWeight: "900",
    marginBottom: 6,
  },
  missionText: {
    color: DARK,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  supportCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  supportIcon: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  supportTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: "900",
  },
  supportText: {
    marginTop: 8,
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontWeight: "600",
  },
  supportButtons: {
    width: "100%",
    marginTop: 18,
    gap: 12,
  },
  callButton: {
    minHeight: 64,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  messageButton: {
    minHeight: 64,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buttonIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  messageIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  callButtonTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: "900",
  },
  callButtonSub: {
    color: ORANGE,
    marginTop: 3,
    fontSize: 13,
    fontWeight: "800",
  },
  messageButtonTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: "900",
  },
  messageButtonSub: {
    color: "#2563EB",
    marginTop: 3,
    fontSize: 13,
    fontWeight: "800",
  },
  footerText: {
    marginTop: 22,
    color: MUTED,
    textAlign: "center",
    fontWeight: "700",
  },
  versionText: {
    marginTop: 4,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "700",
  },
});