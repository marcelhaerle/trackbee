"use client";

import { useEffect, useState } from "react";
import { CurrentTrackingInfo } from "./current-tracking-info";
import { Project } from "@prisma/client";
import Link from "next/link";
import ProjectCard from "./project-card";

export interface CurrentTracking {
  id: string;
  startTime: string;
  project: Project;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentTracking, setCurrentTracking] =
    useState<CurrentTracking | null>(null);

  const handleStartTracking = async (projectId: string) => {
    fetch(`/api/tracking`, {
      method: "POST",
      body: JSON.stringify({ id: projectId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((tracking) => {
        if (tracking) {
          setCurrentTracking({
            id: tracking.id,
            startTime: tracking.startTime,
            project: tracking.project,
          });
        }
      });
  };

  const handleStopTracking = async () => {
    fetch(`/api/tracking`, {
      method: "DELETE",
    });

    setCurrentTracking(null);
  };

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((projects) => setProjects(projects));
    fetch("/api/tracking")
      .then((response) => {
        if (response.status === 204) {
          return null;
        }
        return response.json();
      })
      .then((tracking) => {
        if (tracking) {
          setCurrentTracking(tracking);
        }
      });
  }, []);

  function renderCurrentTracking() {
    return (
      <section className="section">
        <CurrentTrackingInfo
          currentTracking={currentTracking}
          onStopTracking={handleStopTracking}
        />
      </section>
    );
  }

  function renderProjects() {
    return (
      <section className="section">
        {projects.length === 0 ? (
          <article className="message">
            <div className="message-body">
              You have no projects yet.{" "}
              <Link href="/projects/create">Create</Link> one to get started!
            </div>
          </article>
        ) : (
          <div className="columns is-desktop is-multiline">
            {projects.map((project) => (
              <div
                className="column is-half-desktop is-half-widescreen"
                key={project.id}
              >
                <ProjectCard
                  project={project}
                  onStartTracking={handleStartTracking}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <>{currentTracking !== null ? renderCurrentTracking() : renderProjects()}</>
  );
}
