"use client";
import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import AddTaskModal from "./components/AddTaskModal";
import { supabase } from "@/lib/supabase";
import { Task } from "./data/tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <TaskCard key={task.id} task={task} />
      ))}
      <button className="fixed bottom-4 right-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => setIsModalOpen(true)}>
        Add Task
      </button>
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
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
    </main>
  );
}