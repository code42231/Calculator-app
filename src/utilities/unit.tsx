export type UnitCategory = "Length" | "Weight" | "Temperature" | "Volume" | "Area" | "Speed";

interface UnitDef {
  label: string;
  toBase: number;
}

export const UNIT_CATEGORIES: Record<UnitCategory, Record<string, UnitDef>> = {
  Length: {
    mm: { label: "Millimeters", toBase: 0.001 },
    cm: { label: "Centimeters", toBase: 0.01 },
    m: { label: "Meters", toBase: 1 },
    km: { label: "Kilometers", toBase: 1000 },
    in: { label: "Inches", toBase: 0.0254 },
  },
  Weight: {
    mg: { label: "Milligrams", toBase: 0.000001 },
    g: { label: "Grams", toBase: 0.001 },
    kg: { label: "Kilograms", toBase: 1 },
    lb: { label: "Pounds", toBase: 0.453592 },
  },
  Temperature: {
    c: { label: "Celsius", toBase: 1 },
    f: { label: "Fahrenheit", toBase: 1 },
  },
  Volume: {
    ml: { label: "Milliliters", toBase: 0.001 },
    l: { label: "Liters", toBase: 1 },
    galUS: { label: "Gallons", toBase: 3.78541 },
  },
  Area: {
    m2: { label: "Square Meters", toBase: 1 },
    km2: { label: "Square Kilometers", toBase: 1000000 },
    ft2: { label: "Square Feet", toBase: 0.092903 },
  },
  Speed: {
    mps: { label: "Meters/sec", toBase: 1 },
    kph: { label: "Km/hour", toBase: 0.277778 },
    mph: { label: "Miles/hour", toBase: 0.44704 },  },
};

function celsiusToUnit(c: number, unit: string): number {
  if (unit === "c") return c;
  if (unit === "f") return (c * 9) / 5 + 32;
  throw new Error(`Unknown temperature unit: ${unit}`);
}

function unitToCelsius(value: number, unit: string): number {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  throw new Error(`Unknown temperature unit: ${unit}`);
}

export function convertUnit(
  value: number,
  category: UnitCategory,
  fromUnit: string,
  toUnit: string
): number {
  if (Number.isNaN(value)) return NaN;

  if (category === "Temperature") {
    const celsius = unitToCelsius(value, fromUnit);
    return celsiusToUnit(celsius, toUnit);
  }

  const def = UNIT_CATEGORIES[category];
  const fromDef = def[fromUnit];
  const toDef = def[toUnit];
  if (!fromDef || !toDef) throw new Error("Unknown unit");

  const base = value * fromDef.toBase;
  return base / toDef.toBase;
}