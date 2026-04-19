import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const GOLD_DARK = "#9A7A2E";
const BLACK = "#0A0A0A";
const BLACK_CARD = "#111111";
const BLACK_INPUT = "#1A1A1A";
const WHITE = "#FFFFFF";
const WHITE_DIM = "rgba(255,255,255,0.55)";
const BORDER = "rgba(201,168,76,0.3)";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("All fields required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/home");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={BLACK} />

      {/* Gold accent lines */}
      <View style={styles.accentTopLeft} />
      <View style={styles.accentBottomRight} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Brand Block */}
        <Animated.View
          style={[
            styles.brandBlock,
            { opacity: fadeAnim, transform: [{ scale: logoScale }] },
          ]}
        >
          {/* Geometric crest */}
          <View style={styles.crestOuter}>
            <View style={styles.crestInner}>
              <View style={styles.crestDiamond} />
            </View>
          </View>

          <Text style={styles.brandName}>TRUSZED</Text>
          <Text style={styles.brandSub}>PROPERTIES</Text>
          <View style={styles.brandDivider} />
          <Text style={styles.brandTagline}>Risk. Assessed. Assured.</Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          {/* Gold rule */}
          <View style={styles.rule} />

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View
              style={[
                styles.inputWrap,
                emailFocused && styles.inputWrapFocused,
              ]}
            >
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor={WHITE_DIM}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View
              style={[
                styles.inputWrap,
                passwordFocused && styles.inputWrapFocused,
              ]}
            >
              <Text style={styles.inputIcon}>⬤</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={WHITE_DIM}
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>
          </View>

          {/* Forgot */}
          <TouchableOpacity
            onPress={() => router.push("/forgot")}
            style={styles.forgotWrap}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginBtn}
            activeOpacity={0.85}
            disabled={loading}
          >
            <View style={styles.loginBtnInner}>
              {loading ? (
                <ActivityIndicator color={BLACK} />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>SIGN IN</Text>
                  <Text style={styles.loginBtnArrow}>→</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Create Account */}
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            style={styles.signupBtn}
            activeOpacity={0.75}
          >
            <Text style={styles.signupBtnText}>CREATE AN ACCOUNT</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
          Secure · Trusted · Professional
        </Animated.Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLACK,
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  // Accent corner lines
  accentTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: GOLD_DARK,
    opacity: 0.5,
  },
  accentBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: GOLD_DARK,
    opacity: 0.5,
  },

  // Brand block
  brandBlock: {
    alignItems: "center",
    marginBottom: 36,
  },
  crestOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "rgba(201,168,76,0.07)",
  },
  crestInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  crestDiamond: {
    width: 18,
    height: 18,
    backgroundColor: GOLD,
    transform: [{ rotate: "45deg" }],
  },
  brandName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 30,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: 10,
  },
  brandSub: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 11,
    color: GOLD,
    letterSpacing: 8,
    marginTop: 2,
  },
  brandDivider: {
    width: 40,
    height: 1,
    backgroundColor: GOLD,
    marginVertical: 12,
  },
  brandTagline: {
    fontSize: 11,
    color: WHITE_DIM,
    letterSpacing: 3,
    fontStyle: "italic",
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: BLACK_CARD,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 28,
  },
  cardTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    color: WHITE,
    fontWeight: "600",
    letterSpacing: 1,
  },
  cardSubtitle: {
    fontSize: 13,
    color: WHITE_DIM,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  rule: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 20,
  },

  // Fields
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 10,
    color: GOLD,
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: "600",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BLACK_INPUT,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapFocused: {
    borderColor: GOLD,
    backgroundColor: "rgba(201,168,76,0.05)",
  },
  inputIcon: {
    fontSize: 12,
    color: GOLD_DARK,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: WHITE,
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // Forgot
  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    color: GOLD,
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // Login button
  loginBtn: {
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: GOLD,
  },
  loginBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    gap: 8,
  },
  loginBtnText: {
    color: BLACK,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
  },
  loginBtnArrow: {
    color: BLACK,
    fontSize: 18,
    fontWeight: "700",
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    color: WHITE_DIM,
    fontSize: 11,
    letterSpacing: 2,
  },

  // Signup button
  signupBtn: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 2,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  signupBtnText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
  },

  // Footer
  footer: {
    marginTop: 32,
    fontSize: 10,
    color: "rgba(255,255,255,0.2)",
    letterSpacing: 3,
    textAlign: "center",
  },
});
