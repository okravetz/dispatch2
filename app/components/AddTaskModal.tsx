"use client";
import { useState } from "react";
import { Task } from "../data/tasks";

type AddTaskModalProps = {
    onClose: () => void;
    onAdd: (task: Task) => void;
};

export default function AddTaskModal({ onClose, onAdd }: AddTaskModalProps) {
const [title, setTitle] = useState("");
const [status, setStatus] = useState("Not Started");
const [priority, setPriority] = useState("Medium");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-gray-900 rounded p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold py-4 px-2">Add Task</h1>
        {/* Add Task Form */}
        <form className="flex flex-col p-4">
            <label className="mb-2 font-bold text-lg text-gray-200" htmlFor="title">Title</label>
            <input className="border border-gray-300 rounded p-2" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            
            <label className="mb-2 font-bold text-lg text-gray-200 mt-6" htmlFor="status">Status</label>
            <select className="border border-gray-300 rounded p-2" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Responded">Responded</option>
                <option value="Waiting">Waiting</option>
                <option value="Done">Done</option>
            </select>

            <label className="mb-2 font-bold text-lg text-gray-200 mt-6" htmlFor="priority">Priority</label>
            <select className="border border-gray-300 rounded p-2" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <button className="mt-8 bg-blue-500 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => {
              onAdd({
                id: Date.now(),
                title,
                status: status as Task["status"],
                priority: priority as Task["priority"],
                contact: "",
                due_date: new Date().toISOString().split("T")[0],
              });
              onClose();
            }}>
                Add Task
            </button>
            <button className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded" type="button" onClick={onClose}>
                Cancel
            </button>
        </form>
      </div>
    </div>
  );
}