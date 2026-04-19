import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function FullReport() {
  const { reportId } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>Full Report #{reportId}</Text>
    </View>
  );
}
