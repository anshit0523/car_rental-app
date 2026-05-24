import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
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
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Failed", value: "Failed" },
];

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

  if (name.includes("cancelled") || name.includes("failed")) {
    return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
  }

  return { backgroundColor: "#F1F5F9", color: "#475569" };
}

export default function RentalsScreen() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRentals(activeTab);
  }, [activeTab]);

  const fetchRentals = async (status: string) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      const url =
        status === "all"
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
        setRentals(data.bookings?.data || []);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading rentals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.pageLabel}>Rentals</Text>
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
                <View key={rental.id} style={styles.rentalCard}>
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

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="settings-outline"
                        size={15}
                        color={MUTED}
                      />
                      <Text style={styles.metaText}>
                        {rental.car?.transmission || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons name="flame-outline" size={15} color={MUTED} />
                      <Text style={styles.metaText}>
                        {rental.car?.fuel_type || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timelineBox}>
                    <View style={styles.timelineItem}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={ORANGE}
                      />
                      <View>
                        <Text style={styles.timelineLabel}>Pickup</Text>
                        <Text style={styles.timelineValue}>
                          {formatDate(rental.pickup_at)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timelineItem}>
                      <Ionicons name="flag-outline" size={18} color={ORANGE} />
                      <View>
                        <Text style={styles.timelineLabel}>Return</Text>
                        <Text style={styles.timelineValue}>
                          {formatDate(rental.return_at)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.outlineButton}
                      onPress={() =>
                        router.push({
                          pathname: "/rental-details",
                          params: { rentalId: String(rental.id) },
                        })
                      }
                    >
                      <Text style={styles.outlineButtonText}>View Details</Text>
                    </TouchableOpacity>

                    {statusName === "Pending Payment" && (
                      <TouchableOpacity style={styles.payButton}>
                        <Text style={styles.payButtonText}>Pay Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
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
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 20,
    paddingBottom: 90,
  },
  center: {
    flex: 1,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: MUTED,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageLabel: {
    color: MUTED,
    fontWeight: "700",
  },
  title: {
    color: DARK,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },
  calendarIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    gap: 10,
    paddingVertical: 20,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  chipText: {
    color: MUTED,
    fontWeight: "800",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  list: {
    gap: 16,
  },
  rentalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rentalTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  carImageBox: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  rentalInfo: {
    flex: 1,
  },
  carName: {
    color: DARK,
    fontSize: 16,
    fontWeight: "900",
  },
  amount: {
    color: ORANGE,
    fontWeight: "900",
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    maxWidth: 115,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  metaRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  timelineBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginTop: 16,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  timelineLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  timelineValue: {
    color: DARK,
    fontWeight: "900",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FDBA74",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },
  outlineButtonText: {
    color: ORANGE,
    fontWeight: "900",
  },
  payButton: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  emptyTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
  },
  emptyText: {
    color: MUTED,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    fontWeight: "600",
  },
});
