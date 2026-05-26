"use client";
import { useState } from "react";
import { Task } from "../data/tasks";
import { Platform } from "../data/Platform";
import PlatformSelector from "./PlatformSelector";

type AddTaskModalProps = {
  onClose: () => void;
  onAdd: (task: Task) => void;
  platforms?: Platform[]; // Optional platforms prop
  onCreatePlatform?: (title: string) => Promise<Platform | null>; // Optional platform creation callback
};

export default function AddTaskModal({
  onClose,
  onAdd,
  platforms,
  onCreatePlatform,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("Medium");
  const [activeTab, setActiveTab] = useState("manual");
  const [pasteText, setPasteText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold py-4 px-2">Add Task</h1>
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 text-sm font-medium cursor-pointer ${
              activeTab === "manual"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-4 py-2 text-sm font-medium cursor-pointer ${
              activeTab === "paste"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Paste & Parse
          </button>
        </div>

        {/* Manual Task Form */}
        {activeTab === "manual" && (
          <form className="flex flex-col p-4">
            {/* Title */}
            <label
              className="mb-2 font-bold text-lg text-gray-200"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="border border-gray-300 rounded p-2"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Status */}
            <label
              className="mb-2 font-bold text-lg text-gray-200 mt-6"
              htmlFor="status"
            >
              Status
            </label>
            <select
              className="cursor-pointer bg-gray-900 text-gray-200 border border-gray-300 rounded p-2"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Responded">Responded</option>
              <option value="Waiting">Waiting</option>
              <option value="Done">Done</option>
            </select>

            {/* Priority */}
            <label
              className="mb-2 font-bold text-lg text-gray-200 mt-6"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              className="cursor-pointer bg-gray-900 text-gray-200 border border-gray-300 rounded p-2"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Platforms */}
            <label
              className="mb-2 font-bold text-lg text-gray-200 mt-6"
              htmlFor="platforms"
            >
              Platforms
            </label>
            <PlatformSelector
              platforms={platforms || []}
              selectedPlatforms={selectedPlatforms}
              onChange={(selected) => setSelectedPlatforms(selected)}
              onCreatePlatform={async (title) => {
                const newPlatform = await onCreatePlatform?.(title);
                if (newPlatform) {
                  setSelectedPlatforms([...selectedPlatforms, newPlatform]);
                }
                return newPlatform || null;
              }}
            />

            {/* CTAs */}
            <button
              className="mt-8 bg-blue-500 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() => {
                onAdd({
                  title,
                  status: status as Task["status"],
                  priority: priority as Task["priority"],
                  contact: "",
                  platforms: selectedPlatforms,
                  due_date: new Date().toISOString().split("T")[0],
                });
                onClose();
              }}
            >
              Add Task
            </button>
            <button
              className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        )}

        {/* Paste & Parse Task Form */}
        {activeTab === "paste" && (
          <form className="flex flex-col p-4">
            <label
              className="mb-2 font-bold text-lg text-gray-200"
              htmlFor="title"
            >
              Paste Here
            </label>
            <textarea
              className="border border-gray-300 rounded p-2"
              id="title"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />

            <button
              className={`mt-8 text-white font-bold py-2 px-4 rounded ${isLoading ? "bg-gray-500" : "bg-blue-500"}`}
              type="button"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                const response = await fetch("/api/parse-task", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: pasteText }),
                });
                if (!response.ok) {
                  const error = await response.json();
                  console.error("API error:", error);
                  setIsLoading(false);
                  return;
                }
                const parsed = await response.json();
                onAdd({
                  title: parsed.title,
                  status: parsed.status as Task["status"],
                  priority: parsed.priority as Task["priority"],
                  contact: parsed.contact,
                  platforms: selectedPlatforms,
                  due_date: parsed.due_date,
                });
                setIsLoading(false);
                onClose();
              }}
            >
              {isLoading ? "Parsing..." : "Add Task"}
            </button>
            <button
              className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
