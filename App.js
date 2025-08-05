// App.js
import { ExpoRoot } from "expo-router";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function App() {
  const ctx = require.context("./app");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExpoRoot context={ctx} />
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
