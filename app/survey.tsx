import { router } from "expo-router";
import { useRef, useState } from "react";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const G = "#C9A84C";
const G_DIM = "rgba(201,168,76,0.15)";
const CARD = "#111111";
const BG = "#0A0A0A";
const TOTAL = 6;

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  {
    key: "property_type",
    title: "Property Type",
    subtitle: "What kind of property are you assessing?",
    icon: "◈",
    type: "options",
    options: [
      "Residential",
      "Commercial",
      "Industrial",
      "Land / Plot",
      "Mixed Use",
    ],
  },
  {
    key: "title_seen",
    title: "Title Document",
    subtitle: "Have you physically sighted the title document?",
    icon: "◧",
    type: "yesno",
  },
  {
    key: "zoning",
    title: "Zoning Status",
    subtitle: "What is the zoning classification of the property?",
    icon: "◉",
    type: "options",
    options: [
      "Residential",
      "Commercial",
      "Agricultural",
      "Industrial",
      "Unverified",
    ],
  },
  {
    key: "encroachment",
    title: "Encroachment",
    subtitle: "Is there any sign of encroachment on the property?",
    icon: "◎",
    type: "yesno",
  },
  {
    key: "owner_name",
    title: "Registered Owner",
    subtitle: "Enter the name of the registered property owner.",
    icon: "◈",
    type: "text",
    placeholder: "e.g. Chukwuemeka Obi",
  },
  {
    key: "mortgage",
    title: "Mortgage / Lien",
    subtitle: "Is the property under any mortgage or lien?",
    icon: "◧",
    type: "yesno",
  },
];

// ── Components ────────────────────────────────────────────────────────────────
function OptionPicker({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={s.optionList}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[s.optionBtn, active && s.optionBtnActive]}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
          >
            <View style={[s.optionDot, active && s.optionDotActive]} />
            <Text style={[s.optionText, active && s.optionTextActive]}>
              {opt}
            </Text>
            {active && <Text style={s.optionCheck}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function YesNo({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={s.yesnoRow}>
      {["Yes", "No"].map((opt) => {
        const active = value === opt.toLowerCase();
        return (
          <TouchableOpacity
            key={opt}
            style={[s.yesnoBtn, active && s.yesnoActive]}
            onPress={() => onChange(opt.toLowerCase())}
            activeOpacity={0.75}
          >
            <Text style={[s.yesnoText, active && s.yesnoTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function Survey() {
  const [step, setStep] = useState(0); // 0-indexed
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const current = STEPS[step];
  const progress = (step + 1) / TOTAL;
  const value = form[current.key] ?? "";

  const animateIn = (dir: 1 | -1) => {
    slideAnim.setValue(dir * 40);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 80,
      friction: 12,
      useNativeDriver: true,
    }).start();
  };

  const updateField = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const goNext = () => {
    if (!value) return;
    animateIn(1);
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    animateIn(-1);
    setStep((s) => s - 1);
  };

  const submitSurvey = async () => {
    if (!value) return;
    try {
      setSubmitting(true);
      const res = await fetch(
        "https://truszedproperties.com/api/risk_calculator_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      router.replace({
        pathname: "/result",
        params: {
          score: data.total_score,
          verdict: data.verdict,
          reportId: data.report_id || 1,
        },
      });
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={step === 0 ? () => router.back() : goPrev}
          style={s.backBtn}
        >
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.stepBadge}>
          <Text style={s.stepBadgeText}>
            STEP {step + 1} OF {TOTAL}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <Animated.View
          style={[s.progressFill, { width: `${progress * 100}%` }]}
        />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step dots */}
        <View style={s.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[s.dot, i === step && s.dotActive, i < step && s.dotDone]}
            />
          ))}
        </View>

        {/* Step card */}
        <Animated.View
          style={[s.card, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={s.cardIconWrap}>
            <Text style={s.cardIcon}>{current.icon}</Text>
          </View>
          <Text style={s.cardTitle}>{current.title}</Text>
          <Text style={s.cardSub}>{current.subtitle}</Text>
          <View style={s.cardDivider} />

          {/* Field */}
          {current.type === "options" && (
            <OptionPicker
              options={current.options!}
              value={value}
              onChange={(v) => updateField(current.key, v)}
            />
          )}

          {current.type === "yesno" && (
            <YesNo
              value={value}
              onChange={(v) => updateField(current.key, v)}
            />
          )}

          {current.type === "text" && (
            <View style={[s.inputWrap, focused && s.inputFocused]}>
              <TextInput
                placeholder={current.placeholder}
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={value}
                onChangeText={(v) => updateField(current.key, v)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={s.input}
                autoCapitalize="words"
              />
            </View>
          )}
        </Animated.View>

        {/* CTA */}
        <TouchableOpacity
          style={[s.nextBtn, !value && s.nextBtnDisabled]}
          onPress={step < TOTAL - 1 ? goNext : submitSurvey}
          activeOpacity={value ? 0.85 : 1}
          disabled={submitting}
        >
          <Text style={s.nextBtnText}>
            {submitting
              ? "SUBMITTING…"
              : step < TOTAL - 1
                ? "CONTINUE"
                : "SUBMIT SURVEY"}
          </Text>
          {!submitting && (
            <Text style={s.nextBtnArrow}>{step < TOTAL - 1 ? "→" : "✓"}</Text>
          )}
        </TouchableOpacity>

        {/* Skip hint */}
        {!value && (
          <Text style={s.hint}>Select an answer above to continue</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 22, paddingBottom: 48 },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { color: G, fontSize: 18 },
  stepBadge: {
    backgroundColor: G_DIM,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.3)",
  },
  stepBadgeText: {
    color: G,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },

  // Progress
  progressTrack: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 22,
    marginBottom: 24,
    borderRadius: 1,
  },
  progressFill: { height: 2, backgroundColor: G, borderRadius: 1 },

  // Dots
  dots: { flexDirection: "row", gap: 6, marginBottom: 20 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  dotActive: { backgroundColor: G, width: 20, borderRadius: 3 },
  dotDone: { backgroundColor: "rgba(201,168,76,0.4)" },

  // Card
  card: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.25)",
    borderRadius: 2,
    padding: 24,
    marginBottom: 24,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: G_DIM,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardIcon: { color: G, fontSize: 20 },
  cardTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(201,168,76,0.15)",
    marginVertical: 18,
  },

  // Options
  optionList: { gap: 10 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionBtnActive: { borderColor: G, backgroundColor: "rgba(201,168,76,0.08)" },
  optionDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
  optionDotActive: { borderColor: G, backgroundColor: G },
  optionText: { flex: 1, color: "rgba(255,255,255,0.55)", fontSize: 14 },
  optionTextActive: { color: "#fff", fontWeight: "600" },
  optionCheck: { color: G, fontSize: 14, fontWeight: "700" },

  // Yes / No
  yesnoRow: { flexDirection: "row", gap: 12 },
  yesnoBtn: {
    flex: 1,
    height: 56,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  yesnoActive: { borderColor: G, backgroundColor: "rgba(201,168,76,0.1)" },
  yesnoText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
  },
  yesnoTextActive: { color: G },

  // Text input
  inputWrap: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    height: 52,
  },
  inputFocused: { borderColor: G, backgroundColor: "rgba(201,168,76,0.05)" },
  input: { flex: 1, color: "#fff", fontSize: 15, height: "100%" },

  // Next / Submit
  nextBtn: {
    backgroundColor: G,
    height: 54,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 14,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnText: {
    color: "#0A0A0A",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
  },
  nextBtnArrow: { color: "#0A0A0A", fontSize: 18, fontWeight: "700" },

  hint: {
    textAlign: "center",
    color: "rgba(255,255,255,0.2)",
    fontSize: 11,
    letterSpacing: 1,
  },
});
