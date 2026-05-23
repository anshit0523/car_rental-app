import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const payments = [
  {
    id: 1,
    car: 'Toyota Camry',
    amount: '₱5,000',
    status: 'Awaiting Payment',
    date: 'May 10, 2026',
  },
  {
    id: 2,
    car: 'Toyota Vios',
    amount: '₱3,600',
    status: 'Pending Verification',
    date: 'May 8, 2026',
  },
];

const ORANGE = '#F97316';
const DARK = '#0F172A';
const MUTED = '#64748B';

export default function PaymentsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
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
            Upload your payment receipt after confirming your booking. Admin or staff will verify
            your payment.
          </Text>
        </View>

        <View style={styles.list}>
          {payments.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentTop}>
                <View>
                  <Text style={styles.carName}>{payment.car}</Text>
                  <Text style={styles.dateText}>Booked date: {payment.date}</Text>
                </View>

                <Text style={styles.amount}>{payment.amount}</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{payment.status}</Text>
              </View>

              <View style={styles.uploadBox}>
                <Ionicons name="cloud-upload-outline" size={34} color={ORANGE} />
                <Text style={styles.uploadTitle}>Upload Receipt</Text>
                <Text style={styles.uploadText}>Tap to choose image from your device</Text>
              </View>

              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Select Receipt</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Payment Methods</Text>

        <View style={styles.methodCard}>
          <View style={styles.methodIcon}>
            <Ionicons name="phone-portrait-outline" size={25} color={ORANGE} />
          </View>

          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>GCash Payment</Text>
            <Text style={styles.methodText}>Send payment to the official rental account.</Text>
          </View>
        </View>

        <View style={styles.methodCard}>
          <View style={styles.methodIcon}>
            <Ionicons name="cash-outline" size={25} color={ORANGE} />
          </View>

          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Cash Payment</Text>
            <Text style={styles.methodText}>Available for approved walk-in transactions.</Text>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageLabel: {
    color: MUTED,
    fontWeight: '700',
  },
  title: {
    color: DARK,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 2,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  infoText: {
    flex: 1,
    color: '#9A3412',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  list: {
    marginTop: 18,
    gap: 16,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  carName: {
    color: DARK,
    fontSize: 17,
    fontWeight: '900',
  },
  dateText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  amount: {
    color: ORANGE,
    fontWeight: '900',
    fontSize: 17,
  },
  statusBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusText: {
    color: '#92400E',
    fontWeight: '900',
    fontSize: 12,
  },
  uploadBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
  },
  uploadTitle: {
    color: DARK,
    fontWeight: '900',
    marginTop: 8,
  },
  uploadText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  payButton: {
    marginTop: 14,
    backgroundColor: ORANGE,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 26,
    marginBottom: 12,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodTitle: {
    color: DARK,
    fontWeight: '900',
    fontSize: 15,
  },
  methodText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
});