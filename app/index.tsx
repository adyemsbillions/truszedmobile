import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsLoggedIn(!!token);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        padding: 25,
        justifyContent: "space-between",
      }}
    >
      <StatusBar barStyle="light-content" />

      {/* TOP SECTION */}
      <View>
        <Text
          style={{
            color: "#D4AF37",
            fontSize: 18,
            marginTop: 40,
          }}
        >
          Truszed Properties
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 32,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Smart Property Risk Assessment
        </Text>

        <Text
          style={{
            color: "#aaa",
            marginTop: 15,
            lineHeight: 22,
          }}
        >
          Analyze any property before you buy. Get instant risk scores, legal
          insights, and detailed reports — all in one place.
        </Text>
      </View>

      {/* MIDDLE FEATURE CARDS */}
      <View>
        {[
          "✔ Instant Risk Score",
          "✔ Legal & Ownership Checks",
          "✔ Detailed Paid Reports",
        ].map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#111",
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff" }}>{item}</Text>
          </View>
        ))}
      </View>

      {/* BOTTOM BUTTON */}
      <View>
        {loading ? (
          <ActivityIndicator color="#D4AF37" />
        ) : (
          <TouchableOpacity
            onPress={() =>
              isLoggedIn ? router.replace("/home") : router.push("/login")
            }
            style={{
              backgroundColor: "#D4AF37",
              padding: 18,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {isLoggedIn ? "Continue" : "Get Started"}
            </Text>
          </TouchableOpacity>
        )}

        {!isLoggedIn && (
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ color: "#aaa", textAlign: "center" }}>
              Create an account
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
