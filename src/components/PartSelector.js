// components/PartSelector.js
export default function PartSelector({
  title,
  options,
  currentValue,
  onChange,
}) {
  return (
    <div className="part-selector">
      <h3>{title}</h3>
      <div className="options-grid">
        {options.map((option) => (
          <div
            key={option.value}
            className={`option ${
              currentValue === option.value ? "active" : ""
            }`}
            onClick={() => onChange(option.value)}
          >
            <img src={option.preview} alt={option.label} />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
