// components/CustomizationPanel.js
import PartSelector from "./PartSelector";

const partOptions = {
  sleeves: [
    {
      value: "default",
      label: "Default Sleeves",
      preview: "/sleeve-default.jpg",
    },
    { value: "short", label: "Short Sleeves", preview: "/sleeve-short.jpg" },
    { value: "puffed", label: "Puffed Sleeves", preview: "/sleeve-puffed.jpg" },
    { value: "long", label: "Long Sleeves", preview: "/sleeve-long.jpg" },
  ],
  collar: [
    {
      value: "default",
      label: "Standard Collar",
      preview: "/collar-default.jpg",
    },
    { value: "vneck", label: "V-Neck", preview: "/collar-vneck.jpg" },
    { value: "round", label: "Round Collar", preview: "/collar-round.jpg" },
  ],
};

export default function CustomizationPanel({ customizations, onChange }) {
  return (
    <div className="customization-panel">
      <h2>Customize Your Design</h2>

      <PartSelector
        title="Sleeves"
        options={partOptions.sleeves}
        currentValue={customizations.sleeves}
        onChange={(value) => onChange("sleeves", value)}
      />

      <PartSelector
        title="Collar"
        options={partOptions.collar}
        currentValue={customizations.collar}
        onChange={(value) => onChange("collar", value)}
      />
    </div>
  );
}
