"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPen, FaTrash } from "react-icons/fa";
import { format, parseISO, differenceInSeconds } from "date-fns";

import TimeTableLoading from "./time-table-loading";
import TimeTableHeader from "./time-table-header";
import { getContrastColor } from "@/lib/utils";
import TimeTableGroupHeader from "./time-table-group-header";

interface Project {
  id: string;
  name: string;
  color: string | null;
}

interface TimeEntry {
  id: string;
  description: string | null;
  startTime: string;
  endTime: string | null;
  project: Project;
}

// Grouping options type
type GroupingOption = "date" | "project" | "none";

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }

  return parts.join(" ");
}

export default function TimeTable() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Changed groupByDate to more general groupBy option
  const [groupBy, setGroupBy] = useState<GroupingOption>("date");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "duration">(
    "date-desc"
  );

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/time");
      if (!response.ok) {
        throw new Error("Failed to fetch time entries");
      }
      const data = await response.json();
      setTimeEntries(data);
    } catch (error) {
      console.error("Error fetching time entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time entry?")) return;

    try {
      const response = await fetch(`/api/time/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete time entry");
      }

      // Remove the deleted entry from the state
      setTimeEntries(timeEntries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting time entry:", error);
    }
  };

  const getSortedAndGroupedEntries = () => {
    // Sort the entries based on selected sort method
    const sortedEntries = [...timeEntries].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return (
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        case "date-desc":
          return (
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          );
        case "duration": {
          const durationA = a.endTime
            ? differenceInSeconds(new Date(a.endTime), new Date(a.startTime))
            : 0;
          const durationB = b.endTime
            ? differenceInSeconds(new Date(b.endTime), new Date(b.startTime))
            : 0;
          return durationB - durationA;
        }
      }
    });

    // No grouping
    if (groupBy === "none") {
      return { ungrouped: sortedEntries };
    }

    // Group by date
    if (groupBy === "date") {
      return sortedEntries.reduce(
        (groups: { [key: string]: TimeEntry[] }, entry) => {
          const date = format(parseISO(entry.startTime), "yyyy-MM-dd");
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(entry);
          return groups;
        },
        {}
      );
    }

    // Group by project
    return sortedEntries.reduce(
      (groups: { [key: string]: TimeEntry[] }, entry) => {
        const projectId = entry.project?.id || "no-project";
        const projectKey = `${projectId}-${
          entry.project?.name || "No Project"
        }`;
        if (!groups[projectKey]) {
          groups[projectKey] = [];
        }
        groups[projectKey].push(entry);
        return groups;
      },
      {}
    );
  };

  const groupedEntries = getSortedAndGroupedEntries();

  const renderEntryRow = (entry: TimeEntry) => {
    const startTime = parseISO(entry.startTime);
    const endTime = entry.endTime ? parseISO(entry.endTime) : null;

    const duration = endTime ? differenceInSeconds(endTime, startTime) : 0;

    const backgroundColor = entry.project?.color || "transparent";
    const textColor = getContrastColor(entry.project?.color);

    return (
      <tr
        key={entry.id}
        style={{ backgroundColor: backgroundColor, color: textColor }}
      >
        {/* Only show project column when not grouped by project */}
        {groupBy !== "project" && (
          <td style={{ color: textColor }}>
            <span>{entry.project?.name || "No Project"}</span>
          </td>
        )}
        <td style={{ color: textColor }}>
          {entry.description || (
            <span className="no-description">No description</span>
          )}
        </td>
        <td style={{ color: textColor }}>
          {/* Show date when not grouped by date */}
          {groupBy !== "date" && (
            <div className="entry-date">{format(startTime, "MMM d")}</div>
          )}
          <div>
            {format(startTime, "h:mm a")}
            {endTime && ` - ${format(endTime, "h:mm a")}`}
          </div>
        </td>
        <td style={{ color: textColor }}>
          {endTime ? formatDuration(duration) : "Running"}
        </td>
        <td className="actions-cell">
          <div className="buttons are-small">
            <Link
              href={`/time/${entry.id}/edit`}
              className="button is-small"
              title="Edit"
            >
              <FaPen />
            </Link>
            <button
              className="button is-small"
              onClick={() => handleDelete(entry.id)}
              title="Delete"
            >
              <FaTrash color="#FF6685" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Calculate total duration for each group
  const getGroupDuration = (entries: TimeEntry[]): string => {
    const totalSeconds = entries.reduce((total, entry) => {
      if (!entry.endTime) return total; // Skip running entries
      const duration = differenceInSeconds(
        new Date(entry.endTime),
        new Date(entry.startTime)
      );
      return total + duration;
    }, 0);

    return formatDuration(totalSeconds);
  };

  if (isLoading) {
    return <TimeTableLoading />;
  }

  return (
    <div>
      <TimeTableHeader
        onGroupByChange={setGroupBy}
        onSortByChange={setSortBy}
      />
      {/* If no time entries display a message */}
      {timeEntries.length === 0 && (
        <div className="notification is-light mt-4">
          <p className="has-text-centered">
            No time entries found. Start tracking your time!
          </p>
        </div>
      )}

      {Object.entries(groupedEntries).map(([groupKey, entries]) => (
        <div key={groupKey} className="time-entries-section">
          {/* Group header based on grouping type */}
          {groupBy !== "none" && (
            <div className="group-header">
              {groupBy === "date" && groupKey !== "ungrouped" && (
                <TimeTableGroupHeader
                  title={format(parseISO(groupKey), "EEEE, MMMM d, yyyy")}
                  duration={getGroupDuration(entries)}
                  color={"#00EBC7"}
                />
              )}

              {groupBy === "project" && (
                <TimeTableGroupHeader
                  title={entries[0]?.project?.name || "No Project"}
                  duration={getGroupDuration(entries)}
                  color={entries[0]?.project?.color || "#4A6FFF"}
                />
              )}
            </div>
          )}

          <div className="table-container">
            <table className="table is-fullwidth time-table">
              <thead>
                <tr>
                  {/* Hide project column when grouping by project */}
                  {groupBy !== "project" && <th>Project</th>}
                  <th>Description</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{entries.map((entry) => renderEntryRow(entry))}</tbody>
            </table>
          </div>
        </div>
      ))}

      <style jsx>{`
        .table-container {
          margin-bottom: 2rem;
          overflow-x: auto;
        }

        .time-table {
          border-collapse: separate;
          border-spacing: 0;
        }

        .time-table thead th {
          background-color: transparent;
          font-weight: 600;
        }

        .entry-date {
          font-size: 0.8rem;
          color: #777;
          margin-bottom: 2px;
        }

        .no-description {
          color: #999;
          font-style: italic;
        }

        .actions-cell {
          width: 100px;
        }

        .time-entries-section:last-child .table-container {
          margin-bottom: 0;
        }

        .tag {
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
