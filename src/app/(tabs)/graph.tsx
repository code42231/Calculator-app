import { SafeAreaView } from "react-native-safe-area-context";
import Graph from "@/components/Graph";

export default function GraphScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0B0F" }} edges={["top", "bottom"]}>
      <Graph />
    </SafeAreaView>
  );
}