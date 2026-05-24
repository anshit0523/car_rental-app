import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../lib/api/config";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";
const GREEN = "#16A34A";

export default function RentalDetailsScreen() {
  const { rentalId } = useLocalSearchParams();

  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchRentalDetails();
  }, [rentalId]);

  const fetchRentalDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/rentals/${rentalId}`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success) {
        setRental(data.booking);
      }
    } catch (error) {
      console.log("Rental details error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? Points will be returned if used.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: submitCancelBooking,
        },
      ],
    );
  };

  const submitCancelBooking = async () => {
    try {
      setCancelLoading(true);

      const token = await AsyncStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/bookings/${rentalId}/cancel`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert(
          "Unable to Cancel",
          data.message || "Something went wrong.",
        );
        return;
      }

      Alert.alert("Success", data.message || "Booking cancelled successfully.");
      setRental(data.booking);
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setCancelLoading(false);
    }
  };

const needHelp = () => {
  Alert.alert(
    "Need Help?",
    "Contact Dumaguete EZE Car Rental support.",
    [
      {
        text: "Call SMART/TNT",
        onPress: () => Linking.openURL("tel:09812255442"),
      },
      {
        text: "Call TM/GLOBE",
        onPress: () => Linking.openURL("tel:09552603041"),
      },
      {
        text: "Message SMART/TNT",
        onPress: () => Linking.openURL("sms:09812255442"),
      },
      {
        text: "Exit",
        style: "cancel",
      },
    ],
    {
      cancelable: true,
    }
  );
};

  const formatMoney = (value?: number) => {
    return `₱${Number(value || 0).toLocaleString()}`;
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status?: string) => {
    const name = (status || "").toLowerCase();

    if (name.includes("pending")) {
      return { bg: "#FEF3C7", text: "#92400E" };
    }

    if (name.includes("confirmed") || name.includes("active")) {
      return { bg: "#DCFCE7", text: "#166534" };
    }

    if (name.includes("completed")) {
      return { bg: "#DBEAFE", text: "#1D4ED8" };
    }

    if (name.includes("cancelled") || name.includes("failed")) {
      return { bg: "#FEE2E2", text: "#B91C1C" };
    }

    return { bg: "#F1F5F9", text: MUTED };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading rental details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!rental) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Rental not found</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusName = rental.status?.name || "N/A";
  const statusStyle = getStatusStyle(statusName);
  const carName =
    `${rental.car?.brand || ""} ${rental.car?.model || ""}`.trim();
  const imageUrl = rental.car?.images?.[0];
  const receiptUrl = rental.photo_receipt?.image_url;
  const total = Number(rental.total_price || 0);
  const discount = Number(rental.discount_amount || 0);
  const finalTotal = Number(rental.final_total || total);
  const pointsUsed = Number(rental.points_used || 0);

  const canCancel =
    statusName === "Pending Payment" ||
    statusName === "Pending Payment Verification";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>

          <Text style={styles.title}>Rental Details</Text>

          <View style={styles.placeholder} />
        </View>

        <View style={styles.statusCard}>
          <View>
            <Text style={styles.smallLabel}>Booking ID</Text>
            <Text style={styles.bookingId}>
              #BR-{String(rental.id).padStart(6, "0")}
            </Text>
          </View>

          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {statusName}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Car Information</Text>

        <View style={styles.cardRow}>
          <View style={styles.carImageBox}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.carImage} />
            ) : (
              <Ionicons name="car-sport-outline" size={44} color={ORANGE} />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.carName}>{carName || "Car Booking"}</Text>
            <Text style={styles.carMeta}>
              {rental.car?.transmission || "N/A"} •{" "}
              {rental.car?.fuel_type || "N/A"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Rental Period</Text>

        <View style={styles.timelineCard}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Ionicons name="location" size={18} color={ORANGE} />
            </View>

            <View>
              <Text style={styles.timelineTitle}>Pickup</Text>
              <Text style={styles.timelineValue}>
                {formatDateTime(rental.pickup_at)}
              </Text>
              <Text style={styles.timelineSub}>
                {rental.service_location || "Branch pickup"}
              </Text>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Ionicons name="flag" size={18} color={ORANGE} />
            </View>

            <View>
              <Text style={styles.timelineTitle}>Return</Text>
              <Text style={styles.timelineValue}>
                {formatDateTime(rental.return_at)}
              </Text>
              <Text style={styles.timelineSub}>
                {rental.service_location || "Branch return"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Summary</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Price</Text>
            <Text style={styles.summaryValue}>{formatMoney(total)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Points Discount</Text>
            <Text style={styles.discountText}>- {formatMoney(discount)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Points Used</Text>
            <Text style={styles.summaryValue}>{pointsUsed} pts</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Final Amount</Text>
            <Text style={styles.totalValue}>{formatMoney(finalTotal)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Receipt Status</Text>

        <View style={styles.receiptCard}>
          <View style={styles.receiptTop}>
            <View style={styles.receiptIcon}>
              <Ionicons name="receipt-outline" size={26} color={ORANGE} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.receiptTitle}>
                {rental.photo_receipt
                  ? "Receipt Uploaded"
                  : "No Receipt Uploaded"}
              </Text>
              <Text style={styles.receiptSub}>
                {rental.photo_receipt?.status || "Awaiting payment receipt"}
              </Text>
            </View>
          </View>

          {receiptUrl ? (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => setReceiptPreview(receiptUrl)}
            >
              <Text style={styles.outlineButtonText}>View Receipt</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Service Location</Text>

        <View style={styles.simpleCard}>
          <View style={styles.circleIcon}>
            <Ionicons name="location-outline" size={22} color={ORANGE} />
          </View>

          <View>
            <Text style={styles.simpleTitle}>
              {rental.service_location || "Dumaguete EZE Car Rental"}
            </Text>
            <Text style={styles.simpleSub}>Pickup / delivery location</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Points Used</Text>

        <View style={styles.simpleCard}>
          <View style={[styles.circleIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="star-outline" size={22} color="#D97706" />
          </View>

          <View>
            <Text style={styles.simpleTitle}>{pointsUsed} Points</Text>
            <Text style={styles.simpleSub}>Worth {formatMoney(discount)}</Text>
          </View>
        </View>

        {canCancel && (
          <View style={styles.cancelCard}>
            <View style={styles.cancelTop}>
              <Ionicons name="shield-outline" size={24} color={ORANGE} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cancelTitle}>
                  You can cancel this booking
                </Text>
                <Text style={styles.cancelText}>
                  Cancellation is allowed before payment is verified.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.cancelButton, cancelLoading && { opacity: 0.7 }]}
              onPress={cancelBooking}
              disabled={cancelLoading}
            >
              {cancelLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.helpButton} onPress={needHelp}>
          <Text style={styles.helpButtonText}>Need Help?</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={!!receiptPreview} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setReceiptPreview(null)}
          >
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>

          {receiptPreview && (
            <Image
              source={{ uri: receiptPreview }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
  },
  loadingText: {
    marginTop: 10,
    color: MUTED,
    fontWeight: "700",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  placeholder: {
    width: 44,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: DARK,
  },
  statusCard: {
    marginTop: 26,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallLabel: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: "800",
  },
  bookingId: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 5,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: 145,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
  },
  cardRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  carImageBox: {
    width: 110,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  carName: {
    color: DARK,
    fontSize: 17,
    fontWeight: "900",
  },
  carMeta: {
    color: MUTED,
    marginTop: 6,
    fontWeight: "700",
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timelineItem: {
    flexDirection: "row",
    gap: 14,
  },
  timelineIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 1,
    height: 28,
    backgroundColor: "#CBD5E1",
    marginLeft: 20,
    marginVertical: 4,
  },
  timelineTitle: {
    color: ORANGE,
    fontWeight: "900",
  },
  timelineValue: {
    color: DARK,
    fontWeight: "900",
    marginTop: 4,
  },
  timelineSub: {
    color: MUTED,
    marginTop: 4,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
    gap: 12,
  },
  summaryLabel: {
    color: DARK,
    fontWeight: "700",
  },
  summaryValue: {
    color: DARK,
    fontWeight: "900",
  },
  discountText: {
    color: GREEN,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
  },
  totalLabel: {
    color: DARK,
    fontSize: 16,
    fontWeight: "900",
  },
  totalValue: {
    color: ORANGE,
    fontSize: 20,
    fontWeight: "900",
  },
  receiptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  receiptTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  receiptIcon: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  receiptTitle: {
    color: DARK,
    fontWeight: "900",
    fontSize: 15,
  },
  receiptSub: {
    color: MUTED,
    marginTop: 5,
    fontWeight: "700",
  },
  outlineButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: ORANGE,
    borderRadius: 14,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    color: ORANGE,
    fontWeight: "900",
  },
  simpleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  simpleTitle: {
    color: DARK,
    fontWeight: "900",
    fontSize: 15,
  },
  simpleSub: {
    color: MUTED,
    marginTop: 4,
    fontWeight: "600",
  },
  cancelCard: {
    marginTop: 24,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 20,
    padding: 18,
  },
  cancelTop: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  cancelTitle: {
    color: DARK,
    fontWeight: "900",
  },
  cancelText: {
    color: MUTED,
    marginTop: 4,
    lineHeight: 19,
    fontWeight: "600",
  },
  cancelButton: {
    height: 50,
    backgroundColor: ORANGE,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  helpButton: {
    marginTop: 18,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDBA74",
    alignItems: "center",
    justifyContent: "center",
  },
  helpButtonText: {
    color: ORANGE,
    fontWeight: "900",
  },
  emptyTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 55,
    right: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "94%",
    height: "82%",
  },
});
