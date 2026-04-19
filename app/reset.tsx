import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const API = "https://truszedproperties.com/api";

export default function Reset() {
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState("");

  const reset = async () => {
    const res = await fetch(`${API}/reset_password.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Password updated");
      router.replace("/login");
    } else {
      alert("Error resetting password");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>New Password</Text>

      <TextInput
        secureTextEntry
        placeholder="New Password"
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={reset}>
        <Text>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}
