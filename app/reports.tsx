import { router } from "expo-router";
import { useEffect, useRef } from "react";
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

const G = "#C9A84C";
const CARD = "#111111";
const BG = "#0A0A0A";

export default function Reports() {
  const fade = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[s.root, { opacity: fade }]}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page header */}
        <Text style={s.pageTitle}>Your Reports</Text>
        <Text style={s.pageSub}>
          All property assessments you've purchased.
        </Text>
        <View style={s.divider} />

        {/* Empty state */}
        <View style={s.emptyCard}>
          <Text style={s.emptyIcon}>◧</Text>
          <Text style={s.emptyTitle}>No Reports Yet</Text>
          <Text style={s.emptyBody}>
            Complete a property survey to generate your first risk report.
          </Text>
          <TouchableOpacity
            style={s.btn}
            onPress={() => router.push("/survey")}
            activeOpacity={0.85}
          >
            <Text style={s.btnText}>START SURVEY</Text>
            <Text style={s.btnArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.ghostBtn} activeOpacity={0.75}>
          <Text style={s.ghostText}>REFRESH REPORTS</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 22, paddingBottom: 40 },

  pageTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  pageSub: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 },
  divider: {
    height: 1,
    backgroundColor: "rgba(201,168,76,0.2)",
    marginBottom: 24,
  },

  emptyCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
    borderRadius: 2,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  emptyIcon: { color: G, fontSize: 40 },
  emptyTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyBody: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: G,
    height: 52,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  btnText: {
    color: "#0A0A0A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
  },
  btnArrow: { color: "#0A0A0A", fontSize: 16, fontWeight: "700" },

  ghostBtn: {
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.3)",
    borderRadius: 2,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { color: G, fontSize: 11, fontWeight: "700", letterSpacing: 3 },
});
