"use client";
import { useState } from "react";
import { task_list } from "./data/tasks";
import TaskCard from "./components/TaskCard";
import AddTaskModal from "./components/AddTaskModal";

export default function Home() {
  const [tasks, setTasks] = useState(task_list);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main>
      <h1 className="text-2xl font-bold py-4 px-2">Dispatch2</h1>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      <button className="fixed bottom-4 right-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => setIsModalOpen(true)}>
        Add Task
      </button>
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onAdd={(task) => {
            setTasks([...tasks, task]);
          }}
        />
      )}
    </main>
  );
}