import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const G = "#C9A84C";
const G_DIM = "rgba(201,168,76,0.15)";
const CARD = "#111111";
const BG = "#0A0A0A";

// ✅ FULL STEPS (MATCHES YOUR API)
const STEPS = [
  {
    key: "title_seen",
    title: "Title Seen",
    type: "options",
    options: ["yes", "trusted", "no"],
  },
  {
    key: "verified_registry",
    title: "Verified at Registry",
    type: "options",
    options: ["yes", "rep", "no"],
  },
  {
    key: "file_number",
    title: "File Number",
    type: "text",
    placeholder: "Enter file number",
  },
  { key: "agis_pin", title: "AGIS Pin", type: "yesno" },
  { key: "contract", title: "Contract of Sale", type: "yesno" },

  {
    key: "zoning",
    title: "Zoning",
    type: "options",
    options: [
      "residential",
      "commercial",
      "agricultural",
      "industrial",
      "not_sure",
    ],
  },
  { key: "plot_verified", title: "Plot Verified", type: "yesno" },
  { key: "setback", title: "Setback Confirmed", type: "yesno" },
  { key: "master_plan", title: "Master Plan Checked", type: "yesno" },
  { key: "topography", title: "Topography Checked", type: "yesno" },
  { key: "survey", title: "Survey Available", type: "yesno" },
  { key: "excision", title: "Excision Status", type: "yesno" },
  { key: "coordinates", title: "Coordinates Verified", type: "yesno" },
  {
    key: "approval_number",
    title: "Approval Number",
    type: "text",
    placeholder: "Optional",
  },

  { key: "beacons", title: "Beacons Present", type: "yesno" },
  { key: "neighbors", title: "Neighbors Confirmed", type: "yesno" },
  { key: "encroachment", title: "Encroachment", type: "yesno" },
  { key: "utilities", title: "Utilities Available", type: "yesno" },

  {
    key: "owner_name",
    title: "Owner Name",
    type: "text",
    placeholder: "Enter owner name",
  },
  { key: "nin_verified", title: "NIN Verified", type: "yesno" },

  { key: "mortgage", title: "Mortgage", type: "yesno" },
  { key: "litigation", title: "Litigation", type: "yesno" },
  { key: "authority", title: "Authority to Sell", type: "yesno" },
  { key: "community", title: "Community Verified", type: "yesno" },
];

const TOTAL = STEPS.length;

// ── Components ─────────────────────────────────────
function YesNo({ value, onChange }: any) {
  return (
    <View style={s.yesnoRow}>
      {["yes", "no"].map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[s.yesnoBtn, value === opt && s.yesnoActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[s.yesnoText, value === opt && s.yesnoTextActive]}>
            {opt.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Options({ options, value, onChange }: any) {
  return (
    <View style={s.optionList}>
      {options.map((opt: string) => (
        <TouchableOpacity
          key={opt}
          style={[s.optionBtn, value === opt && s.optionBtnActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[s.optionText, value === opt && s.optionTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Main ───────────────────────────────────────────
export default function Survey() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const current = STEPS[step];
  const value = form[current.key] || "";
  const progress = (step + 1) / TOTAL;

  const update = (k: string, v: string) =>
    setForm((f: any) => ({ ...f, [k]: v }));

  const next = () => {
    if (!value) return;
    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);

  const submit = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://truszedproperties.com/api/risk_calculator_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const text = await res.text();
      console.log("RAW:", text);

      const data = JSON.parse(text);

      router.replace({
        pathname: "/result",
        params: {
          score: data.total_score,
          verdict: data.verdict,
          insights: JSON.stringify(data.insights),
        },
      });
    } catch (e) {
      alert("Error submitting survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior="padding">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[s.topBar, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={step === 0 ? () => router.back() : prev}>
          <Text style={{ color: G }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: G }}>
          {step + 1} / {TOTAL}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Progress */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <Animated.View style={[s.card]}>
          <Text style={s.cardTitle}>{current.title}</Text>

          {/* Field */}
          {current.type === "yesno" && (
            <YesNo
              value={value}
              onChange={(v: string) => update(current.key, v)}
            />
          )}

          {current.type === "options" && (
            <Options
              options={current.options}
              value={value}
              onChange={(v: string) => update(current.key, v)}
            />
          )}

          {current.type === "text" && (
            <TextInput
              placeholder={current.placeholder}
              placeholderTextColor="#777"
              value={value}
              onChangeText={(v) => update(current.key, v)}
              style={s.input}
            />
          )}
        </Animated.View>

        <TouchableOpacity
          style={[s.nextBtn, !value && { opacity: 0.3 }]}
          onPress={step < TOTAL - 1 ? next : submit}
          disabled={loading}
        >
          <Text style={s.nextBtnText}>
            {loading ? "Processing..." : step < TOTAL - 1 ? "Next" : "Submit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { padding: 20 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  progressTrack: {
    height: 4,
    backgroundColor: "#222",
  },
  progressFill: {
    height: 4,
    backgroundColor: G,
  },

  card: {
    backgroundColor: CARD,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 15,
  },

  optionList: { gap: 10 },
  optionBtn: {
    padding: 15,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
  },
  optionBtnActive: { borderColor: G, borderWidth: 1 },
  optionText: { color: "#aaa" },
  optionTextActive: { color: "#fff" },

  yesnoRow: { flexDirection: "row", gap: 10 },
  yesnoBtn: {
    flex: 1,
    padding: 15,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
  },
  yesnoActive: { backgroundColor: G },
  yesnoText: { color: "#aaa" },
  yesnoTextActive: { color: "#000" },

  input: {
    backgroundColor: "#1A1A1A",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
  },

  nextBtn: {
    backgroundColor: G,
    padding: 18,
    alignItems: "center",
    borderRadius: 10,
  },
  nextBtnText: { fontWeight: "bold" },
});
