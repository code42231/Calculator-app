import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { evaluateExpression } from "../utilities/expression";

const DEFAULT_RANGE = 10;
const SAMPLES = 80;

interface Segment {
  left: number;
  top: number;
  width: number;
  angle: number;
}

export default function Graph() {
  const [formula, setFormula] = useState("sin(x)");
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const segments = useMemo<Segment[]>(() => {
    if (size.width === 0 || size.height === 0) return [];

    const xMin = -range;
    const xMax = range;
    const scale = size.width / (xMax - xMin);

    const toScreenX = (x: number) => (x - xMin) * scale;
    const toScreenY = (y: number) => size.height / 2 - y * scale;

    const points: { x: number; y: number; valid: boolean }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const xMath = xMin + ((xMax - xMin) * i) / SAMPLES;
      let yMath: number;
      try {
        yMath = evaluateExpression(formula, { x: xMath });
      } catch {
        yMath = NaN;
      }
      const sy = toScreenY(yMath);
      const valid = Number.isFinite(sy) && Math.abs(sy - size.height / 2) < size.height * 4;
      points.push({ x: toScreenX(xMath), y: sy, valid });
    }

    const result: Segment[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (!a.valid || !b.valid) continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const width = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      result.push({
        left: (a.x + b.x) / 2 - width / 2,
        top: (a.y + b.y) / 2 - 1,
        width,
        angle,
      });
    }
    return result;
  }, [formula, range, size]);

  const handleFormulaChange = (text: string) => {
    setFormula(text);
    try {
      evaluateExpression(text, { x: 1 });
      setError(null);
    } catch {
      setError("Can't parse formula");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Text style={styles.yEquals}>y =</Text>
        <TextInput
          style={styles.input}
          value={formula}
          onChangeText={handleFormulaChange}
          placeholder="e.g. x^2 - 3, sin(x), sqrt(x)"
          placeholderTextColor="#6B6B75"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.plotArea} onLayout={onLayout}>
        {size.width > 0 && size.height > 0 && (
          <>
            <View style={[styles.axisLine, { left: 0, top: size.height / 2, width: size.width, height: 1 }]} />
            <View style={[styles.axisLine, { left: size.width / 2, top: 0, width: 1, height: size.height }]} />
            {segments.map((seg, i) => (
              <View
                key={i}
                style={[
                  styles.segment,
                  {
                    left: seg.left,
                    top: seg.top,
                    width: seg.width,
                    transform: [{ rotate: `${seg.angle}deg` }],
                  },
                ]}
              />
            ))}
          </>
        )}
      </View>

      <View style={styles.zoomRow}>
        <Text style={styles.zoomLabel}>Zoom</Text>
        <Pressable style={styles.zoomButton} onPress={() => setRange((r) => Math.max(1, r / 1.5))}>
          <Text style={styles.zoomButtonText}>＋</Text>
        </Pressable>
        <Pressable style={styles.zoomButton} onPress={() => setRange((r) => Math.min(1000, r * 1.5))}>
          <Text style={styles.zoomButtonText}>－</Text>
        </Pressable>
        <Pressable style={styles.zoomButton} onPress={() => setRange(DEFAULT_RANGE)}>
          <Text style={styles.zoomButtonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0F", padding: 16, paddingTop: 24, gap: 12 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#17171D", borderRadius: 14, paddingHorizontal: 14, gap: 8 },
  yEquals: { color: "#9A9AA5", fontSize: 18, fontWeight: "600" },
  input: { flex: 1, color: "#FFFFFF", fontSize: 18, paddingVertical: 14 },
  errorText: { color: "#FF6B6B", fontSize: 13 },
  plotArea: { flex: 1, minHeight: 240, backgroundColor: "#0F0F14", borderRadius: 16, overflow: "hidden", position: "relative" },
  axisLine: { position: "absolute", backgroundColor: "#4A4A54" },
  segment: { position: "absolute", height: 2, backgroundColor: "#208AEF" },
  zoomRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  zoomLabel: { color: "#6B6B75", marginRight: 4 },
  zoomButton: { backgroundColor: "#2A2A32", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  zoomButtonText: { color: "#FFFFFF", fontWeight: "600" },
});