import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F97316";
const DARK = "#0F172A";
const MUTED = "#64748B";
const API_URL = "https://car-rental.free.laravel.cloud/api";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user || data);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        { text: "Exit", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color={DARK} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || "U").charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>
            {loadingProfile ? "Loading..." : user?.name || "User"}
          </Text>

          <Text style={styles.email}>{user?.email || "No email"}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons name="create-outline" size={17} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="call-outline" size={20} color={ORANGE} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>
                {user?.phone || "No phone number yet"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={20} color={ORANGE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {user?.address || "No address yet"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitleOutside}>Menu</Text>

        <View style={styles.menuCard}>
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="View booking updates"
            onPress={() => router.push("/notifications")}
          />

          <MenuItem
            icon="star-outline"
            title="Rewards"
            subtitle="View points history"
            onPress={() => router.push("/rewards")}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Change password"
            onPress={() => router.push("/change-password")}
          />

          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Contact rental support"
            onPress={needHelp}
          />

          <MenuItem
            icon="information-circle-outline"
            title="About"
            subtitle="About Dumaguete EZE"
          />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Link href="/" asChild>
          <TouchableOpacity>
            <Text style={styles.backHome}>Back to Welcome Page</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={21} color={ORANGE} />
      </View>

      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: DARK,
    fontSize: 28,
    fontWeight: "900",
  },
  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  profileCard: {
    marginTop: 22,
    backgroundColor: ORANGE,
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: ORANGE,
    fontSize: 34,
    fontWeight: "900",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  email: {
    color: "#FFEDD5",
    marginTop: 4,
    fontWeight: "700",
  },
  editButton: {
    marginTop: 16,
    backgroundColor: DARK,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  infoCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 14,
  },
  sectionTitleOutside: {
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  infoValue: {
    color: DARK,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  menuItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  menuInfo: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    color: DARK,
    fontWeight: "900",
    fontSize: 15,
  },
  menuSubtitle: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  logoutButton: {
    marginTop: 18,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "900",
    fontSize: 15,
  },
  backHome: {
    marginTop: 16,
    textAlign: "center",
    color: MUTED,
    fontWeight: "800",
  },
});
