// App.js
import { ExpoRoot } from "expo-router";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./app/context/ThemeContext";

export function App() {
  const ctx = require.context("./app");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ExpoRoot context={ctx} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
