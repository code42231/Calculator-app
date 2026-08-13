import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { UNIT_CATEGORIES, UnitCategory, convertUnit } from "../utilities/unit";

const CATEGORIES = Object.keys(UNIT_CATEGORIES) as UnitCategory[];

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("Length");
  const unitKeys = useMemo(() => Object.keys(UNIT_CATEGORIES[category]), [category]);

  const [fromUnit, setFromUnit] = useState(unitKeys[0]);
  const [toUnit, setToUnit] = useState(unitKeys[1] ?? unitKeys[0]);
  const [inputValue, setInputValue] = useState("1");
  const [pickerTarget, setPickerTarget] = useState<"from" | "to" | null>(null);

  const handleCategoryChange = (next: UnitCategory) => {
    setCategory(next);
    const keys = Object.keys(UNIT_CATEGORIES[next]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] ?? keys[0]);
  };

  const numericValue = parseFloat(inputValue);
  let output = "";
  if (!Number.isNaN(numericValue)) {
    try {
      const result = convertUnit(numericValue, category, fromUnit, toUnit);
      output = trimNumber(result);
    } catch {
      output = "Error";
    }
  }

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleCategoryChange(item)}
            style={[styles.categoryChip, category === item && styles.categoryChipActive]}
          >
            <Text style={[styles.categoryChipText, category === item && styles.categoryChipTextActive]}>
              {item}
            </Text>
          </Pressable>
        )}
      />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>From</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="0"
            placeholderTextColor="#6B6B75"
          />
          <Pressable style={styles.unitButton} onPress={() => setPickerTarget("from")}>
            <Text style={styles.unitButtonText}>
              {UNIT_CATEGORIES[category][fromUnit]?.label ?? fromUnit}
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.swapButton} onPress={swap}>
        <Text style={styles.swapButtonText}>⇅ Swap</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>To</Text>
        <View style={styles.row}>
          <Text style={styles.outputText} numberOfLines={1} adjustsFontSizeToFit>
            {output || "0"}
          </Text>
          <Pressable style={styles.unitButton} onPress={() => setPickerTarget("to")}>
            <Text style={styles.unitButtonText}>
              {UNIT_CATEGORIES[category][toUnit]?.label ?? toUnit}
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal visible={pickerTarget !== null} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerTarget(null)}>
          <View style={styles.modalCard}>
            <FlatList
              data={unitKeys}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    if (pickerTarget === "from") setFromUnit(item);
                    if (pickerTarget === "to") setToUnit(item);
                    setPickerTarget(null);
                  }}
                >
                  <Text style={styles.modalItemText}>{UNIT_CATEGORIES[category][item].label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function trimNumber(value: number): string {
  const rounded = Math.round(value * 1e6) / 1e6;
  return rounded.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
    padding: 16,
    paddingTop: 24,
    gap: 16,
  },
  categoryList: {
    gap: 8,
    paddingBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#2A2A32",
  },
  categoryChipActive: {
    backgroundColor: "#208AEF",
  },
  categoryChipText: {
    color: "#9A9AA5",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#17171D",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardLabel: {
    color: "#6B6B75",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
  },
  outputText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
  },
  unitButton: {
    backgroundColor: "#2A2A32",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  unitButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "#208AEF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  swapButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 32,
  },
  modalCard: {
    backgroundColor: "#17171D",
    borderRadius: 16,
    maxHeight: "70%",
    paddingVertical: 8,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalItemText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});