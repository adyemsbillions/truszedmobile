import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
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

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      } catch {
      } finally {
        setLoading(false);
        Animated.timing(fade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    })();
  }, []);

  if (loading)
    return (
      <View style={[s.center, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={BG} />
        <View style={s.crest}>
          <View style={s.crestRing}>
            <View style={s.diamond} />
          </View>
        </View>
        <ActivityIndicator color={G} style={{ marginTop: 24 }} />
      </View>
    );

  const stats = [
    { label: "Surveys Run", value: user?.surveys_count ?? "0" },
    { label: "Reports Bought", value: user?.reports_count ?? "0" },
    { label: "Risk Score", value: user?.avg_risk_score ?? "—" },
  ];

  // ✅ Clear, specific labels — no vague text, no duplicated "My"
  const quickActions = [
    {
      icon: "◧",
      label: "View Reports",
      sub: "Past assessments",
      action: () => router.push("/reports"),
    },
    {
      icon: "◉",
      label: "Edit Profile",
      sub: "Account & settings",
      action: () => router.push("/profile"),
    },
    {
      icon: "◎",
      label: "How It Works",
      sub: "Platform guide",
      action: () => router.push("/how-it-works"),
    },
  ];

  return (
    <Animated.View style={[s.root, { opacity: fade }]}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <View style={s.cornerTL} />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={s.crest}>
            <View style={s.crestRing}>
              <View style={s.diamond} />
            </View>
          </View>
          <View>
            <Text style={s.welcome}>Welcome back,</Text>
            <Text style={s.username}>
              {user?.full_name?.split(" ")[0] ?? "User"}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {stats.map(({ label, value }) => (
            <View key={label} style={s.statBox}>
              <Text style={s.statVal}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Primary CTA card */}
        <View style={[s.card, s.cardHighlight]}>
          <View style={s.cardIconWrap}>
            <Text style={s.cardIcon}>◈</Text>
          </View>
          <Text style={s.cardTitle}>Property Risk Analysis</Text>
          <Text style={s.cardBody}>
            Run a full assessment and get instant risk scores, legal insights,
            and a detailed report on any property.
          </Text>
          <TouchableOpacity
            style={s.btn}
            activeOpacity={0.85}
            onPress={() => router.push("/survey")}
          >
            <Text style={s.btnText}>START SURVEY</Text>
            <Text style={s.btnArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Quick actions — list style for clarity */}
        <Text style={s.sectionLabel}>QUICK ACTIONS</Text>
        <View style={s.quickList}>
          {quickActions.map(({ icon, label, sub, action }) => (
            <TouchableOpacity
              key={label}
              style={s.quickRow}
              onPress={action}
              activeOpacity={0.75}
            >
              <View style={s.quickIconWrap}>
                <Text style={s.quickIcon}>{icon}</Text>
              </View>
              <View style={s.quickText}>
                <Text style={s.quickLabel}>{label}</Text>
                <Text style={s.quickSub}>{sub}</Text>
              </View>
              <Text style={s.quickArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notice */}
        <View style={s.notice}>
          <Text style={s.noticeText}>
            ◈ All assessments are encrypted and confidential.
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  center: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: { paddingHorizontal: 22, paddingBottom: 40 },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#9A7A2E",
    opacity: 0.4,
  },

  crest: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: G,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: G_DIM,
  },
  crestRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E8C97A",
    alignItems: "center",
    justifyContent: "center",
  },
  diamond: {
    width: 12,
    height: 12,
    backgroundColor: G,
    transform: [{ rotate: "45deg" }],
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  welcome: { color: G, fontSize: 12, letterSpacing: 2 },
  username: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
    borderRadius: 2,
    paddingVertical: 14,
    alignItems: "center",
  },
  statVal: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: G,
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 4,
    textAlign: "center",
  },

  card: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
    borderRadius: 2,
    padding: 20,
    marginBottom: 16,
  },
  cardHighlight: { borderColor: "rgba(201,168,76,0.45)" },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: G_DIM,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardIcon: { color: G, fontSize: 18 },
  cardTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardBody: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },

  btn: {
    backgroundColor: G,
    height: 52,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: {
    color: "#0A0A0A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
  },
  btnArrow: { color: "#0A0A0A", fontSize: 16, fontWeight: "700" },

  sectionLabel: {
    color: G,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 8,
  },

  // List-style quick actions
  quickList: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
    borderRadius: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    gap: 14,
  },
  quickIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: G_DIM,
    alignItems: "center",
    justifyContent: "center",
  },
  quickIcon: { color: G, fontSize: 16 },
  quickText: { flex: 1 },
  quickLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  quickSub: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  quickArrow: {
    color: "rgba(201,168,76,0.5)",
    fontSize: 22,
    fontWeight: "300",
  },

  notice: {
    backgroundColor: "rgba(201,168,76,0.07)",
    borderLeftWidth: 2,
    borderLeftColor: G,
    padding: 14,
    borderRadius: 2,
  },
  noticeText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
