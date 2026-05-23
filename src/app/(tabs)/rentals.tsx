import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const rentals = [
  {
    id: 1,
    car: "Toyota Camry",
    pickup: "May 10, 2026",
    returnDate: "May 12, 2026",
    status: "Confirmed",
    amount: "₱5,000",
  },
  {
    id: 2,
    car: "Toyota Vios",
    pickup: "May 15, 2026",
    returnDate: "May 16, 2026",
    status: "Pending Payment",
    amount: "₱1,800",
  },
  {
    id: 3,
    car: "Mitsubishi Xpander",
    pickup: "Apr 20, 2026",
    returnDate: "Apr 23, 2026",
    status: "Completed",
    amount: "₱8,400",
  },
];

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";

function getStatusStyle(status: string) {
  if (status === "Confirmed") {
    return {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    };
  }

  if (status === "Pending Payment") {
    return {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
    };
  }

  if (status === "Completed") {
    return {
      backgroundColor: "#DBEAFE",
      color: "#1D4ED8",
    };
  }

  return {
    backgroundColor: "#F1F5F9",
    color: "#475569",
  };
}

export default function RentalsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
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
          {["All", "Pending", "Upcoming", "Active", "Completed", "Cancelled"].map(
            (item, index) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, index === 0 && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    index === 0 && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        <View style={styles.list}>
          {rentals.map((rental) => {
            const statusStyle = getStatusStyle(rental.status);

            return (
              <View key={rental.id} style={styles.rentalCard}>
                <View style={styles.rentalTop}>
                  <View style={styles.carIcon}>
                    <Ionicons
                      name="car-sport-outline"
                      size={34}
                      color={ORANGE}
                    />
                  </View>

                  <View style={styles.rentalInfo}>
                    <Text style={styles.carName}>{rental.car}</Text>
                    <Text style={styles.amount}>{rental.amount}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.backgroundColor },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusStyle.color }]}
                    >
                      {rental.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineBox}>
                  <View style={styles.timelineItem}>
                    <Ionicons name="location-outline" size={18} color={ORANGE} />
                    <View>
                      <Text style={styles.timelineLabel}>Pickup</Text>
                      <Text style={styles.timelineValue}>{rental.pickup}</Text>
                    </View>
                  </View>

                  <View style={styles.timelineItem}>
                    <Ionicons name="flag-outline" size={18} color={ORANGE} />
                    <View>
                      <Text style={styles.timelineLabel}>Return</Text>
                      <Text style={styles.timelineValue}>
                        {rental.returnDate}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.outlineButton}>
                    <Text style={styles.outlineButtonText}>View Details</Text>
                  </TouchableOpacity>

                  {rental.status === "Pending Payment" && (
                    <TouchableOpacity style={styles.payButton}>
                      <Text style={styles.payButtonText}>Pay Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
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
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rentalTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  carIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  rentalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  carName: {
    color: DARK,
    fontSize: 17,
    fontWeight: "900",
  },
  amount: {
    color: ORANGE,
    marginTop: 3,
    fontWeight: "900",
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
  },
  timelineBox: {
    marginTop: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    gap: 12,
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
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },
  outlineButtonText: {
    color: DARK,
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
});