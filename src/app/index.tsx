import { router } from "expo-router";
import FooterSection from "@/components/FooterSection";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Car = {
  id: number;
  model: string;
  price_per_day: number | string;
  seats?: number | null;
  doors?: number | null;
  images?: string[] | string | null;
  brand?: {
    name?: string | null;
  } | null;
  transmission?: {
    type?: string | null;
  } | null;
};

const ORANGE = "#ff5a1f";
const ORANGE_LIGHT = "#fff7ed";
const DARK = "#0f172a";
const BG = "#f8fafc";
const WHITE = "#ffffff";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const CARD = "#ffffff";

// CHANGE THIS if your PC IP changes
const API_BASE = "http://192.168.8.182:8000";
const CARS_URL = `${API_BASE}/api/landing-cars`;

const steps = [
  {
    number: "01",
    title: "Create Account",
    text: "Sign up in seconds so you can book faster and manage your rentals easily.",
  },
  {
    number: "02",
    title: "Choose a Vehicle",
    text: "Browse available cars and pick the one that matches your trip and budget.",
  },
  {
    number: "03",
    title: "Confirm Booking",
    text: "Complete your reservation and get ready for a smooth driving experience.",
  },
];

const benefits = [
  "Affordable daily rates",
  "Reliable and clean vehicles",
  "Fast booking process",
  "Perfect for city and out-of-town trips",
];

function getImagePath(car: Car): string | null {
  if (!car.images) return null;

  if (Array.isArray(car.images)) {
    const first = car.images[0];
    return first ? `${API_BASE}/storage/${first}` : null;
  }

  try {
    const parsed = JSON.parse(car.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return `${API_BASE}/storage/${parsed[0]}`;
    }
  } catch {
    return null;
  }

  return null;
}

function formatPrice(value: number | string | undefined): string {
  if (value === undefined) return "0";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "0";
  return numeric.toLocaleString();
}

export default function LandingPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carsError, setCarsError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const featuredCars = useMemo(() => cars.slice(0, 6), [cars]);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      setCarsError("");

      const response = await fetch(CARS_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load cars.");
      }

      setCars(Array.isArray(data.cars) ? data.cars : []);
    } catch (error) {
      console.log("Landing cars error:", error);
      setCarsError("Could not load available cars.");
    } finally {
      setLoadingCars(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>EZE Car Rental</Text>
            <Text style={styles.logoSub}>Dumaguete City</Text>
          </View>

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

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Eze Car Rental</Text>
          </View>

          <Text style={styles.heroTitle}>
            Drive Dumaguete with{"\n"}
            <Text style={styles.heroAccent}>Comfort & Confidence</Text>
          </Text>

          <Text style={styles.heroDescription}>
            Premium and affordable car rentals for city rides, airport pickup,
            family trips, and island adventures.
          </Text>

          <View style={styles.ctaColumn}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.primaryText}>Book Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push("/cars")}
            >
              <Text style={styles.secondaryText}>Explore Cars</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroImageWrap}>
            <Image
              source={require("../../assets/images/toyota bg.png")}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricNumber}>24/7</Text>
              <Text style={styles.metricLabel}>Support</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricNumber}>{featuredCars.length || 6}</Text>
              <Text style={styles.metricLabel}>Featured Cars</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricNumber}>Fast</Text>
              <Text style={styles.metricLabel}>Booking</Text>
            </View>
          </View>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Quick Booking Preview</Text>
          <Text style={styles.previewTitle}>
            Simple mobile-first reservation flow
          </Text>
          <Text style={styles.previewText}>
            Let users discover your service immediately with a clear hero,
            stronger calls to action, and featured vehicles from your backend.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Why Choose Us</Text>
          <Text style={styles.sectionTitle}>Built for easier booking</Text>

          <View style={styles.benefitGrid}>
            {benefits.map((item) => (
              <View key={item} style={styles.benefitCard}>
                <View style={styles.bullet} />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Brands</Text>
          <Text style={styles.sectionTitle}>Trusted car brands</Text>

          <View style={styles.brandGrid}>
            <View style={styles.brandCard}>
              <Image
                source={require("../../assets/images/toyota1.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.brandText}>Toyota</Text>
            </View>

            <View style={styles.brandCard}>
              <Image
                source={require("../../assets/images/fordlogo.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.brandText}>Ford</Text>
            </View>

            <View style={styles.brandCard}>
              <Image
                source={require("../../assets/images/mishubishi.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.brandText}>Mitsubishi</Text>
            </View>

            <View style={styles.brandCard}>
              <Image
                source={require("../../assets/images/nissanlogo.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.brandText}>Nissan</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionLabel}>Popular Cars</Text>
              <Text style={styles.sectionTitle}>Featured vehicles</Text>
            </View>

            <TouchableOpacity onPress={() => router.push("/cars")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {loadingCars ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={ORANGE} />
              <Text style={styles.loadingText}>Loading available cars...</Text>
            </View>
          ) : carsError ? (
            <View style={styles.loadingCard}>
              <Text style={styles.errorText}>{carsError}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={fetchCars}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : featuredCars.length === 0 ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>No cars available right now.</Text>
            </View>
          ) : (
            featuredCars.map((car) => {
              const imageUri = getImagePath(car);
              const title = `${car.brand?.name ?? ""} ${car.model}`.trim();

              return (
                <View key={car.id} style={styles.carCard}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.carImage} />
                  ) : (
                    <View style={[styles.carImage, styles.noImageWrap]}>
                      <Text style={styles.noImageText}>No Image</Text>
                    </View>
                  )}

                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeAmount}>
                      ₱{formatPrice(car.price_per_day)}
                    </Text>
                    <Text style={styles.priceBadgeLabel}> / day</Text>
                  </View>

                  <View style={styles.carContent}>
                    <View style={styles.carTopRow}>
                      <Text style={styles.carTitle}>{title || "Car"}</Text>

                      <View style={styles.ratingPill}>
                        <Text style={styles.ratingStar}>★</Text>
                        <Text style={styles.ratingText}>4.8</Text>
                      </View>
                    </View>

                    <View style={styles.carMetaRow}>
                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>
                          {car.doors ?? 4} Doors
                        </Text>
                      </View>

                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>
                          {car.transmission?.type ?? "Automatic"}
                        </Text>
                      </View>

                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>
                          {car.seats ?? 4} Seats
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.rentBtn}
                      onPress={() => router.push("/login")}
                    >
                      <Text style={styles.rentBtnText}>Rent Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How It Works</Text>
          <Text style={styles.sectionTitle}>Book in 3 easy steps</Text>

          {steps.map((step) => (
            <View key={step.number} style={styles.stepCard}>
              <View style={styles.stepTopRow}>
                <View style={styles.stepNumberWrap}>
                  <Text style={styles.stepNumber}>{step.number}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaBanner}>
          <Text style={styles.ctaBannerTitle}>Ready for your next ride?</Text>
          <Text style={styles.ctaBannerText}>
            Create your account and start booking with EZE Car Rental today.
          </Text>

          <TouchableOpacity
            style={styles.ctaBannerBtn}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.ctaBannerBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
    color: DARK,
    letterSpacing: 0.2,
  },
  logoSub: {
    marginTop: 2,
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    backgroundColor: WHITE,
  },
  loginText: {
    color: DARK,
    fontWeight: "700",
    fontSize: 13,
  },
  registerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: ORANGE,
  },
  registerText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: DARK,
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: "#fdba74",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: WHITE,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 42,
    marginBottom: 12,
  },
  heroAccent: {
    color: "#fb923c",
  },
  heroDescription: {
    color: "#e2e8f0",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 22,
  },
  ctaColumn: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  secondaryText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 15,
  },
  heroImageWrap: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },
  heroImage: {
    width: "100%",
    height: 220,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  metricNumber: {
    color: WHITE,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  metricLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  previewCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  previewLabel: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: DARK,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionLabel: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: DARK,
    marginBottom: 16,
  },
  viewAllText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 18,
  },
  benefitGrid: {
    gap: 12,
  },
  benefitCard: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: ORANGE,
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  brandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  brandCard: {
    width: "47%",
    backgroundColor: WHITE,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  brandLogo: {
    width: 80,
    height: 44,
    marginBottom: 10,
  },
  brandText: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
  },
  loadingCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: DARK,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: ORANGE,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: WHITE,
    fontWeight: "700",
  },
  carCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    overflow: "hidden",
  },
  carImage: {
    width: "100%",
    height: 210,
    backgroundColor: "#e2e8f0",
  },
  noImageWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: MUTED,
    fontWeight: "700",
  },
  priceBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceBadgeAmount: {
    color: ORANGE,
    fontWeight: "800",
    fontSize: 16,
  },
  priceBadgeLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
  },
  carContent: {
    padding: 18,
  },
  carTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  carTitle: {
    flex: 1,
    color: DARK,
    fontSize: 20,
    fontWeight: "800",
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: ORANGE_LIGHT,
  },
  ratingStar: {
    color: "#f59e0b",
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    color: DARK,
    fontSize: 13,
    fontWeight: "700",
  },
  carMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  metaPill: {
    backgroundColor: "#f8fafc",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metaPillText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  rentBtn: {
    backgroundColor: DARK,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  rentBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
  },
  stepCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  stepTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepNumberWrap: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: ORANGE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumber: {
    color: ORANGE,
    fontWeight: "800",
    fontSize: 13,
  },
  stepTitle: {
    flex: 1,
    color: DARK,
    fontSize: 18,
    fontWeight: "700",
  },
  stepText: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 22,
  },
  ctaBanner: {
    backgroundColor: ORANGE,
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
  },
  ctaBannerTitle: {
    color: WHITE,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  ctaBannerText: {
    color: "#ffedd5",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  ctaBannerBtn: {
    backgroundColor: WHITE,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaBannerBtnText: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: "800",
  },
});