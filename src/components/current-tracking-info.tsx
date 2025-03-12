"use client";

import { useState, useEffect, useCallback } from "react";
import { FaClock, FaProjectDiagram, FaStop } from "react-icons/fa";
import { CurrentTracking } from "./dashboard";

// Custom time formatting function
function formatTimeElapsed(startTime: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();

  // Calculate hours, minutes, and seconds
  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  // Format parts
  let result = "";

  if (hours > 0) {
    result += `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  if (minutes > 0 || hours > 0) {
    if (result.length > 0) result += " ";
    result += `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  if (result.length > 0) result += " ";
  result += `${seconds} ${seconds === 1 ? "second" : "seconds"}`;

  return result;
}

interface CurrentTrackingInfoProps {
  currentTracking: CurrentTracking | null;
  onStopTracking: () => void;
}

export function CurrentTrackingInfo({
  currentTracking,
  onStopTracking,
}: CurrentTrackingInfoProps) {
  const [elapsedTime, setElapsedTime] = useState<string>("");

  // Update the elapsed time display using our custom formatter
  const updateElapsedTime = useCallback(() => {
    if (!currentTracking) return;

    const startTime = new Date(currentTracking.startTime);
    const formattedTime = formatTimeElapsed(startTime);
    setElapsedTime(formattedTime);
  }, [currentTracking]);

  // Setup interval for updating elapsed time
  useEffect(() => {
    if (currentTracking) {
      updateElapsedTime();
      const timerId = setInterval(updateElapsedTime, 1000);
      return () => clearInterval(timerId);
    }
  }, [currentTracking, updateElapsedTime]);

  if (!currentTracking) {
    return null; // Don't render anything if no active timer
  }

  const projectColor = currentTracking?.project.color;

  return (
    <div className="current-tracking-info mb-5">
      <div className="box" style={{ borderLeft: `5px solid ${projectColor}` }}>
        <div className="columns is-mobile">
          <div className="column">
            <div className="tracking-header">
              <h2 className="title is-5 mb-3">Currently Tracking</h2>
            </div>

            <div className="tracking-project mb-2">
              <span className="icon mr-2 has-text-grey">
                <FaProjectDiagram />
              </span>
              <span className="is-size-5">
                {currentTracking.project.name || "No Project"}
              </span>
            </div>

            <div className="tracking-time mt-3 is-flex is-align-items-center">
              <span className="icon mr-2 has-text-primary">
                <FaClock />
              </span>
              <span className="timer is-size-4 has-text-weight-bold">
                {elapsedTime}
              </span>
              <span className="has-text-grey ml-2 is-size-7">
                since {new Date(currentTracking.startTime).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="column is-narrow is-flex is-align-items-center">
            <button
              className={`stop-button`}
              onClick={onStopTracking}
              aria-label="Stop timer"
              title="Stop timer"
            >
              <FaStop size={22} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .current-tracking-info {
          position: relative;
          width: 100%;
          max-width: 600px;
        }

        .tracking-time .timer {
          font-family: monospace;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .timer {
            font-size: 1.25rem !important;
          }
        }
        .stop-button {
          background-color: #ff3860;
          color: white;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(255, 56, 96, 0.3);
          position: relative;
        }

        .stop-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(255, 56, 96, 0.4);
        }

        .stop-button:active {
          transform: scale(0.95);
        }

        .stop-button.is-loading {
          color: transparent;
        }

        .stop-button.is-loading::after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
