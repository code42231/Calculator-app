import { SafeAreaView } from "react-native-safe-area-context";
import UnitConverter from "@/components/UnitConverter";


export default function ConverterScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0B0F" }} edges={["top", "bottom"]}>
      <UnitConverter />
    </SafeAreaView>
  );
}