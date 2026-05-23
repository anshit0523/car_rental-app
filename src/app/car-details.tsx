import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ORANGE = '#F97316';
const DARK = '#0F172A';
const MUTED = '#64748B';

export default function CarDetailsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Car Details</Text>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color={DARK} />
          </TouchableOpacity>
        </View>

        <View style={styles.carImage}>
          <Ionicons name="car-sport" size={100} color={ORANGE} />
        </View>

        <View style={styles.card}>
          <View style={styles.nameRow}>
            <View>
              <Text style={styles.carName}>Toyota Camry</Text>
              <Text style={styles.carType}>Premium Sedan</Text>
            </View>

            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Available</Text>
            </View>
          </View>

          <Text style={styles.price}>₱2,500 / day</Text>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Ionicons name="people-outline" size={22} color={ORANGE} />
              <Text style={styles.specValue}>5</Text>
              <Text style={styles.specLabel}>Seats</Text>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="settings-outline" size={22} color={ORANGE} />
              <Text style={styles.specValue}>Auto</Text>
              <Text style={styles.specLabel}>Transmission</Text>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="speedometer-outline" size={22} color={ORANGE} />
              <Text style={styles.specValue}>Gas</Text>
              <Text style={styles.specLabel}>Fuel</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            A comfortable and reliable sedan suitable for city travel, business trips, and family
            use. This vehicle is equipped with air conditioning, spacious seating, and smooth
            automatic transmission.
          </Text>

          <Text style={styles.sectionTitle}>Rental Includes</Text>

          <View style={styles.includeItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.includeText}>Clean and ready-to-use vehicle</Text>
          </View>

          <View style={styles.includeItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.includeText}>Booking status monitoring</Text>
          </View>

          <View style={styles.includeItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.includeText}>Payment receipt verification</Text>
          </View>

          <View style={styles.includeItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.includeText}>GPS tracking support</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total per day</Text>
          <Text style={styles.footerPrice}>₱2,500</Text>
        </View>

        <Link href="/booking-form" asChild>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: DARK,
  },
  carImage: {
    height: 220,
    marginTop: 20,
    backgroundColor: '#FFF7ED',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  carName: {
    fontSize: 25,
    fontWeight: '900',
    color: DARK,
  },
  carType: {
    color: MUTED,
    marginTop: 4,
    fontWeight: '700',
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    height: 32,
  },
  availableText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '900',
  },
  price: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '900',
    color: ORANGE,
  },
  specGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  specValue: {
    color: DARK,
    fontWeight: '900',
    marginTop: 8,
    fontSize: 15,
  },
  specLabel: {
    color: MUTED,
    fontSize: 11,
    marginTop: 3,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: '900',
    color: DARK,
  },
  description: {
    color: MUTED,
    lineHeight: 22,
    fontSize: 14,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 10,
  },
  includeText: {
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 18,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  footerPrice: {
    color: DARK,
    fontSize: 20,
    fontWeight: '900',
  },
  bookButton: {
    backgroundColor: ORANGE,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 18,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
});