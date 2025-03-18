"use client";

import { useSession } from "next-auth/react";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaChartBar,
  FaClock,
  FaCog,
  FaBars,
  FaTimes,
  FaPlusCircle,
} from "react-icons/fa";
import { SignOut } from "./signout-button";

export function SideMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const { data: session } = useSession();

  // Add a class to the body element to control the layout
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <div
        className={`sidebar ${isMenuOpen ? "is-open" : ""} has-background-dark`}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "250px",
          borderRight: "3px solid hsla(0, 0.00%, 93.30%, 0.10)",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 30,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="sidebar-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h3 className="title is-4">TrackBee</h3>
        </div>

        {/* Navigation Menu - Takes up most of the space */}
        <div
          className="menu has-background-inherit"
          style={{ flex: "1 1 auto" }}
        >
          <ul className="menu-list ">
            <li>
              <Link href="/dashboard" className="has-background-dark">
                <span className="icon mr-2">
                  <FaHome />
                </span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/projects/create" className="has-background-dark">
                <span className="icon mr-2">
                  <FaPlusCircle />
                </span>
                <span>New Project</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="has-background-dark">
                <span className="icon mr-2">
                  <FaChartBar />
                </span>
                <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link href="/time" className="has-background-dark">
                <span className="icon mr-2">
                  <FaClock />
                </span>
                <span>Time Entries</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="has-background-dark">
                <span className="icon mr-2">
                  <FaCog />
                </span>
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer with SignOut button - Pinned to bottom */}
        <div
          className="sidebar-footer"
          style={{
            marginTop: "auto",
            paddingTop: "1rem",
            borderTop: "1px solid hsla(0, 0%, 93%, 0.2)",
          }}
        >
          <SignOut />
        </div>
      </div>

      {/* Fixed toggle button that's always visible */}
      <div
        className="menu-toggle-wrapper"
        style={{
          position: "fixed",
          left: isMenuOpen ? "190px" : "20px",
          top: "1.5rem",
          zIndex: 40,
          transition: "left 0.3s ease-in-out",
        }}
      >
        <button
          className="button is-primary is-rounded"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          }}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </>
  );
}
