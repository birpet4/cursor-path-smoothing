import { useMemo } from "react";
import CursorPathAnimation from "./components/MousePathAnimation";
import * as PIXI from "pixi.js";
import { AppProvider } from "@pixi/react";

const App = () => {
  const app = useMemo(() => new PIXI.Application(), []);

  return (
    <AppProvider value={app}>
      <CursorPathAnimation />
    </AppProvider>
  );
};

export default App;
