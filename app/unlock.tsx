import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Unlock() {
  const { reportId } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>Unlock Full Report</Text>

      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/payment", params: { reportId } })
        }
      >
        <Text>Pay for Report</Text>
      </TouchableOpacity>
    </View>
  );
}
