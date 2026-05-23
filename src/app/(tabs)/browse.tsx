import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../lib/api/config";

type Car = {
  id: number;
  model: string;
  price_per_day: number;
  seats: number;
  images?: string[];
  brand?: { name: string };
  fuel_type?: { type: string };
  transmission?: { type: string };
  car_type?: { type?: string; name?: string };
};

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";

export default function BrowseCarsScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchCars = async () => {
    try {
      setError("");

      const token = await AsyncStorage.getItem("auth_token");
      const params = new URLSearchParams();

      if (pickupDate && returnDate) {
        params.append("pickup_date", pickupDate);
        params.append("return_date", returnDate);
      }

      const url = params.toString()
        ? `${API_URL}/cars?${params.toString()}`
        : `${API_URL}/cars`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to load cars.");
        return;
      }

      setCars(data.cars?.data || []);
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCars();
  };

  const clearFilters = () => {
    setPickupDate("");
    setReturnDate("");
    setShowFilters(false);

    setTimeout(() => {
      fetchCars();
    }, 100);
  };

  const applyFilters = () => {
    setShowFilters(false);
    fetchCars();
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const brand = car.brand?.name || "";
      const model = car.model || "";
      const carType = car.car_type?.type || car.car_type?.name || "";
      const transmission = car.transmission?.type || "";

      const searchText = `${brand} ${model}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        carType.toLowerCase() === activeCategory.toLowerCase() ||
        transmission.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [cars, search, activeCategory]);

  const categories = ["All", "Sedan", "SUV", "Van", "Automatic"];

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading cars...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
           
            <Text style={styles.title}>Available Cars</Text>
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options-outline" size={22} color={DARK} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={MUTED} />
          <TextInput
            placeholder="Search car model..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {showFilters && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>Filter by Date</Text>

            <Text style={styles.filterLabel}>Pickup Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPickupPicker(true)}
            >
              <Ionicons name="calendar-outline" size={19} color={ORANGE} />
              <Text style={[styles.dateText, !pickupDate && styles.datePlaceholder]}>
                {pickupDate || "Select pickup date"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.filterLabel}>Return Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowReturnPicker(true)}
            >
              <Ionicons name="calendar-outline" size={19} color={ORANGE} />
              <Text style={[styles.dateText, !returnDate && styles.datePlaceholder]}>
                {returnDate || "Select return date"}
              </Text>
            </TouchableOpacity>

            {showPickupPicker && (
              <DateTimePicker
                value={pickupDate ? new Date(pickupDate) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") {
                    setShowPickupPicker(false);
                  }

                  if (selectedDate) {
                    const selected = formatDate(selectedDate);
                    setPickupDate(selected);

                    if (returnDate && new Date(returnDate) <= selectedDate) {
                      setReturnDate("");
                    }
                  }
                }}
              />
            )}

            {showReturnPicker && (
              <DateTimePicker
                value={returnDate ? new Date(returnDate) : pickupDate ? new Date(pickupDate) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={pickupDate ? new Date(pickupDate) : new Date()}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") {
                    setShowReturnPicker(false);
                  }

                  if (selectedDate) {
                    setReturnDate(formatDate(selectedDate));
                  }
                }}
              />
            )}

            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryChip,
                activeCategory === item && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {error ? (
          <View style={styles.emptyBox}>
            <Ionicons name="warning-outline" size={34} color={ORANGE} />
            <Text style={styles.emptyTitle}>Unable to load cars</Text>
            <Text style={styles.emptyText}>{error}</Text>

            <TouchableOpacity style={styles.retryButton} onPress={fetchCars}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredCars.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="car-outline" size={38} color={ORANGE} />
            <Text style={styles.emptyTitle}>No cars found</Text>
            <Text style={styles.emptyText}>
              Try another search keyword, category, or date.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredCars.map((car) => {
              const brandName = car.brand?.name || "";
              const carName = `${brandName} ${car.model}`.trim();
              const type = car.car_type?.type || car.car_type?.name || "Car";
              const transmission = car.transmission?.type || "N/A";
              const imageUrl = car.images?.[0];

              return (
                <View key={car.id} style={styles.carCard}>
                  <View style={styles.carImage}>
                    {imageUrl ? (
                      <Image source={{ uri: imageUrl }} style={styles.image} />
                    ) : (
                      <Ionicons
                        name="car-sport-outline"
                        size={48}
                        color={ORANGE}
                      />
                    )}
                  </View>

                  <View style={styles.carInfo}>
                    <View style={styles.carTop}>
                      <View style={styles.carTitleWrap}>
                        <Text style={styles.carModel}>{carName || "N/A"}</Text>
                        <Text style={styles.carType}>{type}</Text>
                      </View>

                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Available</Text>
                      </View>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name="people-outline" size={15} color={MUTED} />
                        <Text style={styles.detailText}>{car.seats} Seats</Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Ionicons
                          name="settings-outline"
                          size={15}
                          color={MUTED}
                        />
                        <Text style={styles.detailText}>{transmission}</Text>
                      </View>
                    </View>

                    <View style={styles.bottomRow}>
                      <Text style={styles.price}>
                        ₱{Number(car.price_per_day || 0).toLocaleString()}/day
                      </Text>

                      <Link
                        href={{
                          pathname: "/car-details",
                          params: { id: String(car.id) },
                        }}
                        asChild
                      >
                        <TouchableOpacity style={styles.viewButton}>
                          <Text style={styles.viewButtonText}>View</Text>
                        </TouchableOpacity>
                      </Link>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    fontSize: 27,
    fontWeight: "900",
    color: DARK,
    marginTop: 2,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchBox: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: DARK,
  },
  filterPanel: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },
  filterLabel: {
    color: DARK,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    color: DARK,
    fontWeight: "700",
  },
  datePlaceholder: {
    color: "#94A3B8",
  },
  filterActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  clearButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDBA74",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: ORANGE,
    fontWeight: "900",
  },
  applyButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  categoryRow: {
    gap: 10,
    paddingVertical: 18,
  },
  categoryChip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  categoryText: {
    color: MUTED,
    fontWeight: "800",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  list: {
    gap: 14,
  },
  carCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  carImage: {
    height: 145,
    borderRadius: 20,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  carInfo: {
    gap: 12,
  },
  carTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  carTitleWrap: {
    flex: 1,
  },
  carModel: {
    fontSize: 18,
    fontWeight: "900",
    color: DARK,
  },
  carType: {
    marginTop: 3,
    fontSize: 13,
    color: MUTED,
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#15803D",
    fontSize: 11,
    fontWeight: "900",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 14,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: ORANGE,
    fontSize: 17,
    fontWeight: "900",
  },
  viewButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
    color: DARK,
  },
  emptyText: {
    marginTop: 6,
    color: MUTED,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: ORANGE,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});