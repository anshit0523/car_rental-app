import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../lib/api/config";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";

type Rental = {
  id: number;
  pickup_at: string;
  return_at: string;
  total_price: number;
  final_total: number;
  status?: { name?: string };
  car?: {
    brand?: string;
    model?: string;
    fuel_type?: string;
    transmission?: string;
    images?: string[];
  };
};

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending Payment Verification" },
  { label: "Upcoming", value: "Confirmed" },
  { label: "Active", value: "Active" },
  { label: "Return", value: "return_group" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Failed", value: "Failed" },
];

const RETURN_STATUSES = ["Return", "Checkup", "Damage", "Needs Repair"];

function getStatusStyle(status?: string) {
  const name = (status || "").toLowerCase();

  if (name.includes("confirmed") || name.includes("active")) {
    return { backgroundColor: "#DCFCE7", color: "#166534" };
  }

  if (name.includes("pending")) {
    return { backgroundColor: "#FEF3C7", color: "#92400E" };
  }

  if (name.includes("completed")) {
    return { backgroundColor: "#DBEAFE", color: "#1D4ED8" };
  }

  if (
    name.includes("return") ||
    name.includes("checkup") ||
    name.includes("damage") ||
    name.includes("needs repair")
  ) {
    return { backgroundColor: "#FFEDD5", color: "#C2410C" };
  }

  if (name.includes("cancelled") || name.includes("failed")) {
    return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
  }

  return { backgroundColor: "#F1F5F9", color: "#475569" };
}

export default function RentalsScreen() {
  const { booking_id } = useLocalSearchParams();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const autoOpenedBookingId = useRef<string | null>(null);

  useEffect(() => {
    fetchRentals(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!booking_id || rentals.length === 0) return;

    const bookingIdString = Array.isArray(booking_id)
      ? booking_id[0]
      : booking_id;

    if (autoOpenedBookingId.current === bookingIdString) return;

    const selectedRental = rentals.find(
      (item) => String(item.id) === String(bookingIdString)
    );

    if (selectedRental) {
      autoOpenedBookingId.current = bookingIdString;

      router.push({
        pathname: "/rental-details",
        params: { rentalId: String(selectedRental.id) },
      });
    }
  }, [booking_id, rentals]);

  const fetchRentals = async (status: string) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      const shouldFetchAll = status === "all" || status === "return_group";

      const url = shouldFetchAll
        ? `${API_URL}/rentals`
        : `${API_URL}/rentals?status=${encodeURIComponent(status)}`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success) {
        const rentalList = data.bookings?.data || data.bookings || [];

        if (status === "return_group") {
          setRentals(
            rentalList.filter((rental: Rental) =>
              RETURN_STATUSES.includes(rental.status?.name || "")
            )
          );
          return;
        }

        setRentals(rentalList);
      }
    } catch (error) {
      console.log("Rentals error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRentals(activeTab);
  };

  const formatAmount = (amount?: number) => {
    return `₱${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openRentalDetails = (rental: Rental) => {
    router.push({
      pathname: "/rental-details",
      params: { rentalId: String(rental.id) },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading rentals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Rentals</Text>
          </View>

          <View style={styles.calendarIcon}>
            <Ionicons name="calendar-outline" size={24} color={ORANGE} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.chip,
                activeTab === tab.value && styles.chipActive,
              ]}
              onPress={() => {
                setLoading(true);
                setActiveTab(tab.value);
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  activeTab === tab.value && styles.chipTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {rentals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="car-outline" size={42} color={ORANGE} />
            <Text style={styles.emptyTitle}>No rentals found</Text>
            <Text style={styles.emptyText}>
              Your bookings with this status will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {rentals.map((rental) => {
              const statusName = rental.status?.name || "N/A";
              const statusStyle = getStatusStyle(statusName);
              const carName =
                `${rental.car?.brand || ""} ${rental.car?.model || ""}`.trim();
              const imageUrl = rental.car?.images?.[0];

              return (
                <TouchableOpacity
                  key={rental.id}
                  style={[
                    styles.rentalCard,
                    String(rental.id) === String(booking_id) &&
                      styles.highlightCard,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => openRentalDetails(rental)}
                >
                  <View style={styles.rentalTop}>
                    <View style={styles.carImageBox}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.carImage}
                        />
                      ) : (
                        <Ionicons
                          name="car-sport-outline"
                          size={34}
                          color={ORANGE}
                        />
                      )}
                    </View>

                    <View style={styles.rentalInfo}>
                      <Text style={styles.carName}>
                        {carName || "Car Booking"}
                      </Text>
                      <Text style={styles.amount}>
                        {formatAmount(rental.final_total || rental.total_price)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusStyle.color },
                        ]}
                      >
                        {statusName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <Ionicons
                        name="log-in-outline"
                        size={18}
                        color={ORANGE}
                      />
                      <View>
                        <Text style={styles.detailLabel}>Pickup</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(rental.pickup_at)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailBox}>
                      <Ionicons
                        name="log-out-outline"
                        size={18}
                        color={ORANGE}
                      />
                      <View>
                        <Text style={styles.detailLabel}>Return</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(rental.return_at)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.footerRow}>
                    <Text style={styles.bookingId}>Booking #{rental.id}</Text>

                    <View style={styles.viewDetails}>
                      <Text style={styles.viewDetailsText}>View Details</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={ORANGE}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF7ED",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 18,
    paddingBottom: 110,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: MUTED,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: DARK,
  },
  calendarIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    gap: 10,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  chipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "800",
    color: MUTED,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: DARK,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 21,
  },
  list: {
    marginTop: 4,
  },
  rentalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  highlightCard: {
    borderColor: ORANGE,
    backgroundColor: "#FFFBF7",
  },
  rentalTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  carImageBox: {
    width: 72,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  carImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  rentalInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontWeight: "900",
    color: DARK,
    marginBottom: 4,
  },
  amount: {
    fontSize: 14,
    color: ORANGE,
    fontWeight: "900",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    maxWidth: 110,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  detailBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "700",
  },
  detailValue: {
    fontSize: 12,
    color: DARK,
    fontWeight: "900",
    marginTop: 2,
  },
  footerRow: {
    marginTop: 13,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bookingId: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "800",
  },
  viewDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: "900",
  },
});