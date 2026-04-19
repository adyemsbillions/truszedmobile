import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const G = "#C9A84C";

const FEATURES = [
  { icon: "◈", label: "Instant Risk Score" },
  { icon: "◉", label: "Legal & Ownership Checks" },
  { icon: "◎", label: "Detailed Paid Reports" },
];

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((t) => setIsLoggedIn(!!t))
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.spring(slide, {
            toValue: 0,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
          }),
        ]).start();
      });
  }, []);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <View style={s.cornerTL} />
      <View style={s.cornerBR} />

      <Animated.View
        style={[
          s.content,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        {/* Brand */}
        <View style={s.brandWrap}>
          <View style={s.crest}>
            <View style={s.crestRing}>
              <View style={s.diamond} />
            </View>
          </View>
          <Text style={s.name}>TRUSZED</Text>
          <Text style={s.sub}>PROPERTIES</Text>
          <View style={s.rule} />
        </View>

        {/* Hero text */}
        <View style={s.heroWrap}>
          <Text style={s.hero}>Smart Property{"\n"}Risk Assessment</Text>
          <Text style={s.body}>
            Analyze any property before you buy. Get instant risk scores, legal
            insights, and detailed reports — all in one place.
          </Text>
        </View>

        {/* Features */}
        <View style={s.features}>
          {FEATURES.map(({ icon, label }) => (
            <View key={label} style={s.featureRow}>
              <Text style={s.featureIcon}>{icon}</Text>
              <Text style={s.featureLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={s.cta}>
          {loading ? (
            <ActivityIndicator color={G} size="large" />
          ) : (
            <>
              <TouchableOpacity
                style={s.btn}
                activeOpacity={0.85}
                onPress={() =>
                  isLoggedIn ? router.replace("/home") : router.push("/login")
                }
              >
                <Text style={s.btnText}>
                  {isLoggedIn ? "CONTINUE" : "GET STARTED"}
                </Text>
                <Text style={s.btnArrow}>→</Text>
              </TouchableOpacity>

              {!isLoggedIn && (
                <TouchableOpacity
                  onPress={() => router.push("/signup")}
                  style={s.ghost}
                >
                  <Text style={s.ghostText}>CREATE AN ACCOUNT</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <Text style={s.footer}>Secure · Trusted · Professional</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A0A" },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 70,
    height: 70,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#9A7A2E",
    opacity: 0.5,
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 70,
    height: 70,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#9A7A2E",
    opacity: 0.5,
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 36,
    justifyContent: "space-between",
  },

  // Brand
  brandWrap: { alignItems: "center" },
  crest: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: G,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,76,0.07)",
    marginBottom: 12,
  },
  crestRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#E8C97A",
    alignItems: "center",
    justifyContent: "center",
  },
  diamond: {
    width: 14,
    height: 14,
    backgroundColor: G,
    transform: [{ rotate: "45deg" }],
  },
  name: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 10,
  },
  sub: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 10,
    color: G,
    letterSpacing: 7,
    marginTop: 2,
  },
  rule: { width: 36, height: 1, backgroundColor: G, marginTop: 14 },

  // Hero
  heroWrap: { marginTop: 8 },
  hero: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 40,
  },
  body: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },

  // Features
  features: { gap: 10 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
    borderRadius: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  featureIcon: { color: G, fontSize: 16 },
  featureLabel: { color: "#fff", fontSize: 14, letterSpacing: 0.4 },

  // CTA
  cta: { gap: 12 },
  btn: {
    backgroundColor: G,
    height: 54,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: {
    color: "#0A0A0A",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
  },
  btnArrow: { color: "#0A0A0A", fontSize: 18, fontWeight: "700" },
  ghost: {
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.35)",
    borderRadius: 2,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { color: G, fontSize: 12, fontWeight: "700", letterSpacing: 3 },

  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.18)",
    fontSize: 10,
    letterSpacing: 3,
  },
});
