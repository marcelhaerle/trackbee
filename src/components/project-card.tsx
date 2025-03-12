"use client";

import { Project } from "@prisma/client";
import { FaPlay } from "react-icons/fa";

// Function to determine if text should be black or white based on background color
function getContrastColor(hexColor: string | null): string {
  // Default to black if no color is provided
  if (!hexColor) return "#000000";

  // Remove the hash if it exists
  const hex = hexColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance - using the formula for relative luminance in the sRGB color space
  // See: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

interface ProjectCardProps {
  project: Project;
  onStartTracking: (projectId: string) => void;
}

export default function ProjectCard({
  project,
  onStartTracking,
}: ProjectCardProps) {
  const textColor = getContrastColor(project.color);

  return (
    <>
      <div className="card">
        <div className="card-content">
          <h2 className="title is-5 mb-2" style={{ color: textColor }}>
            {project.name}
          </h2>

          <button
            className="play-button"
            onClick={() => onStartTracking(project.id)}
            aria-label="Start timer"
          >
            <FaPlay size={24} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .card-content {
          background-color: ${project.color || "#4A6FFF"};
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-height: 100px;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
}
