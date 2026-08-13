import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#208AEF",
        tabBarInactiveTintColor: "#6B6B75",
        tabBarStyle: {
          backgroundColor: "#0B0B0F",
          borderTopColor: "#26262E",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color }) => <TabIcon symbol="=" color={color} />,
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          title: "Converter",
          tabBarIcon: ({ color }) => <TabIcon symbol="⇄" color={color} />,
        }}
      />
      <Tabs.Screen
        name="graph"
        options={{
          title: "Graph",
          tabBarIcon: ({ color }) => <TabIcon symbol="∿" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ symbol, color }: { symbol: string; color: ColorValue }) {
  return <Text style={{ fontSize: 20, color }}>{symbol}</Text>;
}