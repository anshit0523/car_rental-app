import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../lib/api/config";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";

export default function CarDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/cars/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCar(data.car);
      }
    } catch (error) {
      console.log("Car details error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading car details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!car) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Car details not found.</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => router.back()}>
            <Text style={styles.bookButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const imageUrl = car.images?.[0];
  const carName = `${car.brand?.name ?? ""} ${car.model ?? ""}`.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Car Details</Text>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color={DARK} />
          </TouchableOpacity>
        </View>

        <View style={styles.carImage}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <Ionicons name="car-sport" size={100} color={ORANGE} />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.carName}>{carName || "N/A"}</Text>
              <Text style={styles.carType}>
                {car.car_type?.type || car.car_type?.name || "Car"}
              </Text>
            </View>

            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Available</Text>
            </View>
          </View>

          <Text style={styles.price}>
            ₱{Number(car.price_per_day || 0).toLocaleString()} / day
          </Text>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Ionicons name="people-outline" size={22} color={ORANGE} />
              <Text style={styles.specValue}>{car.seats || "N/A"}</Text>
              <Text style={styles.specLabel}>Seats</Text>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="settings-outline" size={22} color={ORANGE} />
              <Text style={styles.specValue}>
                {car.transmission?.type || "N/A"}
              </Text>
              <Text style={styles.specLabel}>Transmission</Text>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="speedometer-outline" size={22} color={ORANGE} />
              <Text style={styles.specValue}>{car.fuel_type?.type || "N/A"}</Text>
              <Text style={styles.specLabel}>Fuel</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            A comfortable and reliable rental car suitable for city travel,
            business trips, family use, and daily transportation.
          </Text>

          <Text style={styles.sectionTitle}>Rental Includes</Text>

          {[
            "Clean and ready-to-use vehicle",
            "Booking status monitoring",
            "Payment receipt verification",
            "Customer support",
          ].map((item) => (
            <View style={styles.includeItem} key={item}>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              <Text style={styles.includeText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total per day</Text>
          <Text style={styles.footerPrice}>
            ₱{Number(car.price_per_day || 0).toLocaleString()}
          </Text>
        </View>

        <Link
          href={{
            pathname: "/booking-form",
            params: { carId: String(car.id) },
          }}
          asChild
        >
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 120,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    color: MUTED,
    fontWeight: "700",
  },
  errorText: {
    color: DARK,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  topTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: DARK,
  },
  carImage: {
    height: 220,
    marginTop: 20,
    backgroundColor: "#FFF7ED",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  card: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  carName: {
    fontSize: 25,
    fontWeight: "900",
    color: DARK,
  },
  carType: {
    color: MUTED,
    marginTop: 4,
    fontWeight: "700",
  },
  availableBadge: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    height: 32,
  },
  availableText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "900",
  },
  price: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: ORANGE,
  },
  specGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  specItem: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },
  specValue: {
    marginTop: 8,
    color: DARK,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  specLabel: {
    marginTop: 3,
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 8,
    color: DARK,
    fontSize: 17,
    fontWeight: "900",
  },
  description: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },
  includeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 10,
  },
  includeText: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "800",
  },
  footerPrice: {
    marginTop: 2,
    color: ORANGE,
    fontSize: 19,
    fontWeight: "900",
  },
  bookButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
});