import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API = "https://truszedproperties.com/api";
const G = "#C9A84C";

const FIELDS = [
  {
    key: "full_name",
    placeholder: "John Doe",
    icon: "◈",
    label: "FULL NAME",
    secure: false,
    keyboard: "default",
  },
  {
    key: "email",
    placeholder: "you@example.com",
    icon: "✉",
    label: "EMAIL ADDRESS",
    secure: false,
    keyboard: "email-address",
  },
  {
    key: "phone",
    placeholder: "+234 800 000 0000",
    icon: "◉",
    label: "PHONE NUMBER",
    secure: false,
    keyboard: "phone-pad",
  },
  {
    key: "password",
    placeholder: "••••••••",
    icon: "◎",
    label: "PASSWORD",
    secure: true,
    keyboard: "default",
  },
] as const;

export default function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useState(() => {
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

  const handleSignup = async () => {
    if (!form.full_name || !form.email || !form.phone || !form.password)
      return alert("All fields required");
    if (form.password.length < 6)
      return alert("Password must be at least 6 characters");
    try {
      setLoading(true);
      const res = await fetch(`${API}/signup.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone_number: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      data.success
        ? (alert("Account created successfully"), router.replace("/login"))
        : alert(data.message);
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <View style={s.cornerTL} />
      <View style={s.cornerBR} />

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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

          {/* Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Create Account</Text>
            <Text style={s.cardSub}>Join and start assessing properties</Text>
            <View style={s.divider} />

            {FIELDS.map(
              ({ key, placeholder, icon, label, secure, keyboard }) => (
                <View key={key} style={s.fieldGroup}>
                  <Text style={s.label}>{label}</Text>
                  <View
                    style={[s.inputWrap, focused === key && s.inputFocused]}
                  >
                    <Text style={s.icon}>{icon}</Text>
                    <TextInput
                      placeholder={placeholder}
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      secureTextEntry={secure}
                      autoCapitalize={key === "email" ? "none" : "words"}
                      keyboardType={keyboard as any}
                      onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      style={s.input}
                    />
                  </View>
                </View>
              ),
            )}

            <TouchableOpacity
              style={s.btn}
              activeOpacity={0.85}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0A0A0A" />
              ) : (
                <>
                  <Text style={s.btnText}>CREATE ACCOUNT</Text>
                  <Text style={s.btnArrow}>→</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={s.ghost}
            >
              <Text style={s.ghostText}>ALREADY HAVE AN ACCOUNT</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.footer}>Secure · Trusted · Professional</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48 },
  content: { gap: 28 },

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

  card: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.25)",
    borderRadius: 2,
    padding: 24,
    gap: 16,
  },
  cardTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 1,
  },
  cardSub: { color: "rgba(255,255,255,0.45)", fontSize: 13 },
  divider: { height: 1, backgroundColor: "rgba(201,168,76,0.2)" },

  fieldGroup: { gap: 6 },
  label: { fontSize: 10, color: G, letterSpacing: 2, fontWeight: "600" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    paddingHorizontal: 14,
    height: 52,
  },
  inputFocused: { borderColor: G, backgroundColor: "rgba(201,168,76,0.05)" },
  icon: { color: "#9A7A2E", fontSize: 13, marginRight: 10 },
  input: { flex: 1, color: "#fff", fontSize: 15 },

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
    borderColor: "rgba(201,168,76,0.3)",
    borderRadius: 2,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { color: G, fontSize: 11, fontWeight: "700", letterSpacing: 3 },

  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.18)",
    fontSize: 10,
    letterSpacing: 3,
  },
});
