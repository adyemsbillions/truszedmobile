import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
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
const G_DIM = "rgba(201,168,76,0.12)";
const BG = "#0A0A0A";
const CARD = "#111111";

// ── Verdict config ─────────────────────────────────────────────────────────────
type VerdictKey = "approved" | "caution" | "rejected";

const VERDICT_CONFIG: Record<
  VerdictKey,
  {
    label: string;
    color: string;
    bg: string;
    icon: string;
    headline: string;
    summary: string;
  }
> = {
  approved: {
    label: "LOW RISK",
    color: "#4CAF50",
    bg: "rgba(76,175,80,0.1)",
    icon: "✦",
    headline: "Property Cleared for Acquisition",
    summary:
      "This property passed all critical assessment checkpoints. Our analysis indicates a strong legal standing, clear title, and favourable zoning — suitable for safe investment.",
  },
  caution: {
    label: "MODERATE RISK",
    color: "#FF9800",
    bg: "rgba(255,152,0,0.1)",
    icon: "◈",
    headline: "Proceed with Due Diligence",
    summary:
      "The property shows some areas of concern that require further investigation before committing. Consult a legal professional and request additional documentation.",
  },
  rejected: {
    label: "HIGH RISK",
    color: "#F44336",
    bg: "rgba(244,67,54,0.1)",
    icon: "✕",
    headline: "Acquisition Not Recommended",
    summary:
      "Significant red flags were identified during the assessment. This property carries substantial legal, structural, or financial risks that make it unsuitable for acquisition at this time.",
  },
};

// ── Risk factor explanations ───────────────────────────────────────────────────
const FACTOR_LABELS: Record<
  string,
  {
    label: string;
    icon: string;
    explanation: (v: string, verdict: VerdictKey) => string;
  }
> = {
  property_type: {
    label: "Property Type",
    icon: "◈",
    explanation: (v, verdict) =>
      verdict === "approved"
        ? `${v} properties in this category typically have clear regulatory frameworks and established legal precedents, reducing acquisition risk.`
        : `${v} properties carry a higher complexity of ownership transfer and may require specialist legal advice.`,
  },
  title_seen: {
    label: "Title Document",
    icon: "◧",
    explanation: (v, verdict) =>
      v === "yes"
        ? "The title document was physically sighted, confirming the legal chain of ownership and reducing the risk of fraudulent claims."
        : "No title document was sighted. This is a critical gap — unverified titles are the leading cause of property fraud in Nigeria.",
  },
  zoning: {
    label: "Zoning Classification",
    icon: "◉",
    explanation: (v, verdict) =>
      verdict === "approved"
        ? `The property is classified as ${v}, which aligns with intended use and meets regulatory requirements for development.`
        : `The ${v} zoning classification may conflict with your intended use or carry development restrictions that impact property value.`,
  },
  encroachment: {
    label: "Encroachment",
    icon: "◎",
    explanation: (v, _) =>
      v === "no"
        ? "No encroachment detected. The property boundaries are intact, reducing the likelihood of boundary disputes with neighbouring landowners."
        : "Encroachment was identified. This is a serious legal issue that could result in protracted disputes, financial loss, or loss of access to portions of the property.",
  },
  owner_name: {
    label: "Registered Owner",
    icon: "◈",
    explanation: (v, _) =>
      `The listed owner is ${v}. Cross-referencing this name against land registry records and court liens is essential to confirm rightful ownership.`,
  },
  mortgage: {
    label: "Mortgage / Lien Status",
    icon: "◧",
    explanation: (v, _) =>
      v === "no"
        ? "The property carries no mortgage or lien. This confirms it can be transferred without financial encumbrances from third-party lenders."
        : "An active mortgage or lien exists on this property. Purchasing without settling or assuming this obligation could expose you to significant financial and legal liability.",
  },
};

// ── Score ring ─────────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: score,
      duration: 1800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    anim.addListener(({ value }) => setDisplayed(Math.round(value)));
    return () => anim.removeAllListeners();
  }, []);

  const SIZE = 180;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const dash = anim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, CIRC],
  });

  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* SVG-like ring using borders */}
      <View
        style={[
          sr.ringOuter,
          {
            borderColor: "rgba(255,255,255,0.05)",
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
          },
        ]}
      />
      <View
        style={[
          sr.ringInner,
          {
            borderColor: color,
            width: SIZE - STROKE * 2,
            height: SIZE - STROKE * 2,
            borderRadius: (SIZE - STROKE * 2) / 2,
            opacity: 0.25,
          },
        ]}
      />

      {/* Score text */}
      <View style={sr.scoreCenter}>
        <Text style={[sr.scoreNumber, { color }]}>{displayed}</Text>
        <Text style={sr.scoreSlash}>/100</Text>
        <Text style={sr.scoreLabel}>RISK SCORE</Text>
      </View>

      {/* Animated arc overlay using rotation trick */}
      <Animated.View
        style={[
          sr.arcOverlay,
          {
            borderTopColor: color,
            borderRightColor: color,
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            transform: [
              {
                rotate: anim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["-90deg", "270deg"],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const sr = StyleSheet.create({
  ringOuter: { position: "absolute", borderWidth: 10 },
  ringInner: { position: "absolute", borderWidth: 2 },
  arcOverlay: {
    position: "absolute",
    borderWidth: 10,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  scoreCenter: { alignItems: "center" },
  scoreNumber: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 52,
    fontWeight: "700",
    lineHeight: 56,
  },
  scoreSlash: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 13,
    letterSpacing: 1,
  },
  scoreLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 9,
    letterSpacing: 3,
    marginTop: 4,
  },
});

// ── Main screen ────────────────────────────────────────────────────────────────
export default function Result() {
  const { score, verdict, reportId } = useLocalSearchParams<{
    score: string;
    verdict: string;
    reportId: string;
  }>();
  const insets = useSafeAreaInsets();

  const numScore = parseInt(score ?? "0", 10);
  const verdictKey: VerdictKey =
    verdict === "approved"
      ? "approved"
      : verdict === "caution"
        ? "caution"
        : "rejected";
  const config = VERDICT_CONFIG[verdictKey];

  // Entrance animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const ringFade = useRef(new Animated.Value(0)).current;
  const cardsFade = useRef(new Animated.Value(0)).current;
  const cardsSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(ringFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardsFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(cardsSlide, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Parse form data from params if available (or show generic factors)
  const formEntries = Object.entries(FACTOR_LABELS);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <View style={s.cornerTL} />
      <View style={s.cornerBR} />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Animated.View style={[s.topRow, { opacity: headerFade }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.topLabel}>ASSESSMENT RESULT</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Verdict badge */}
        <Animated.View
          style={[
            s.verdictBadge,
            {
              backgroundColor: config.bg,
              borderColor: config.color + "55",
              opacity: headerFade,
            },
          ]}
        >
          <Text style={[s.verdictIcon, { color: config.color }]}>
            {config.icon}
          </Text>
          <Text style={[s.verdictLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </Animated.View>

        {/* Score ring */}
        <Animated.View style={{ opacity: ringFade, marginVertical: 28 }}>
          <ScoreRing score={numScore} color={config.color} />
        </Animated.View>

        {/* Verdict card */}
        <Animated.View
          style={[
            s.verdictCard,
            {
              borderColor: config.color + "40",
              opacity: cardsFade,
              transform: [{ translateY: cardsSlide }],
            },
          ]}
        >
          <Text style={[s.verdictHeadline, { color: config.color }]}>
            {config.headline}
          </Text>
          <View
            style={[s.verdictDivider, { backgroundColor: config.color + "30" }]}
          />
          <Text style={s.verdictSummary}>{config.summary}</Text>
        </Animated.View>

        {/* Risk factors breakdown */}
        <Animated.View
          style={{
            opacity: cardsFade,
            transform: [{ translateY: cardsSlide }],
          }}
        >
          <Text style={s.sectionLabel}>ASSESSMENT BREAKDOWN</Text>
          <Text style={s.sectionSub}>
            Each factor evaluated and its impact on the final verdict.
          </Text>

          {formEntries.map(([key, meta], i) => {
            const isRisk =
              (key === "title_seen" && verdict !== "approved") ||
              (key === "encroachment" && verdict !== "approved") ||
              (key === "mortgage" && verdict !== "approved");
            const factorColor = isRisk ? "#F44336" : config.color;

            return (
              <View
                key={key}
                style={[
                  s.factorCard,
                  i === formEntries.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View style={s.factorHeader}>
                  <View
                    style={[
                      s.factorIconWrap,
                      { backgroundColor: factorColor + "18" },
                    ]}
                  >
                    <Text style={[s.factorIcon, { color: factorColor }]}>
                      {meta.icon}
                    </Text>
                  </View>
                  <View style={s.factorTitleWrap}>
                    <Text style={s.factorTitle}>{meta.label}</Text>
                    <View
                      style={[
                        s.factorPill,
                        {
                          backgroundColor: factorColor + "20",
                          borderColor: factorColor + "50",
                        },
                      ]}
                    >
                      <Text style={[s.factorPillText, { color: factorColor }]}>
                        {isRisk ? "⚠ FLAG" : "✓ CLEAR"}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={s.factorBody}>
                  {meta.explanation("—", verdictKey)}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        {/* What this means section */}
        <Animated.View style={[s.explainCard, { opacity: cardsFade }]}>
          <Text style={s.explainTitle}>What This Score Means</Text>
          <View style={s.explainDivider} />
          {[
            {
              range: "0 – 30",
              label: "High Risk",
              desc: "Critical legal or structural issues. Do not proceed without full legal investigation.",
              color: "#F44336",
            },
            {
              range: "31 – 60",
              label: "Moderate Risk",
              desc: "Significant concerns present. Expert due diligence required before acquisition.",
              color: "#FF9800",
            },
            {
              range: "61 – 100",
              label: "Low Risk",
              desc: "Property cleared most checkpoints. Suitable for safe investment with standard precautions.",
              color: "#4CAF50",
            },
          ].map(({ range, label, desc, color }) => (
            <View
              key={range}
              style={[s.explainRow, { borderLeftColor: color }]}
            >
              <Text style={[s.explainRange, { color }]}>{range}</Text>
              <View style={s.explainRight}>
                <Text style={s.explainLabel}>{label}</Text>
                <Text style={s.explainDesc}>{desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Disclaimer */}
        <Animated.View style={[s.disclaimer, { opacity: cardsFade }]}>
          <Text style={s.disclaimerText}>
            ◈ This assessment is based on the information you provided and is
            intended as a preliminary guide only. It does not constitute legal
            advice. TrusZed Properties recommends consulting a certified
            property lawyer before any acquisition.
          </Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={{ opacity: cardsFade }}>
          <TouchableOpacity
            style={s.unlockBtn}
            activeOpacity={0.85}
            onPress={() =>
              router.push({ pathname: "/unlock", params: { reportId } })
            }
          >
            <View style={s.unlockBtnInner}>
              <View>
                <Text style={s.unlockBtnTitle}>UNLOCK FULL REPORT</Text>
                <Text style={s.unlockBtnSub}>
                  Detailed analysis · Legal insights · PDF download
                </Text>
              </View>
              <Text style={s.unlockBtnArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.retakeBtn}
            onPress={() => router.replace("/survey")}
            activeOpacity={0.75}
          >
            <Text style={s.retakeBtnText}>RETAKE ASSESSMENT</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 22, paddingBottom: 52 },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 70,
    height: 70,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#9A7A2E",
    opacity: 0.35,
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
    opacity: 0.35,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  topLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "600",
  },

  verdictBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  verdictIcon: { fontSize: 14 },
  verdictLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 3 },

  verdictCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderRadius: 2,
    padding: 22,
    marginBottom: 24,
  },
  verdictHeadline: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  verdictDivider: { height: 1, marginBottom: 14 },
  verdictSummary: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    lineHeight: 22,
  },

  sectionLabel: {
    color: G,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSub: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    marginBottom: 16,
  },

  factorCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.15)",
    borderRadius: 2,
    padding: 18,
    marginBottom: 10,
  },
  factorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  factorIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  factorIcon: { fontSize: 16 },
  factorTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  factorTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    flex: 1,
  },
  factorPill: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  factorPillText: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5 },
  factorBody: { color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 19 },

  explainCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.15)",
    borderRadius: 2,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  explainTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
  },
  explainDivider: {
    height: 1,
    backgroundColor: "rgba(201,168,76,0.15)",
    marginBottom: 14,
  },
  explainRow: { borderLeftWidth: 2, paddingLeft: 14, marginBottom: 14 },
  explainRange: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 2,
  },
  explainRight: { flex: 1 },
  explainLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  explainDesc: { color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 18 },

  disclaimer: {
    backgroundColor: "rgba(201,168,76,0.06)",
    borderLeftWidth: 2,
    borderLeftColor: G,
    padding: 14,
    borderRadius: 2,
    marginBottom: 24,
  },
  disclaimerText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    lineHeight: 18,
    letterSpacing: 0.3,
  },

  unlockBtn: {
    backgroundColor: G,
    borderRadius: 2,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  unlockBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unlockBtnTitle: {
    color: "#0A0A0A",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 3,
  },
  unlockBtnSub: { color: "rgba(10,10,10,0.6)", fontSize: 11 },
  unlockBtnArrow: { color: "#0A0A0A", fontSize: 24, fontWeight: "700" },

  retakeBtn: {
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.3)",
    borderRadius: 2,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  retakeBtnText: {
    color: G,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
});
