import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Payment() {
  const { reportId } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>Processing Payment...</Text>

      <TouchableOpacity
        onPress={() =>
          router.replace({ pathname: "/success", params: { reportId } })
        }
      >
        <Text>Complete Payment</Text>
      </TouchableOpacity>
    </View>
  );
}
