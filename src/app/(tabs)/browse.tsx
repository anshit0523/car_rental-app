import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const cars = [
  {
    id: 1,
    model: 'Toyota Vios',
    type: 'Sedan',
    seats: 5,
    transmission: 'Automatic',
    price: '₱1,800/day',
    status: 'Available',
  },
  {
    id: 2,
    model: 'Toyota Camry',
    type: 'Sedan',
    seats: 5,
    transmission: 'Automatic',
    price: '₱2,500/day',
    status: 'Available',
  },
  {
    id: 3,
    model: 'Mitsubishi Xpander',
    type: 'MPV',
    seats: 7,
    transmission: 'Automatic',
    price: '₱2,800/day',
    status: 'Available',
  },
  {
    id: 4,
    model: 'Toyota Innova',
    type: 'Van',
    seats: 7,
    transmission: 'Manual',
    price: '₱3,000/day',
    status: 'Reserved',
  },
];

const ORANGE = '#F97316';
const DARK = '#0F172A';
const MUTED = '#64748B';

export default function BrowseCarsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageLabel}>Browse</Text>
            <Text style={styles.title}>Available Cars</Text>
          </View>

          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={22} color={DARK} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={MUTED} />
          <TextInput
            placeholder="Search car model..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {['All', 'Sedan', 'SUV', 'Van', 'MPV', 'Automatic'].map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.categoryChip, index === 0 && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, index === 0 && styles.categoryTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.list}>
          {cars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              <View style={styles.carImage}>
                <Ionicons name="car-sport-outline" size={48} color={ORANGE} />
              </View>

              <View style={styles.carInfo}>
                <View style={styles.carTop}>
                  <View>
                    <Text style={styles.carModel}>{car.model}</Text>
                    <Text style={styles.carType}>{car.type}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      car.status === 'Reserved' && styles.statusBadgeReserved,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        car.status === 'Reserved' && styles.statusTextReserved,
                      ]}
                    >
                      {car.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={15} color={MUTED} />
                    <Text style={styles.detailText}>{car.seats} Seats</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="settings-outline" size={15} color={MUTED} />
                    <Text style={styles.detailText}>{car.transmission}</Text>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <Text style={styles.price}>{car.price}</Text>

                  <Link href="/car-details" asChild>
                    <TouchableOpacity style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          ))}
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
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    color: DARK,
    marginTop: 2,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchBox: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: DARK,
  },
  categoryRow: {
    gap: 10,
    paddingVertical: 18,
  },
  categoryChip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  categoryText: {
    color: MUTED,
    fontWeight: '800',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 14,
  },
  carCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
  },
  carImage: {
    width: 104,
    height: 122,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carInfo: {
    flex: 1,
    marginLeft: 14,
  },
  carTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  carModel: {
    color: DARK,
    fontSize: 17,
    fontWeight: '900',
  },
  carType: {
    color: MUTED,
    fontSize: 13,
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
    height: 28,
  },
  statusBadgeReserved: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '900',
  },
  statusTextReserved: {
    color: '#92400E',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: '900',
  },
  viewButton: {
    backgroundColor: DARK,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 14,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});