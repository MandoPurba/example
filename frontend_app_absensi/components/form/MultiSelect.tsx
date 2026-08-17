import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];

  value?: string[];              // 🔥 controlled
  onChange?: (selected: string[]) => void;

  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value = [],
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value);

  // 🔥 sync external value (react-hook-form / reset)
  useEffect(() => {
    setSelectedOptions(value || []);
  }, [value]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelected);
    onChange?.(newSelected);
  };

  const removeOption = (value: string) => {
    const newSelected = selectedOptions.filter((v) => v !== value);
    setSelectedOptions(newSelected);
    onChange?.(newSelected);
  };

  const selectedLabels = selectedOptions.map(
    (val) => options.find((o) => o.value === val)?.text || ""
  );

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">

        {/* SELECT BOX */}
        <div
          onClick={toggleDropdown}
          className={`flex flex-wrap items-center min-h-11 max-h-36 border rounded-lg px-3 py-1 cursor-pointer bg-white overflow-auto`}
        >
          {selectedLabels.length > 0 ? (
            selectedLabels.map((text, i) => (
              <span
                key={i}
                className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1 m-0.5"
              >
                {text}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(selectedOptions[i]);
                  }}
                  className="text-xs text-error-500 ml-1 focus:outline-none"
                >
                  ✕
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select options</span>
          )}

          <span className={`ml-auto transition ${isOpen ? "rotate-180" : ""}`}>
            <ChevronDown />
          </span>
        </div>

        {/* DROPDOWN */}
        {isOpen && (
          <div className="absolute z-50 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-auto">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedOptions.includes(opt.value)
                    ? "bg-gray-100"
                    : ""
                  }`}
              >
                {opt.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;