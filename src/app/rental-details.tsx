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
const RED = "#DC2626";
const BLUE = "#2563EB";

type TabType = "details" | "return";

export default function RentalDetailsScreen() {
  const { rentalId } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [issuePhotoPreview, setIssuePhotoPreview] = useState<string | null>(null);
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
      },
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

  const formatText = (value?: string) => {
    if (!value) return "N/A";

    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusStyle = (status?: any) => {
    const name =
      typeof status === "string"
        ? status.toLowerCase()
        : typeof status?.name === "string"
          ? status.name.toLowerCase()
          : typeof status?.label === "string"
            ? status.label.toLowerCase()
            : "";

    if (name.includes("pending")) {
      return { bg: "#FEF3C7", text: "#92400E" };
    }

    if (name.includes("confirmed") || name.includes("active")) {
      return { bg: "#DCFCE7", text: "#166534" };
    }

    if (name.includes("completed")) {
      return { bg: "#DBEAFE", text: "#1D4ED8" };
    }

    if (name.includes("return") || name.includes("checkup")) {
      return { bg: "#FFEDD5", text: "#C2410C" };
    }

    if (name.includes("damage") || name.includes("repair")) {
      return { bg: "#FEE2E2", text: "#B91C1C" };
    }

    if (name.includes("cancelled") || name.includes("failed")) {
      return { bg: "#FEE2E2", text: "#B91C1C" };
    }

    return { bg: "#F1F5F9", text: MUTED };
  };

  const getIssueStatusStyle = (status?: string) => {
    const name = (status || "").toLowerCase();

    if (name.includes("pending")) {
      return { bg: "#FEF3C7", text: "#92400E", icon: "time-outline" as const };
    }

    if (name.includes("review")) {
      return { bg: "#DBEAFE", text: "#1D4ED8", icon: "search-outline" as const };
    }

    if (name.includes("awaiting") || name.includes("payment")) {
      return { bg: "#FFEDD5", text: "#C2410C", icon: "wallet-outline" as const };
    }

    if (name.includes("resolved")) {
      return { bg: "#DCFCE7", text: "#166534", icon: "checkmark-circle-outline" as const };
    }

    if (name.includes("rejected")) {
      return { bg: "#FEE2E2", text: "#B91C1C", icon: "close-circle-outline" as const };
    }

    return { bg: "#F1F5F9", text: MUTED, icon: "information-circle-outline" as const };
  };

  const getIssueStatusMessage = (status?: string) => {
    const name = (status || "").toLowerCase();

    if (name.includes("review")) {
      return {
        title: "Issue Under Review",
        message:
          "Our staff is checking the uploaded photos, vehicle condition, and possible charges.",
      };
    }

    if (name.includes("awaiting") || name.includes("payment")) {
      return {
        title: "Payment Needed",
        message:
          "The return issue has been confirmed and the final charge is ready for payment.",
      };
    }

    if (name.includes("resolved")) {
      return {
        title: "Issue Resolved",
        message:
          "This return issue has already been settled. No further action is required.",
      };
    }

    if (name.includes("rejected")) {
      return {
        title: "Issue Rejected",
        message:
          "This reported issue was reviewed and no charge was applied.",
      };
    }

    return {
      title: "Issue Report Submitted",
      message:
        "A return issue has been reported for this rental and is waiting for review.",
    };
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

  const returnIssue = rental.return_issue || rental.returnIssue || null;
  const issueStatus =
    returnIssue?.issue_status ||
    returnIssue?.issueStatus ||
    returnIssue?.status ||
    null;

  const issueStatusName =
    typeof issueStatus === "string"
      ? issueStatus
      : issueStatus?.name || issueStatus?.label || "";

  const issueStatusLabel =
    typeof issueStatus === "string"
      ? formatText(issueStatus)
      : issueStatus?.label || issueStatus?.name || formatText(issueStatusName);

  const issueStatusStyle = getIssueStatusStyle(issueStatusName);
  const issueStatusContent = getIssueStatusMessage(issueStatusName);
  const issuePhotos = returnIssue?.photos || returnIssue?.return_issue_photos || [];
  const issueHistories = returnIssue?.histories || returnIssue?.return_issue_histories || [];

  const canCancel =
    statusName === "Pending Payment" ||
    statusName === "Pending Payment Verification";

  const renderDetailsTab = () => (
    <>
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

          <View style={{ flex: 1 }}>
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

          <View style={{ flex: 1 }}>
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

        <View style={{ flex: 1 }}>
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

        <View style={{ flex: 1 }}>
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
    </>
  );

  const renderReturnTab = () => {
    if (!returnIssue) {
      return (
        <View style={styles.returnEmptyCard}>
          <View style={styles.returnEmptyIcon}>
            <Ionicons name="car-outline" size={34} color={ORANGE} />
          </View>

          <Text style={styles.returnEmptyTitle}>No Return Issue Yet</Text>
          <Text style={styles.returnEmptyText}>
            Return issue details will appear here when staff reports a checkup,
            damage, repair, or final return charge for this booking.
          </Text>

          <View style={styles.returnSteps}>
            <View style={styles.returnStep}>
              <View style={styles.returnStepDot} />
              <Text style={styles.returnStepText}>Vehicle returned</Text>
            </View>

            <View style={styles.returnStep}>
              <View style={styles.returnStepDot} />
              <Text style={styles.returnStepText}>Staff checks vehicle condition</Text>
            </View>

            <View style={styles.returnStep}>
              <View style={styles.returnStepDot} />
              <Text style={styles.returnStepText}>Issue or final status appears here</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <>
        <View style={styles.returnStatusCard}>
          <View style={[styles.returnStatusIcon, { backgroundColor: issueStatusStyle.bg }]}>
            <Ionicons
              name={issueStatusStyle.icon}
              size={26}
              color={issueStatusStyle.text}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.returnStatusTitle}>{issueStatusContent.title}</Text>
            <Text style={styles.returnStatusText}>{issueStatusContent.message}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Return Issue</Text>

        <View style={styles.issueCard}>
          <View style={styles.issueBadgeRow}>
            <View style={[styles.issueBadge, { backgroundColor: issueStatusStyle.bg }]}>
              <Text style={[styles.issueBadgeText, { color: issueStatusStyle.text }]}>
                {issueStatusLabel}
              </Text>
            </View>

            <View style={styles.issueTypeBadge}>
              <Text style={styles.issueTypeText}>
                {formatText(returnIssue.issue_type)}
              </Text>
            </View>
          </View>

          <View style={styles.issueLine}>
            <Text style={styles.issueLineLabel}>Reported At</Text>
            <Text style={styles.issueLineValue}>
              {formatDateTime(returnIssue.reported_at)}
            </Text>
          </View>

          <View style={styles.issueLine}>
            <Text style={styles.issueLineLabel}>Estimated Charge</Text>
            <Text style={styles.issueLineValue}>
              {formatMoney(returnIssue.estimated_charge)}
            </Text>
          </View>

          <View style={styles.issueLine}>
            <Text style={styles.issueLineLabel}>Final Charge</Text>
            <Text style={[styles.issueLineValue, Number(returnIssue.final_charge || 0) > 0 && { color: RED }]}>
              {Number(returnIssue.final_charge || 0) > 0
                ? formatMoney(returnIssue.final_charge)
                : "Not yet finalized"}
            </Text>
          </View>

          <View style={styles.issueLineLast}>
            <Text style={styles.issueLineLabel}>Reference</Text>
            <Text style={styles.issueLineValue}>
              {returnIssue.title || "Return Issue"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            {returnIssue.description || "No additional description provided."}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Photos</Text>

        {issuePhotos.length ? (
          <View style={styles.photoGrid}>
            {issuePhotos.map((photo: any, index: number) => {
              const photoUrl =
                photo.image_url ||
                photo.photo_url ||
                photo.url ||
                photo.photo_path ||
                photo;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.issuePhotoBox}
                  onPress={() => setIssuePhotoPreview(photoUrl)}
                >
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.issuePhoto}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.descriptionCard}>
            <Text style={styles.emptySmallText}>No photos uploaded.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Timeline</Text>

        {issueHistories.length ? (
          <View style={styles.issueTimelineCard}>
            {issueHistories.map((history: any, index: number) => (
              <View key={index} style={styles.issueTimelineItem}>
                <View style={styles.issueTimelineLeft}>
                  <View style={styles.issueTimelineDot} />
                  {index !== issueHistories.length - 1 && (
                    <View style={styles.issueTimelineLine} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.issueTimelineTitle}>
                    {history.title || "Status Updated"}
                  </Text>

                  <Text style={styles.issueTimelineMeta}>
                    {formatDateTime(history.created_at)}
                    {history.changed_by?.name
                      ? ` • by ${history.changed_by.name}`
                      : history.changedBy?.name
                        ? ` • by ${history.changedBy.name}`
                        : ""}
                  </Text>

                  {history.message ? (
                    <Text style={styles.issueTimelineMessage}>
                      {history.message}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.descriptionCard}>
            <Text style={styles.emptySmallText}>
              No history updates available yet.
            </Text>
          </View>
        )}

        {issueStatusName === "awaiting_payment" && (
          <TouchableOpacity
            style={styles.payIssueButton}
            onPress={() =>
              router.push({
                pathname: "/payments",
                params: {
                  bookingId: String(rental.id),
                  returnIssueId: String(returnIssue.id),
                  amount: String(returnIssue.final_charge || 0),
                },
              })
            }
          >
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.payIssueButtonText}>Pay Return Charge</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

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

        <View style={styles.tabCard}>
          <TouchableOpacity
            activeOpacity={0.85}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.tabButton,
              activeTab === "details" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("details")}
          >
            <Ionicons
              name="document-text-outline"
              size={17}
              color={activeTab === "details" ? "#FFFFFF" : MUTED}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "details" && styles.tabButtonTextActive,
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.tabButton,
              activeTab === "return" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("return")}
          >
            <Ionicons
              name="return-down-back-outline"
              size={17}
              color={activeTab === "return" ? "#FFFFFF" : MUTED}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "return" && styles.tabButtonTextActive,
              ]}
            >
              Return
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "details" ? renderDetailsTab() : renderReturnTab()}

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

      <Modal visible={!!issuePhotoPreview} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setIssuePhotoPreview(null)}
          >
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>

          {issuePhotoPreview && (
            <Image
              source={{ uri: issuePhotoPreview }}
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
  tabCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    gap: 6,
    zIndex: 5,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  tabButtonActive: {
    backgroundColor: ORANGE,
  },
  tabButtonText: {
    color: MUTED,
    fontWeight: "900",
    fontSize: 13,
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
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
  returnEmptyCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  returnEmptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  returnEmptyTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
  },
  returnEmptyText: {
    color: MUTED,
    textAlign: "center",
    lineHeight: 21,
    fontWeight: "600",
    marginTop: 8,
  },
  returnSteps: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    gap: 11,
  },
  returnStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  returnStepDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: ORANGE,
  },
  returnStepText: {
    color: DARK,
    fontWeight: "700",
    flex: 1,
  },
  returnStatusCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    gap: 14,
  },
  returnStatusIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  returnStatusTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "900",
  },
  returnStatusText: {
    color: MUTED,
    marginTop: 6,
    lineHeight: 20,
    fontWeight: "600",
  },
  issueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  issueBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  issueBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  issueBadgeText: {
    fontSize: 12,
    fontWeight: "900",
  },
  issueTypeBadge: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  issueTypeText: {
    color: DARK,
    fontSize: 12,
    fontWeight: "900",
  },
  issueLine: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  issueLineLast: {
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  issueLineLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    flex: 1,
  },
  issueLineValue: {
    color: DARK,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
    flex: 1.2,
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  descriptionText: {
    color: DARK,
    fontWeight: "600",
    lineHeight: 22,
  },
  emptySmallText: {
    color: MUTED,
    fontWeight: "700",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  issuePhotoBox: {
    width: "31.5%",
    height: 96,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  issuePhoto: {
    width: "100%",
    height: "100%",
  },
  issueTimelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  issueTimelineItem: {
    flexDirection: "row",
    gap: 12,
    minHeight: 72,
  },
  issueTimelineLeft: {
    alignItems: "center",
    width: 18,
  },
  issueTimelineDot: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: ORANGE,
    borderWidth: 3,
    borderColor: "#FFEDD5",
  },
  issueTimelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#E2E8F0",
    marginTop: 3,
  },
  issueTimelineTitle: {
    color: DARK,
    fontWeight: "900",
    fontSize: 14,
  },
  issueTimelineMeta: {
    color: MUTED,
    marginTop: 4,
    fontWeight: "600",
    fontSize: 11,
  },
  issueTimelineMessage: {
    color: DARK,
    marginTop: 6,
    lineHeight: 19,
    fontWeight: "600",
  },
  payIssueButton: {
    marginTop: 24,
    height: 54,
    backgroundColor: BLUE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  payIssueButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
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