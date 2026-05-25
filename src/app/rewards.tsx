import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#f97316";
const API_URL = "https://car-rental.free.laravel.cloud/api";

type FilterType = "all" | "earned" | "redeemed" | "returned" | "manual";

type Transaction = {
  id: number;
  booking_id?: number | null;
  points_change: number;
  balance_after: number;
  note?: string | null;
  created_at: string;
};

export default function RewardsScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [availableDiscount, setAvailableDiscount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getToken = async () => {
    return await AsyncStorage.getItem("auth_token");
  };

  const fetchRewards = async (selectedFilter: FilterType = filter) => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${API_URL}/rewards?filter=${selectedFilter}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentBalance(data.current_balance || 0);
        setTotalEarned(data.total_earned || 0);
        setTotalRedeemed(data.total_redeemed || 0);
        setAvailableDiscount(data.available_discount || 0);
        setTransactions(data.transactions || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRewards(filter);
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRewards(filter);
  };

  const getType = (item: Transaction) => {
    const note = (item.note || "").toLowerCase();

    if (note.includes("returned")) return "Returned";
    if (note.includes("manual")) return "Manual";
    if (item.points_change > 0) return "Earned";

    return "Redeemed";
  };

  const getTypeStyle = (type: string) => {
    if (type === "Earned") {
      return {
        bg: "#DCFCE7",
        color: "#16A34A",
        icon: "gift-outline" as keyof typeof Ionicons.glyphMap,
      };
    }

    if (type === "Redeemed") {
      return {
        bg: "#FEE2E2",
        color: "#DC2626",
        icon: "return-down-forward-outline" as keyof typeof Ionicons.glyphMap,
      };
    }

    if (type === "Returned") {
      return {
        bg: "#FFEDD5",
        color: ORANGE,
        icon: "refresh-outline" as keyof typeof Ionicons.glyphMap,
      };
    }

    return {
      bg: "#EEF2FF",
      color: "#4338CA",
      icon: "create-outline" as keyof typeof Ionicons.glyphMap,
    };
  };

  const formatDate = (date: string) => {
    const d = new Date(date);

    return {
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString();
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Earned", value: "earned" },
    { label: "Redeemed", value: "redeemed" },
    { label: "Returned", value: "returned" },
    { label: "Manual", value: "manual" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Points History</Text>

        <View style={{ width: 25 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading rewards...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>
              {formatNumber(currentBalance)}
            </Text>
            <Text style={styles.balanceUnit}>Points</Text>

            <View style={styles.discountBox}>
              <Ionicons name="ticket-outline" size={20} color={ORANGE} />
              <Text style={styles.discountText}>
                Available Discount: ₱{Number(availableDiscount).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="trending-up-outline" size={23} color="#16A34A" />
              <Text style={styles.summaryLabel}>Total Earned</Text>
              <Text style={[styles.summaryValue, { color: "#16A34A" }]}>
                {formatNumber(totalEarned)}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Ionicons name="trending-down-outline" size={23} color="#DC2626" />
              <Text style={styles.summaryLabel}>Total Redeemed</Text>
              <Text style={[styles.summaryValue, { color: "#DC2626" }]}>
                {formatNumber(totalRedeemed)}
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={ORANGE} />
            <Text style={styles.infoText}>
              You earn 1 point for every ₱100 spent. Use points for discounts on
              your next booking.
            </Text>
          </View>

          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Points History</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.filterChip,
                  filter === item.value && styles.filterChipActive,
                ]}
                onPress={() => {
                  setLoading(true);
                  setFilter(item.value);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item.value && styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadText, { flex: 1.25 }]}>DATE</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>BOOKING</Text>
            <Text style={[styles.tableHeadText, { flex: 1.2 }]}>TYPE</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>POINTS</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>BALANCE</Text>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="star-outline" size={42} color={ORANGE} />
              <Text style={styles.emptyTitle}>No points history yet</Text>
              <Text style={styles.emptyText}>
                Your earned and redeemed points will appear here.
              </Text>
            </View>
          ) : (
            transactions.map((item) => {
              const type = getType(item);
              const typeStyle = getTypeStyle(type);
              const date = formatDate(item.created_at);
              const isPositive = item.points_change > 0;

              return (
                <View key={item.id} style={styles.transactionCard}>
                  <View style={styles.transactionTop}>
                    <View style={{ flex: 1.25 }}>
                      <Text style={styles.dateText}>{date.date}</Text>
                      <Text style={styles.timeText}>{date.time}</Text>
                    </View>

                    <Text style={[styles.bookingText, { flex: 1 }]}>
                      #{item.booking_id || "N/A"}
                    </Text>

                    <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
                      <Ionicons
                        name={typeStyle.icon}
                        size={14}
                        color={typeStyle.color}
                      />
                      <Text style={[styles.badgeText, { color: typeStyle.color }]}>
                        {type}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.pointsText,
                        { color: isPositive ? "#16A34A" : "#DC2626" },
                      ]}
                    >
                      {isPositive ? "+" : ""}
                      {formatNumber(item.points_change)}
                    </Text>

                    <Text style={styles.balanceText}>
                      {formatNumber(item.balance_after)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.noteBox,
                      { borderLeftColor: typeStyle.color },
                    ]}
                  >
                    <Text style={styles.noteText}>
                      {item.note || "No note provided"}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  balanceCard: {
    backgroundColor: ORANGE,
    borderRadius: 24,
    padding: 22,
    marginBottom: 14,
  },
  balanceLabel: {
    color: "#FFEDD5",
    fontWeight: "800",
    fontSize: 14,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    marginTop: 5,
  },
  balanceUnit: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  discountBox: {
    marginTop: 18,
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  discountText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },
  infoBox: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    color: "#EA580C",
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 19,
  },
  historyHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111827",
  },
  filterRow: {
    gap: 10,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  filterChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  filterText: {
    color: "#64748B",
    fontWeight: "900",
    fontSize: 13,
  },
  filterTextActive: {
    color: "#fff",
  },
  tableHeader: {
    backgroundColor: ORANGE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tableHeadText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 11,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 12,
  },
  timeText: {
    color: ORANGE,
    fontWeight: "800",
    fontSize: 12,
    marginTop: 3,
  },
  bookingText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 15,
  },
  badge: {
    flex: 1.2,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontWeight: "900",
    fontSize: 11,
  },
  pointsText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "900",
    fontSize: 14,
  },
  balanceText: {
    flex: 1,
    textAlign: "center",
    color: "#111827",
    fontWeight: "900",
    fontSize: 14,
  },
  noteBox: {
    marginTop: 13,
    borderLeftWidth: 4,
    paddingLeft: 10,
  },
  noteText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  emptyText: {
    marginTop: 6,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
  },
});