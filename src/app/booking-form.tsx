import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ORANGE = '#F97316';
const DARK = '#0F172A';
const MUTED = '#64748B';

export default function BookingFormScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Booking Form</Text>

          <View style={styles.iconPlaceholder} />
        </View>

        <View style={styles.carSummary}>
          <View style={styles.carIcon}>
            <Ionicons name="car-sport-outline" size={42} color={ORANGE} />
          </View>

          <View style={styles.carInfo}>
            <Text style={styles.carName}>Toyota Camry</Text>
            <Text style={styles.carText}>₱2,500 / day</Text>
            <Text style={styles.carText}>Automatic • 5 seats</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Customer Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput placeholder="Enter full name" placeholderTextColor="#94A3B8" style={styles.input} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput placeholder="Enter address" placeholderTextColor="#94A3B8" style={styles.input} />
        </View>

        <Text style={styles.sectionTitle}>Rental Schedule</Text>

        <View style={styles.dateRow}>
          <View style={styles.dateBox}>
            <Text style={styles.label}>Pickup Date</Text>
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>May 10, 2026</Text>
              <Ionicons name="calendar-outline" size={19} color={MUTED} />
            </View>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.label}>Return Date</Text>
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>May 12, 2026</Text>
              <Ionicons name="calendar-outline" size={19} color={MUTED} />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Location</Text>
          <TextInput
            placeholder="Pickup / delivery location"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily Rate</Text>
            <Text style={styles.summaryValue}>₱2,500</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Number of Days</Text>
            <Text style={styles.summaryValue}>2 days</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₱5,000</Text>
          </View>
        </View>

        <Link href="/(tabs)/payments" asChild>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.note}>
          After confirming the booking, your payment will be marked as awaiting payment until you
          upload your receipt.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingBottom: 90,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 44,
  },
  topTitle: {
    color: DARK,
    fontWeight: '900',
    fontSize: 17,
  },
  carSummary: {
    marginTop: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
  },
  carIcon: {
    width: 82,
    height: 82,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  carName: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  carText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: DARK,
    fontSize: 15,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  dateBox: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  summaryTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryLabel: {
    color: MUTED,
    fontWeight: '700',
  },
  summaryValue: {
    color: DARK,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  totalLabel: {
    color: DARK,
    fontSize: 16,
    fontWeight: '900',
  },
  totalValue: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: '900',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  note: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 12,
  },
});