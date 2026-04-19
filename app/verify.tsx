import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const API = "https://truszedproperties.com/api";

export default function Verify() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");

  const verify = async () => {
    const res = await fetch(`${API}/verify_code.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (data.success) {
      router.push({ pathname: "/reset", params: { email } });
    } else {
      alert("Invalid or expired code");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter Code</Text>

      <TextInput
        placeholder="Code"
        keyboardType="numeric"
        onChangeText={setCode}
      />

      <TouchableOpacity onPress={verify}>
        <Text>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}
