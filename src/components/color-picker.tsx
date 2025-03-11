"use client";

import { useState, useEffect, useRef } from "react";

type ColorPickerProps = {
  defaultColor?: string;
  onChange: (color: string) => void;
};

const presetColors = [
  // Reds & Pinks
  "#F44336", // Bright Red
  "#FF5252", // Red
  "#E91E63", // Hot Pink
  "#EC407A", // Pink

  // Oranges & Ambers
  "#FF9800", // Orange
  "#FF7043", // Deep Orange
  "#FFCA28", // Amber
  "#FFC107", // Yellow

  // Yellows & Limes
  "#CDDC39", // Yellow Green
  "#8BC34A", // Lime

  // Greens
  "#4CAF50", // Light Green
  "#66BB6A", // Green
  "#009688", // Green Teal

  // Teals & Cyans
  "#00BCD4", // Teal
  "#26C6DA", // Cyan

  // Blues
  "#2196F3", // Light Blue
  "#42A5F5", // Blue
  "#3F51B5", // Royal Blue

  // Indigos & Purples
  "#5C6BC0", // Indigo
  "#673AB7", // Deep Purple
  "#9C27B0", // Purple

  // Neutrals
  "#795548", // Brown
  "#78909C", // Blue Grey
  "#9E9E9E", // Grey
  "#EEEEEE", // White
];

export default function ColorPicker({
  defaultColor = "#F44336",
  onChange,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChange(color);
    setShowPicker(false);
  };

  return (
    <div
      className="color-picker-container"
      ref={pickerRef}
      style={{ position: "relative" }}
    >
      <div className="is-flex is-align-items-center">
        <div
          className="color-display"
          onClick={() => setShowPicker(!showPicker)}
          style={{
            backgroundColor: selectedColor,
            width: "36px",
            height: "36px",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            border: "2px solid white",
            transition: "transform 0.2s ease",
          }}
        />
        <div className="selected-color-hex">{selectedColor}</div>
      </div>

      {showPicker && (
        <div
          className="color-picker-dropdown box"
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            left: 0,
            width: "230px",
            borderRadius: "8px",
            boxShadow: "0 3px 15px rgba(0,0,0,0.2)",
            padding: "12px",
            zIndex: 10,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            className="preset-colors"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            {presetColors.map((color) => (
              <div
                key={color}
                className="color-option"
                onClick={() => handleColorChange(color)}
                style={{
                  backgroundColor: color,
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  border:
                    color === selectedColor
                      ? "2px solid #000"
                      : "2px solid transparent",
                  transition: "transform 0.2s ease, border 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .color-option:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
