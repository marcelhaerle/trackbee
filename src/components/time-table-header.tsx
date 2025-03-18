import { useState } from "react";
import { FaCalendarAlt, FaClock, FaProjectDiagram } from "react-icons/fa";

export default function TimeTableHeader({ onGroupByChange, onSortByChange }) {
  const [groupBy, setGroupBy] = useState<string>("date");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const handleGroupByChange = (value: string) => {
    setGroupBy(value);
    onGroupByChange(value);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    onSortByChange(value);
  };

  return (
    <>
      <div className="time-table-header">
        <h1 className="title is-2">Time Entries</h1>

        <div className="time-table-header-controls">
          <div className="field has-addons mr-3">
            <div className="control">
              <button
                className={`button ${
                  groupBy === "date" ? "is-info" : "is-light"
                }`}
                onClick={() => handleGroupByChange("date")}
                title="Group by date"
              >
                <span className="icon">
                  <FaCalendarAlt />
                </span>
              </button>
            </div>
            <div className="control">
              <button
                className={`button ${
                  groupBy === "project" ? "is-info" : "is-light"
                }`}
                onClick={() => handleGroupByChange("project")}
                title="Group by project"
              >
                <span className="icon">
                  <FaProjectDiagram />
                </span>
              </button>
            </div>
            <div className="control">
              <button
                className={`button ${
                  groupBy === "none" ? "is-info" : "is-light"
                }`}
                onClick={() => handleGroupByChange("none")}
                title="No grouping"
              >
                <span className="icon">
                  <FaClock />
                </span>
              </button>
            </div>
          </div>

          <div className="select is-small">
            <select
              value={sortBy}
              onChange={(e) => handleSortByChange(e.target.value)}
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="duration">Longest duration</option>
            </select>
          </div>
        </div>
      </div>
      <style jsx>{`
        .time-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .time-table-header-controls {
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  );
}
