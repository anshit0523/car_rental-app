import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#f97316";
const notifications: {
  id: number;
  type: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}[] = [
  {
    id: 1,
    type: "Bookings",
    icon: "calendar",
    title: "Booking Confirmed",
    message: "Your booking for Toyota Vios on May 25, 2025 is confirmed.",
    time: "9:30 AM",
    unread: true,
  },
  {
    id: 2,
    type: "Payments",
    icon: "cash",
    title: "Payment Received",
    message: "We have received your payment of ₱2,500.00. Thank you!",
    time: "9:15 AM",
    unread: true,
  },
  {
    id: 3,
    type: "Bookings",
    icon: "car",
    title: "Vehicle Ready",
    message: "Toyota Vios is now ready for pickup.",
    time: "8:45 AM",
    unread: false,
  },
  {
    id: 4,
    type: "System",
    icon: "megaphone",
    title: "Promo Available",
    message: "Get 10% OFF on your next booking!",
    time: "Yesterday",
    unread: true,
  },
];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? notifications
      : notifications.filter((item) => item.type === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {["All", "Bookings", "Payments", "System"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="notifications-outline" size={72} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyText}>
            You’ll see booking, payment, and system updates here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <Text style={styles.sectionTitle}>Today</Text>

          {filtered.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={24} color={ORANGE} />
              </View>

              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
              </View>

              <View style={styles.rightSide}>
                <Text style={styles.time}>{item.time}</Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7ED",
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: ORANGE,
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  activeTabText: {
    color: ORANGE,
  },
  list: {
    padding: 18,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#6B7280",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  rightSide: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  time: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 10,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },
  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
});