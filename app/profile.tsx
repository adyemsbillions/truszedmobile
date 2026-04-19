import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const API = "https://truszedproperties.com/api";
const G = "#C9A84C";
const G_DIM = "rgba(201,168,76,0.15)";
const CARD = "#111111";
const BG = "#0A0A0A";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        const res = await fetch(`${API}/get_user.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = JSON.parse(await res.text());
        if (data.success) setUser(data.user);
      } catch {}
    })();
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  const rows = [
    { label: "Full Name", value: user?.full_name ?? "—" },
    { label: "Email", value: user?.email ?? "—" },
    { label: "Phone", value: user?.phone_number ?? "—" },
    { label: "Member Since", value: user?.created_at ?? "—" },
  ];

  return (
    <Animated.View style={[s.root, { opacity: fade }]}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={s.avatarBlock}>
          <View style={s.avatar}>
            <Text style={s.avatarLetter}>
              {(user?.full_name?.[0] ?? "U").toUpperCase()}
            </Text>
          </View>
          <Text style={s.avatarName}>{user?.full_name ?? "User"}</Text>
          <Text style={s.avatarEmail}>{user?.email ?? ""}</Text>
        </View>

        <View style={s.divider} />

        {/* Info rows */}
        <Text style={s.sectionLabel}>ACCOUNT DETAILS</Text>
        <View style={s.card}>
          {rows.map(({ label, value }, i) => (
            <View
              key={label}
              style={[s.infoRow, i < rows.length - 1 && s.infoRowBorder]}
            >
              <Text style={s.infoLabel}>{label}</Text>
              <Text style={s.infoValue} numberOfLines={1}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[s.btn, { marginTop: 24 }]}
          onPress={logout}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>SIGN OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 22, paddingBottom: 40 },

  avatarBlock: { alignItems: "center", marginBottom: 24, gap: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: G_DIM,
    borderWidth: 2,
    borderColor: G,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: G,
    fontSize: 32,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  avatarName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  avatarEmail: { color: "rgba(255,255,255,0.4)", fontSize: 13 },

  divider: {
    height: 1,
    backgroundColor: "rgba(201,168,76,0.2)",
    marginBottom: 24,
  },
  sectionLabel: {
    color: G,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: "600",
    marginBottom: 12,
  },

  card: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
    borderRadius: 2,
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    alignItems: "center",
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  infoLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1 },
  infoValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    maxWidth: "55%",
    textAlign: "right",
  },

  btn: {
    backgroundColor: G,
    height: 52,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#0A0A0A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
  },
});
