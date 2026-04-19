import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Result() {
  const { score, verdict, reportId } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>Score: {score}</Text>
      <Text>Verdict: {verdict}</Text>

      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/unlock", params: { reportId } })
        }
      >
        <Text>Unlock Full Report</Text>
      </TouchableOpacity>
    </View>
  );
}
