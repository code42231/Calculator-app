import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { evaluateExpression } from "../utilities/expression";

const BUTTON_ROWS: string[][] = [
  ["AC", "( )", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

function toParsable(expr: string): string {
  return expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [openParens, setOpenParens] = useState(0);

  const handlePress = (key: string) => {
    if (key === "AC") {
      setExpression("");
      setResult("");
      setOpenParens(0);
      return;
    }

    if (key === "⌫") {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "=") {
      try {
        const value = evaluateExpression(toParsable(expression));
        if (Number.isNaN(value) || !Number.isFinite(value)) {
          setResult("Error");
        } else {
          setResult(trimNumber(value));
        }
      } catch {
        setResult("Error");
      }
      return;
    }

    if (key === "( )") {
      const lastChar = expression[expression.length - 1];
      const needsOpen =
        expression.length === 0 ||
        "+−×÷%(".includes(lastChar) ||
        openParens === 0;

      if (needsOpen) {
        setExpression((prev) => prev + "(");
        setOpenParens((prev) => prev + 1);
      } else {
        setExpression((prev) => prev + ")");
        setOpenParens((prev) => prev - 1);
      }
      return;
    }

    setExpression((prev) => prev + key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text
          style={styles.expressionText}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {expression || "0"}
        </Text>
        <Text style={styles.resultText} numberOfLines={1} adjustsFontSizeToFit>
          {result}
        </Text>
      </View>

      <View style={styles.pad}>
        {BUTTON_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key) => (
              <Pressable
                key={key}
                onPress={() => handlePress(key)}
                style={({ pressed }) => [
                  styles.button,
                  isOperator(key) && styles.operatorButton,
                  key === "AC" && styles.clearButton,
                  key === "=" && styles.equalsButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    isOperator(key) && styles.operatorButtonText,
                    key === "AC" && styles.clearButtonText,
                    key === "=" && styles.equalsButtonText,
                  ]}
                >
                  {key}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function isOperator(key: string): boolean {
  return ["÷", "×", "−", "+", "%", "( )"].includes(key);
}

function trimNumber(value: number): string {
  const rounded = Math.round(value * 1e10) / 1e10;
  return rounded.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#0B0B0F",
    padding: 16,
  },
  display: {
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 24,
    minHeight: 140,
  },
  expressionText: {
    color: "#9A9AA5",
    fontSize: 32,
    textAlign: "right",
  },
  resultText: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 8,
  },
  pad: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "#2A2A32",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  operatorButton: {
    backgroundColor: "#208AEF",
  },
  clearButton: {
    backgroundColor: "#5F5F68",
  },
  equalsButton: {
    backgroundColor: "#208AEF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "500",
  },
  operatorButtonText: {
    color: "#FFFFFF",
  },
  clearButtonText: {
    color: "#FFFFFF",
  },
  equalsButtonText: {
    color: "#FFFFFF",
  },
});
