import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#f97316";
const API_URL = "https://car-rental.free.laravel.cloud/api";

type NotificationFilter = "all" | "unread" | "read";

type UserNotification = {
  id: number;
  title: string;
  message: string;
  link?: string | null;
  is_read: boolean;
  time: string;
  created_at?: string;
};

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<NotificationFilter>("all");
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getToken = async () => {
    return await AsyncStorage.getItem("auth_token");
  };

  const fetchNotifications = async (filter: NotificationFilter = activeTab) => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${API_URL}/notifications?filter=${filter}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to load notifications.");
        return;
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      Alert.alert("Error", "Something went wrong while loading notifications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAllRead = async () => {
    if (unreadCount <= 0) return;

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to mark all as read.");
        return;
      }

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
        })),
      );

      setUnreadCount(0);
    } catch {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const openNotification = async (notification: UserNotification) => {
    try {
      if (!notification.is_read) {
        const token = await getToken();

        await fetch(`${API_URL}/notifications/${notification.id}/read`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, is_read: true } : item,
          ),
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      const link = notification.link || "";
      const lowerLink = link.toLowerCase();

      const bookingId =
        lowerLink.match(/booking_id=(\d+)/)?.[1] ||
        lowerLink.match(/bookings\/(\d+)/)?.[1] ||
        lowerLink.match(/rentals\/(\d+)/)?.[1];

      const paymentId =
        lowerLink.match(/payment_id=(\d+)/)?.[1] ||
        lowerLink.match(/payments\/(\d+)/)?.[1];

      if (bookingId) {
        router.push({
          pathname: "/(tabs)/rentals",
          params: { booking_id: bookingId },
        });
        return;
      }

      if (paymentId) {
        router.push({
          pathname: "/(tabs)/payments",
          params: { payment_id: paymentId },
        });
        return;
      }

      if (lowerLink.includes("rentals") || lowerLink.includes("bookings")) {
        router.push("/rentals");
        return;
      }

      if (lowerLink.includes("payments") || lowerLink.includes("receipt")) {
        router.push("/payments");
        return;
      }

      if (lowerLink.includes("browse") || lowerLink.includes("cars")) {
        router.push("/browse");
        return;
      }

      router.push("/rentals");
    } catch {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(activeTab);
  }, [activeTab]);

  const changeTab = (tab: NotificationFilter) => {
    setActiveTab(tab);
    setLoading(true);
    fetchNotifications(tab);
  };

  const getIcon = (
    notification: UserNotification,
  ): keyof typeof Ionicons.glyphMap => {
    const text = `${notification.title} ${notification.message}`.toLowerCase();

    if (
      text.includes("payment") ||
      text.includes("paid") ||
      text.includes("receipt")
    ) {
      return "wallet-outline";
    }

    if (
      text.includes("booking") ||
      text.includes("reserved") ||
      text.includes("confirmed")
    ) {
      return "calendar-outline";
    }

    if (
      text.includes("car") ||
      text.includes("vehicle") ||
      text.includes("pickup")
    ) {
      return "car-sport-outline";
    }

    if (text.includes("cancel")) {
      return "close-circle-outline";
    }

    if (text.includes("return")) {
      return "return-down-back-outline";
    }

    return "notifications-outline";
  };

  useEffect(() => {
    fetchNotifications("all");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.markAllButton,
            unreadCount <= 0 && styles.markAllButtonDisabled,
          ]}
          onPress={markAllRead}
          disabled={unreadCount <= 0}
        >
          <Ionicons name="checkmark-done-outline" size={19} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {[
          { label: "All", value: "all" },
          { label: "Unread", value: "unread" },
          { label: "Read", value: "read" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, activeTab === tab.value && styles.activeTab]}
            onPress={() => changeTab(tab.value as NotificationFilter)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.value && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyScroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.emptyBox}>
            <Ionicons name="notifications-outline" size={76} color="#FDBA74" />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              Booking, payment, and system updates will appear here.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, !item.is_read && styles.unreadCard]}
              onPress={() => openNotification(item)}
              activeOpacity={0.85}
            >
              <View style={styles.iconBox}>
                <Ionicons name={getIcon(item)} size={24} color={ORANGE} />
              </View>

              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>

                  {!item.is_read && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.message} numberOfLines={2}>
                  {item.message}
                </Text>

                <Text style={styles.time}>{item.time}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#CBD5E1"
                style={styles.chevron}
              />
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#FED7AA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "700",
  },
  markAllButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  markAllButtonDisabled: {
    backgroundColor: "#FDBA74",
    opacity: 0.6,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFEDD5",
  },
  tabText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "800",
  },
  activeTabText: {
    color: ORANGE,
  },
  list: {
    padding: 18,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  unreadCard: {
    borderColor: "#FDBA74",
    backgroundColor: "#FFFBF7",
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
    marginRight: 8,
  },
  message: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
    fontWeight: "700",
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  chevron: {
    marginLeft: 8,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "700",
  },
  emptyScroll: {
    flexGrow: 1,
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
    fontWeight: "900",
    color: "#111827",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
});
