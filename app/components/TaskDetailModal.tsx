"use client";
import { useState } from "react";
import { Task } from "../data/tasks";
import { ChevronLeft, Trash2, Calendar, Bell } from "lucide-react";

type TaskDetailProps = {
    task: Task;
    onClose: () => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, updates: Partial<Task>) => void;
};

export default function TaskDetailModal({ task, onDelete, onUpdate, onClose }: TaskDetailProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-900 rounded w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col p-6 gap-y-8">
                    {/* Back Button / Close */}
                    <button onClick={onClose} className="flex items-center gap-x-2 cursor-pointer">
                        <ChevronLeft size={24} color="#9ca3af" />
                        <span className="text-gray-200">Active Tasks</span>
                    </button>

                    {/* Title */}
                    {editingField === "title" ? (
                        <input
                            className="w-full border-b border-gray-300 outline-none text-2xl font-light"
                            defaultValue={task.title}
                            onBlur={(e) => {
                            onUpdate(task.id, { title: e.target.value });
                            setEditingField(null);
                            }}
                            autoFocus
                        />
                    ) : (
                    <h2 className="text-2xl font-light border-b border-transparent cursor-pointer" onClick={() => setEditingField("title")}>{task.title}</h2>
                    )}

                    {/* Status */}
                    {<select
                        className="cursor-pointer bg-gray-900 text-gray-200" 
                        defaultValue={task.status}
                        onChange={(e) => {
                            onUpdate(task.id, { status: e.target.value as Task["status"] });
                        }}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Responded">Responded</option>
                        <option value="Done">Done</option>
                    </select>}

                    {/* Nudge Panel*/}
                    {task.status === "Waiting" && (
                        <div className="flex flex-col p-4 bg-purple-100 text-purple-800 rounded">
                            <p className="font-bold text-sm">Nudge me if no reply by:</p>
                            <div className="flex flex-row justify-start items-center cursor-pointer" onClick={() => setEditingField("due_date")}>
                                <Calendar size={24} color="#9ca3af" className="m-2 mr-4" />
                                <input
                                    className="py-4 w-full border-b border-transparent py-4 outline-none cursor-pointer"
                                    type="date"
                                    value={task.nudge_at ? task.nudge_at.split("T")[0] : ""}
                                    onChange={(e) => {
                                    onUpdate(task.id, { nudge_at: e.target.value || null });
                                    setEditingField(null);
                                    }}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Priority */}
                    {<div className="flex flex-row gap-1 justify-center">
                        {(["Low", "Medium", "High"] as Task["priority"][]).map((p, index) => (
                            <button
                                key={p}
                                onClick={() => onUpdate(task.id, { priority: p})}
                                className={`px-4 py-2 text-md cursor-pointer
                                    ${index === 0 ? "rounded-l-full" : ""}
                                    ${index === 2 ? "rounded-r-full" : ""}
                                    ${task.priority === p
                                        ? p === "Low"
                                            ? "bg-green-100 font-bold text-green-800 hover:bg-green-200"
                                            : p === "Medium"
                                            ? "bg-yellow-100 font-bold text-yellow-800 hover:bg-yellow-200"
                                            : "bg-red-100 font-bold text-red-800 hover:bg-red-200"
                                        : p === "Low"
                                        ? "bg-gray-700 text-green-300 hover:bg-green-900"
                                        : p === "Medium"
                                        ? "bg-gray-700 text-yellow-300 hover:bg-yellow-900"
                                        : "bg-gray-700 text-red-300 hover:bg-red-900"
                                        }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>}

                    {/* Due Date */}
                    <div className="flex-col">
                        <hr className="mb-1 w-full border-gray-600" />
                        <div className="flex flex-row justify-start items-center cursor-pointer" onClick={() => setEditingField("due_date")}>
                            <Calendar size={24} color="#9ca3af" className="m-2 mr-4" />
                    {editingField === "due_date" ? (
                        <input
                            className="py-4 w-full border-b border-transparent py-4 outline-none cursor-pointer"
                            type="date"
                            value={task.due_date ? task.due_date.split("T")[0] : ""}
                            onChange={(e) => {
                            onUpdate(task.id, { due_date: e.target.value || null });
                            }}
                            autoFocus
                        />
                    ) : (
                        <p className="py-4 border-b border-transparent">{task.due_date ?? "Add Due Date"}</p>
                    )}
                        </div>
                        <hr className="mt-1 w-full border-gray-600" />
                    </div>
                </div>

                {/* Footer */}
                <hr className="mt-4 w-full border-gray-400" />
                <div className="flex justify-end items-center mt-4 mb-6 mx-6">
                    {/* Created {new Date(task.created_at).toLocaleDateString()} */}
                    <button onClick={() => onDelete(task.id)} className="cursor-pointer">
                        <Trash2 size={24} color="#9ca3af" className="m-2" />
                    </button>
                </div>
            </div>
        </div>
    )
}
