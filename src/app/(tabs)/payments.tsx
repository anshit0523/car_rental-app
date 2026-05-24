import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
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

type PendingPayment = {
  id: number;
  booking_id: number;
  amount: number;
  payment_date: string;
  booking?: {
    id: number;
    pickup_at?: string;
    return_at?: string;
    car?: {
      model?: string;
      brand?: { name?: string };
      transmission?: { type?: string };
      fuel_type?: { type?: string };
    };
  };
  payment_status?: {
    name?: string;
  };
};

type SelectedReceipt = {
  uri: string;
  name: string;
  type: string;
};

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [paymentSetting, setPaymentSetting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"gcash" | "bank">("gcash");
  const [selectedReceipts, setSelectedReceipts] = useState<Record<number, SelectedReceipt>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/payments`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert("Error", data.message || "Unable to load payments.");
        return;
      }

      setPayments(data.payments || []);
      setPaymentSetting(data.payment_setting || null);
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  const pickReceipt = async (payment: PendingPayment) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setSelectedReceipts((prev) => ({
      ...prev,
      [payment.id]: {
        uri: asset.uri,
        name: asset.fileName || `receipt-${payment.booking_id}.jpg`,
        type: asset.mimeType || "image/jpeg",
      },
    }));
  };

  const uploadReceipt = async (payment: PendingPayment) => {
    const receipt = selectedReceipts[payment.id];

    if (!receipt) {
      Alert.alert("No Receipt Selected", "Please select a receipt image first.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("booking_id", String(payment.booking_id));
      formData.append("payment_method", selectedMethod);
      formData.append("receipt_image", {
        uri: receipt.uri,
        name: receipt.name,
        type: receipt.type,
      } as any);

      const token = await AsyncStorage.getItem("auth_token");

      setUploadingId(payment.id);

      const response = await fetch(`${API_URL}/payments/upload-receipt`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert("Upload Failed", data.message || "Unable to upload receipt.");
        return;
      }

      Alert.alert("Success", "Receipt uploaded successfully.");

      setSelectedReceipts((prev) => {
        const copy = { ...prev };
        delete copy[payment.id];
        return copy;
      });

      setPreviewImage(null);
      fetchPayments();
    } catch (error) {
      Alert.alert("Error", "Unable to upload receipt.");
    } finally {
      setUploadingId(null);
    }
  };

  const removeReceipt = (paymentId: number) => {
    setSelectedReceipts((prev) => {
      const copy = { ...prev };
      delete copy[paymentId];
      return copy;
    });

    setPreviewImage(null);
  };

  const formatAmount = (amount: number) => {
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
          <Text style={styles.loadingText}>Loading payments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.pageLabel}>Payments</Text>
            <Text style={styles.title}>Pending Payments</Text>
          </View>

          <View style={styles.walletIcon}>
            <Ionicons name="wallet-outline" size={24} color={ORANGE} />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={ORANGE} />
          <Text style={styles.infoText}>
            Select and review your receipt before uploading. Admin or staff will verify your payment.
          </Text>
        </View>

        <View style={styles.methodSwitch}>
          <TouchableOpacity
            style={[styles.methodChip, selectedMethod === "gcash" && styles.methodChipActive]}
            onPress={() => setSelectedMethod("gcash")}
          >
            <Text
              style={[
                styles.methodChipText,
                selectedMethod === "gcash" && styles.methodChipTextActive,
              ]}
            >
              GCash
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodChip, selectedMethod === "bank" && styles.methodChipActive]}
            onPress={() => setSelectedMethod("bank")}
          >
            <Text
              style={[
                styles.methodChipText,
                selectedMethod === "bank" && styles.methodChipTextActive,
              ]}
            >
              Bank
            </Text>
          </TouchableOpacity>
        </View>

        {payments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={42} color={ORANGE} />
            <Text style={styles.emptyTitle}>No pending payments</Text>
            <Text style={styles.emptyText}>
              Your pending booking payments will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {payments.map((payment) => {
              const car = payment.booking?.car;
              const carName = `${car?.brand?.name || ""} ${car?.model || ""}`.trim();
              const selectedReceipt = selectedReceipts[payment.id];

              return (
                <View key={payment.id} style={styles.paymentCard}>
                  <View style={styles.paymentTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.carName}>{carName || "Car Booking"}</Text>
                      <Text style={styles.dateText}>
                        Pickup: {formatDate(payment.booking?.pickup_at)}
                      </Text>
                    </View>

                    <Text style={styles.amount}>{formatAmount(payment.amount)}</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="settings-outline" size={15} color={MUTED} />
                      <Text style={styles.metaText}>{car?.transmission?.type || "N/A"}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons name="flame-outline" size={15} color={MUTED} />
                      <Text style={styles.metaText}>{car?.fuel_type?.type || "N/A"}</Text>
                    </View>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {payment.payment_status?.name || "Awaiting Payment"}
                    </Text>
                  </View>

                  {!selectedReceipt ? (
                    <TouchableOpacity
                      style={styles.uploadBox}
                      onPress={() => pickReceipt(payment)}
                      disabled={uploadingId === payment.id}
                    >
                      <Ionicons name="image-outline" size={34} color={ORANGE} />
                      <Text style={styles.uploadTitle}>Select Receipt</Text>
                      <Text style={styles.uploadText}>Choose image first before uploading</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.previewBox}>
                      <TouchableOpacity onPress={() => setPreviewImage(selectedReceipt.uri)}>
                        <Image source={{ uri: selectedReceipt.uri }} style={styles.previewImage} />
                      </TouchableOpacity>

                      <View style={styles.previewHint}>
                        <Ionicons name="expand-outline" size={15} color={MUTED} />
                        <Text style={styles.previewHintText}>Tap image to preview full screen</Text>
                      </View>

                      <View style={styles.previewActions}>
                        <TouchableOpacity
                          style={styles.changeButton}
                          onPress={() => pickReceipt(payment)}
                          disabled={uploadingId === payment.id}
                        >
                          <Text style={styles.changeButtonText}>Change Image</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeReceipt(payment.id)}
                          disabled={uploadingId === payment.id}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.payButton,
                      (!selectedReceipt || uploadingId === payment.id) && styles.disabledButton,
                    ]}
                    onPress={() => uploadReceipt(payment)}
                    disabled={!selectedReceipt || uploadingId === payment.id}
                  >
                    {uploadingId === payment.id ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.payButtonText}>Upload Receipt</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.sectionTitle}>Payment Methods</Text>

        <View style={styles.methodCard}>
          <View style={styles.methodIcon}>
            <Ionicons name="phone-portrait-outline" size={25} color={ORANGE} />
          </View>

          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>GCash Payment</Text>
            <Text style={styles.methodText}>
              {paymentSetting?.gcash_name || "Send payment to the official rental account."}
            </Text>
            {paymentSetting?.gcash_number ? (
              <Text style={styles.accountText}>{paymentSetting.gcash_number}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.methodCard}>
          <View style={styles.methodIcon}>
            <Ionicons name="card-outline" size={25} color={ORANGE} />
          </View>

          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Bank Payment</Text>
            <Text style={styles.methodText}>
              {paymentSetting?.bank_name || "Use bank transfer if available."}
            </Text>
            {paymentSetting?.bank_account_number ? (
              <Text style={styles.accountText}>{paymentSetting.bank_account_number}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!previewImage} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setPreviewImage(null)}
          >
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>

          {previewImage && (
            <Image
              source={{ uri: previewImage }}
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
    paddingBottom: 90,
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
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  infoText: {
    flex: 1,
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  methodSwitch: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  methodChip: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  methodChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  methodChipText: {
    color: MUTED,
    fontWeight: "900",
  },
  methodChipTextActive: {
    color: "#FFFFFF",
  },
  list: {
    marginTop: 18,
    gap: 16,
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  paymentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  carName: {
    color: DARK,
    fontSize: 17,
    fontWeight: "900",
  },
  dateText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },
  amount: {
    color: ORANGE,
    fontWeight: "900",
    fontSize: 17,
  },
  metaRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 12,
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
  statusBadge: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusText: {
    color: "#92400E",
    fontWeight: "900",
    fontSize: 12,
  },
  uploadBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderStyle: "dashed",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    backgroundColor: "#FFFBEB",
  },
  uploadTitle: {
    color: DARK,
    fontWeight: "900",
    marginTop: 8,
  },
  uploadText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  previewBox: {
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  previewImage: {
    width: "100%",
    height: 190,
  },
  previewHint: {
    paddingHorizontal: 12,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  previewHintText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  previewActions: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  changeButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  changeButtonText: {
    color: ORANGE,
    fontWeight: "900",
  },
  removeButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#DC2626",
    fontWeight: "900",
  },
  payButton: {
    marginTop: 14,
    backgroundColor: ORANGE,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.55,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  emptyCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
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
  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 26,
    marginBottom: 12,
  },
  methodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodTitle: {
    color: DARK,
    fontWeight: "900",
    fontSize: 15,
  },
  methodText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  accountText: {
    marginTop: 6,
    color: ORANGE,
    fontSize: 13,
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