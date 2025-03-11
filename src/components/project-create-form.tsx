"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ColorPicker from "@/components/color-picker";

export default function ProjectCreateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#F44336", // Default color
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project Name"
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <textarea
            className="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
          ></textarea>
        </div>
      </div>

      <div className="field">
        <label className="label">Color</label>
        <ColorPicker
          defaultColor={formData.color}
          onChange={handleColorChange}
        />
      </div>

      <div className="field is-grouped mt-5">
        <div className="control">
          <button
            className={`button is-primary ${isSubmitting ? "is-loading" : ""}`}
            type="submit"
            disabled={isSubmitting || !formData.name}
          >
            Create Project
          </button>
        </div>
        <div className="control">
          <Link className="button is-light" type="button" href="/dashboard">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
