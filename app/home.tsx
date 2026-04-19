import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API = "https://truszedproperties.com/api";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      }

      // optional: fetch fresh data from backend
      const res = await fetch(`${API}/get_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "#000" }}
      >
        <ActivityIndicator color="#D4AF37" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      {/* HEADER */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ color: "#D4AF37", fontSize: 18 }}>Welcome</Text>
        <Text style={{ color: "#fff", fontSize: 26, fontWeight: "bold" }}>
          {user?.full_name || "User"}
        </Text>
      </View>

      {/* MAIN CARD */}
      <View
        style={{
          backgroundColor: "#111",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#D4AF37", fontSize: 16 }}>
          Property Risk Analysis
        </Text>

        <Text style={{ color: "#fff", marginTop: 10 }}>
          Run a full survey and get insights about any property.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/survey")}
          style={{
            backgroundColor: "#D4AF37",
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Start Survey
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECOND CARD */}
      <View
        style={{
          backgroundColor: "#111",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#D4AF37", fontSize: 16 }}>Your Reports</Text>

        <TouchableOpacity
          onPress={() => router.push("/reports")}
          style={{
            backgroundColor: "#222",
            padding: 15,
            borderRadius: 10,
            marginTop: 15,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            View Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE CARD */}
      <View
        style={{
          backgroundColor: "#111",
          padding: 20,
          borderRadius: 15,
        }}
      >
        <Text style={{ color: "#D4AF37", fontSize: 16 }}>Account</Text>

        <Text style={{ color: "#fff", marginTop: 10 }}>
          Email: {user?.email}
        </Text>

        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: "#D4AF37",
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
