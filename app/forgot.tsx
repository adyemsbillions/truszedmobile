import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSendCode = async () => {
    const res = await fetch("YOUR_API/forgot_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      router.push({
        pathname: "/auth/verify",
        params: { email },
      });
    } else {
      alert(data.message || "Error");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Forgot Password</Text>

      <TextInput placeholder="Enter your email" onChangeText={setEmail} />

      <TouchableOpacity onPress={handleSendCode}>
        <Text>Send Reset Code</Text>
      </TouchableOpacity>
    </View>
  );
}
