import { SafeAreaView } from "react-native-safe-area-context";
import Calculator from "../calculator";

export default function CalculatorScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0B0F" }} edges={["top", "bottom"]}>
      <Calculator />
    </SafeAreaView>
  );
}