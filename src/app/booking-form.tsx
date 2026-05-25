import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../lib/api/config";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";
const GREEN = "#16A34A";

const TERMS = [
  "Renter agrees to pay the basic rental fee plus additional charges for excess hours, if any.",
  "Vehicle must be returned on the agreed return date/time in the same condition, minus normal wear and tear.",
  "Vehicle must be returned with the agreed fuel expectation as stated by the owner.",
  "Vehicle is allowed only within the approved area/location. Taking it elsewhere without owner consent has a ₱5,000 penalty.",
  "Renter must have a valid legal driver’s license and declares no outstanding issues against the license.",
  "Only the renter and any approved/authorized driver listed may drive the vehicle.",
  "Vehicle may be used only for routine, legal purposes and must follow all Philippine laws and rules.",
  "Renter is responsible for any damages and cleaning fees incurred during the rental period.",
  "Renter agrees to hold the owner harmless and confirms the vehicle was inspected and accepted in good operating condition.",
];

export default function BookingFormScreen() {
  const { carId } = useLocalSearchParams();

  const [car, setCar] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [phone, setPhone] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");

  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<Date>(new Date());
  const [returnTime, setReturnTime] = useState<Date>(new Date());

  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);

  const [serviceTypeId, setServiceTypeId] = useState("");
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);

  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState("0");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("auth_user");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setPhone(parsedUser?.phone || "");
      }

      await fetchCarDetails();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarDetails = async () => {
    const token = await AsyncStorage.getItem("auth_token");

    const response = await fetch(`${API_URL}/cars/${carId}`, {
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await response.json();

    if (data.success) {
      setCar(data.car);
      setServiceTypes(data.service_types || []);

      if ((data.service_types || []).length > 0) {
        setServiceTypeId(String(data.service_types[0].id));
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const readableDate = (date: Date | null) => {
    if (!date) return "Select date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const readableTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const availablePoints = Number(user?.points_balance || 0);

  const totalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;

    const pickup = new Date(pickupDate);
    const ret = new Date(returnDate);

    const diff = ret.getTime() - pickup.getTime();

    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [pickupDate, returnDate]);

  const totalBeforeDiscount = useMemo(() => {
    return totalDays * Number(car?.price_per_day || 0);
  }, [totalDays, car]);

  const pointsNumber = useMemo(() => {
    const entered = Number(pointsToUse || 0);
    const maxByTotal = Math.floor(totalBeforeDiscount * 10);

    return Math.min(entered, availablePoints, maxByTotal);
  }, [pointsToUse, availablePoints, totalBeforeDiscount]);

  const pointsDiscount = useMemo(() => {
    return usePoints ? pointsNumber / 10 : 0;
  }, [usePoints, pointsNumber]);

  const finalTotal = useMemo(() => {
    return Math.max(0, totalBeforeDiscount - pointsDiscount);
  }, [totalBeforeDiscount, pointsDiscount]);

  const selectedService = serviceTypes.find(
    (item) => String(item.id) === String(serviceTypeId)
  );

  const needsLocation =
    selectedService?.name?.toLowerCase().includes("deliver") ||
    selectedService?.name?.toLowerCase().includes("delivery");

  const handleUseMaxPoints = () => {
    const maxByTotal = Math.floor(totalBeforeDiscount * 10);
    const maxUsable = Math.min(availablePoints, maxByTotal);
    setPointsToUse(String(maxUsable));
  };

  const validateForm = () => {
    if (!pickupDate || !returnDate) {
      Alert.alert("Missing Schedule", "Please select pickup and return dates.");
      return false;
    }

    if (!phone.trim()) {
      Alert.alert("Missing Contact", "Please enter your contact number.");
      return false;
    }

    if (!/^09\d{9}$/.test(phone.replace(/\D/g, ""))) {
      Alert.alert("Invalid Phone", "Phone number must be 11 digits and start with 09.");
      return false;
    }

    if (!serviceTypeId) {
      Alert.alert("Missing Service", "Please select a service type.");
      return false;
    }

    if (needsLocation && !serviceLocation.trim()) {
      Alert.alert("Missing Location", "Please enter pickup or delivery location.");
      return false;
    }

    if (!agreeTerms) {
      Alert.alert("Terms Required", "Please agree to the rental terms and conditions.");
      return false;
    }

    return true;
  };

  const confirmBooking = async () => {
    if (!validateForm()) return;

    try {
      setChecking(true);

      const token = await AsyncStorage.getItem("auth_token");

      const availabilityResponse = await fetch(`${API_URL}/booking/check-availability`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          car_id: carId,
          pickup_date: formatDate(pickupDate as Date),
          pickup_time: formatTime(pickupTime),
          return_date: formatDate(returnDate as Date),
          return_time: formatTime(returnTime),
        }),
      });

      const availabilityData = await availabilityResponse.json();

      if (!availabilityData.available) {
        Alert.alert(
          "Unavailable",
          availabilityData.message || "This car is not available for the selected schedule."
        );
        return;
      }

      const bookingResponse = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          car_id: carId,
          pickup_date: formatDate(pickupDate as Date),
          pickup_time: formatTime(pickupTime),
          return_date: formatDate(returnDate as Date),
          return_time: formatTime(returnTime),
          total_price: totalBeforeDiscount,
          service_type_id: serviceTypeId,
          service_location: serviceLocation,
          phone: phone.replace(/\D/g, ""),
          points_to_use: usePoints ? pointsNumber : 0,
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok || !bookingData.success) {
        Alert.alert("Booking Failed", bookingData.message || "Unable to create booking.");
        return;
      }

      Alert.alert("Booking Created", "Your booking was created successfully.", [
        {
          text: "Continue",
          onPress: () =>
            router.replace({
              pathname: "/payments",
              params: {
                bookingId: String(bookingData.booking?.id),
                amount: String(finalTotal),
              },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Unable to connect to server.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading booking form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imageUrl = car?.images?.[0];
  const carName = `${car?.brand?.name || ""} ${car?.model || ""}`.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Book This Car</Text>

          <View style={styles.iconPlaceholder} />
        </View>

        <View style={styles.carCard}>
          <View style={styles.carImageBox}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.carImage} />
            ) : (
              <Ionicons name="car-sport-outline" size={44} color={ORANGE} />
            )}
          </View>

          <View style={styles.carInfo}>
            <Text style={styles.carName}>{carName || "Selected Car"}</Text>
            <Text style={styles.carMeta}>
              {car?.transmission?.type || "N/A"} • {car?.fuel_type?.type || "N/A"} •{" "}
              {car?.seats || 0} seats
            </Text>

            <Text style={styles.carPrice}>
              ₱{Number(car?.price_per_day || 0).toLocaleString()} / day
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Pickup Date</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPickupDatePicker(true)}
              >
                <Text style={styles.pickerText}>{readableDate(pickupDate)}</Text>
                <Ionicons name="calendar-outline" size={18} color={MUTED} />
              </TouchableOpacity>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Return Date</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowReturnDatePicker(true)}
              >
                <Text style={styles.pickerText}>{readableDate(returnDate)}</Text>
                <Ionicons name="calendar-outline" size={18} color={MUTED} />
              </TouchableOpacity>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Pickup Time</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPickupTimePicker(true)}
              >
                <Text style={styles.pickerText}>{readableTime(pickupTime)}</Text>
                <Ionicons name="time-outline" size={18} color={MUTED} />
              </TouchableOpacity>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Return Time</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowReturnTimePicker(true)}
              >
                <Text style={styles.pickerText}>{readableTime(returnTime)}</Text>
                <Ionicons name="time-outline" size={18} color={MUTED} />
              </TouchableOpacity>
            </View>
          </View>

          {showPickupDatePicker && (
            <DateTimePicker
              value={pickupDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") setShowPickupDatePicker(false);
                if (selectedDate) {
                  setPickupDate(selectedDate);

                  if (returnDate && selectedDate >= returnDate) {
                    setReturnDate(null);
                  }
                }
              }}
            />
          )}

          {showReturnDatePicker && (
            <DateTimePicker
              value={returnDate || pickupDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={pickupDate || new Date()}
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") setShowReturnDatePicker(false);
                if (selectedDate) setReturnDate(selectedDate);
              }}
            />
          )}

          {showPickupTimePicker && (
            <DateTimePicker
              value={pickupTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                if (Platform.OS === "android") setShowPickupTimePicker(false);
                if (selectedTime) setPickupTime(selectedTime);
              }}
            />
          )}

          {showReturnTimePicker && (
            <DateTimePicker
              value={returnTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                if (Platform.OS === "android") setShowReturnTimePicker(false);
                if (selectedTime) setReturnTime(selectedTime);
              }}
            />
          )}

          <Text style={styles.label}>Service Type</Text>
          <View style={styles.serviceList}>
            {serviceTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.serviceChip,
                  String(serviceTypeId) === String(item.id) && styles.serviceChipActive,
                ]}
                onPress={() => setServiceTypeId(String(item.id))}
              >
                <Text
                  style={[
                    styles.serviceChipText,
                    String(serviceTypeId) === String(item.id) && styles.serviceChipTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="09XX XXX XXXX"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            maxLength={13}
          />

          {needsLocation && (
            <>
              <Text style={styles.label}>Pickup / Delivery Location</Text>
              <TextInput
                style={styles.input}
                value={serviceLocation}
                onChangeText={setServiceLocation}
                placeholder="Enter address or landmark"
                placeholderTextColor="#94A3B8"
              />
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Use Points</Text>

          <View style={styles.pointsHeader}>
            <View>
              <Text style={styles.pointsLabel}>Available Points</Text>
              <Text style={styles.pointsValue}>
                {Number(availablePoints).toLocaleString()} pts
              </Text>
              <Text style={styles.pointsHelp}>10 points = ₱1 discount</Text>
            </View>

            <TouchableOpacity
              style={[styles.toggle, usePoints && styles.toggleActive]}
              onPress={() => setUsePoints(!usePoints)}
            >
              <View style={[styles.toggleCircle, usePoints && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>

          {usePoints && (
            <View style={styles.pointsInputRow}>
              <TextInput
                value={pointsToUse}
                onChangeText={setPointsToUse}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#94A3B8"
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />

              <TouchableOpacity style={styles.useMaxButton} onPress={handleUseMaxPoints}>
                <Text style={styles.useMaxText}>Use Max</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily Rate</Text>
            <Text style={styles.summaryValue}>
              ₱{Number(car?.price_per_day || 0).toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rental Days</Text>
            <Text style={styles.summaryValue}>{totalDays} days</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Before Discount</Text>
            <Text style={styles.summaryValue}>
              ₱{Number(totalBeforeDiscount).toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Points Discount</Text>
            <Text style={styles.discountValue}>
              -₱{Number(pointsDiscount).toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Final Total</Text>
            <Text style={styles.totalValue}>₱{Number(finalTotal).toLocaleString()}</Text>
          </View>
        </View>



        <View style={styles.termsCard}>
          <View style={styles.termsHeader}>
            <View style={styles.termsIconBox}>
              <Ionicons name="document-text-outline" size={24} color={ORANGE} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.termsTitle}>Rental Terms & Conditions</Text>
              <Text style={styles.termsSubtitle}>
                Please review and accept the rental policy before confirming your booking.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewTermsButton}
            onPress={() => setShowTermsModal(true)}
          >
            <Text style={styles.viewTermsText}>View Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={18} color={ORANGE} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.agreeRow}
            onPress={() => setAgreeTerms(!agreeTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
              {agreeTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>

            <Text style={styles.termsText}>
              I have read and agree to the rental terms and conditions.
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
  visible={showTermsModal}
  animationType="slide"
  transparent
  onRequestClose={() => setShowTermsModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Terms & Conditions</Text>

        <TouchableOpacity onPress={() => setShowTermsModal(false)}>
          <Ionicons name="close" size={24} color={DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {TERMS.map((term, index) => (
          <View key={index} style={styles.termItem}>
            <View style={styles.termNumber}>
              <Text style={styles.termNumberText}>{index + 1}</Text>
            </View>

            <Text style={styles.termText}>{term}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.modalAgreeButton}
          onPress={() => {
            setAgreeTerms(true);
            setShowTermsModal(false);
          }}
        >
          <Text style={styles.modalAgreeText}>I Agree</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </View>
</Modal>

        <TouchableOpacity
          style={[styles.confirmButton, (!agreeTerms || checking) && styles.confirmButtonDisabled]}
          disabled={!agreeTerms || checking}
          onPress={confirmBooking}
        >
          {checking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
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
  container: {
    padding: 20,
    paddingBottom: 40,
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
  iconPlaceholder: {
    width: 44,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: DARK,
  },
  carCard: {
    marginTop: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  carImageBox: {
    width: 92,
    height: 82,
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
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 17,
    fontWeight: "900",
    color: DARK,
  },
  carMeta: {
    color: MUTED,
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  carPrice: {
    marginTop: 6,
    color: ORANGE,
    fontSize: 16,
    fontWeight: "900",
  },
  card: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: DARK,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
  },
  label: {
    color: DARK,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    marginTop: 4,
  },
  pickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    color: DARK,
    fontWeight: "700",
    fontSize: 12,
  },
  serviceList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  serviceChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  serviceChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  serviceChipText: {
    color: MUTED,
    fontWeight: "800",
    fontSize: 12,
  },
  serviceChipTextActive: {
    color: "#FFFFFF",
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    paddingHorizontal: 14,
    color: DARK,
    fontWeight: "700",
    marginBottom: 12,
  },
  pointsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsLabel: {
    color: MUTED,
    fontWeight: "700",
  },
  pointsValue: {
    color: GREEN,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  pointsHelp: {
    marginTop: 4,
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  toggle: {
    width: 58,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  toggleActive: {
    backgroundColor: ORANGE,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  toggleCircleActive: {
    alignSelf: "flex-end",
  },
  pointsInputRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  useMaxButton: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  useMaxText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
    gap: 10,
  },
  summaryLabel: {
    color: MUTED,
    fontWeight: "700",
  },
  summaryValue: {
    color: DARK,
    fontWeight: "900",
  },
  discountValue: {
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
    color: GREEN,
    fontSize: 20,
    fontWeight: "900",
  },
  termsRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  termsText: {
    flex: 1,
    color: MUTED,
    lineHeight: 20,
    fontWeight: "700",
  },
  confirmButton: {
    marginTop: 24,
    height: 58,
    backgroundColor: ORANGE,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  termsCard: {
  marginTop: 22,
  backgroundColor: "#FFFFFF",
  borderRadius: 22,
  padding: 16,
  borderWidth: 1,
  borderColor: "#FED7AA",
},
termsHeader: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
},
termsIconBox: {
  width: 46,
  height: 46,
  borderRadius: 15,
  backgroundColor: "#FFF7ED",
  alignItems: "center",
  justifyContent: "center",
},
termsTitle: {
  color: DARK,
  fontSize: 15,
  fontWeight: "900",
},
termsSubtitle: {
  color: MUTED,
  fontSize: 12,
  fontWeight: "700",
  marginTop: 3,
  lineHeight: 18,
},
viewTermsButton: {
  marginTop: 14,
  paddingVertical: 13,
  paddingHorizontal: 14,
  borderRadius: 15,
  backgroundColor: "#FFF7ED",
  borderWidth: 1,
  borderColor: "#FED7AA",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},
viewTermsText: {
  color: ORANGE,
  fontWeight: "900",
},
agreeRow: {
  marginTop: 14,
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 10,
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
  justifyContent: "flex-end",
},
modalCard: {
  maxHeight: "86%",
  backgroundColor: "#FFFFFF",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  padding: 20,
},
modalHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},
modalTitle: {
  fontSize: 20,
  fontWeight: "900",
  color: DARK,
},
termItem: {
  flexDirection: "row",
  gap: 12,
  padding: 14,
  borderRadius: 16,
  backgroundColor: "#F8FAFC",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  marginBottom: 10,
},
termNumber: {
  width: 30,
  height: 30,
  borderRadius: 10,
  backgroundColor: "#FFF7ED",
  alignItems: "center",
  justifyContent: "center",
},
termNumberText: {
  color: ORANGE,
  fontWeight: "900",
},
termText: {
  flex: 1,
  color: DARK,
  fontSize: 13,
  fontWeight: "700",
  lineHeight: 20,
},
modalAgreeButton: {
  height: 54,
  borderRadius: 16,
  backgroundColor: ORANGE,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 10,
  marginBottom: 20,
},
modalAgreeText: {
  color: "#FFFFFF",
  fontWeight: "900",
  fontSize: 15,
},

});

