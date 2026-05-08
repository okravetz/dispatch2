"use client";
import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import AddTaskModal from "./components/AddTaskModal";
import { supabase } from "@/lib/supabase";
import { Task } from "./data/tasks";
import TaskDetailModal from "./components/TaskDetailModal";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data as Task[]);
        console.log("Fetched tasks:", data);
      }
    };

    fetchTasks();
  }, []);

  return (
    <main>
      <h1 className="text-2xl font-bold py-4 px-2">Dispatch2</h1>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
      ))}
      <button className="fixed bottom-4 right-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={() => setIsAddTaskModalOpen(true)}>
        Add Task
      </button>
      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onAdd={async (task) => {
            const { data, error } = await supabase.from("tasks").insert({
              title: task.title,
              status: task.status,
              priority: task.priority
            }).select();
            if (error) {
              console.error("Error adding task:", error);
            } else {
              setTasks([...tasks, data[0] as Task]);
            }
          }}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onDelete={async (taskId) => {
            const { error } = await supabase.from("tasks").delete().eq("id", taskId);
            if (error) {
              console.error("Error deleting task:", error);
            } else {
              setTasks(tasks.filter((t) => t.id !== taskId));
              setSelectedTask((null));
            }
          }}
          onUpdate={async (taskId, updatedFields) => {
            const { data, error } = await supabase.from("tasks").update(updatedFields).eq("id", taskId).select();
            if (error) {
              console.error("Error updating task:", error);
            } else {
              setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t)));
              setSelectedTask((prev) => prev ? { ...prev, ...updatedFields } : null);
            }
          }}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </main>
  );
}