// App.js
import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import CustomizationPanel from "./components/CustomizationPanel";
import "./styles.css";

export default function App() {
  const [customizations, setCustomizations] = useState({
    sleeves: "default",
    collar: "default",
  });

  return (
    <div className="app-container">
      <div className="model-viewer-container">
        <ModelViewer customizations={customizations} />
      </div>
      <CustomizationPanel
        customizations={customizations}
        onChange={(part, value) =>
          setCustomizations({ ...customizations, [part]: value })
        }
      />
    </div>
  );
}
