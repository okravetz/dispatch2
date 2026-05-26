"use client";
import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import AddTaskModal from "./components/AddTaskModal";
import { supabase } from "@/lib/supabase";
import { Task } from "./data/tasks";
import TaskDetailModal from "./components/TaskDetailModal";
import { Menu as MenuIcon } from "lucide-react";
import Menu from "./components/Menu";
import { Platform } from "./data/Platform";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState("active"); // active, responded, waiting, done, focus

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, task_platforms(platform_id, platforms(id, title))");
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        const mapped = data.map((task) => ({
          ...task,
          platforms: task.task_platforms.map(
            (tp: { platforms: Platform }) => tp.platforms
          ),
        }));

        setTasks(mapped as Task[]);
        console.log("Fetched tasks:", data);
      }
    };

    fetchTasks();

    const fetchPlatforms = async () => {
      const { data, error } = await supabase.from("platforms").select("*");
      if (error) {
        console.error("Error fetching platforms:", error);
      } else {
        const platforms = data as Platform[];
        setPlatforms(platforms);
        console.log("Fetched platforms:", data);
      }
    };

    fetchPlatforms();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    switch (currentView) {
      case "active":
        return task.status !== "Done";
      case "responded":
        return task.status === "Responded";
      case "waiting":
        return task.status === "Waiting";
      case "done":
        return task.status === "Done";
      case "focus":
        return task.status !== "Done";
      default:
        return true;
    }
  });

  const viewLabels: Record<string, string> = {
    active: "Active Tasks",
    responded: "Responded",
    waiting: "Waiting",
    done: "Done",
    focus: "Focus Mode",
  };

  const appName = "Dispatch";

  const breadcrumb =
    currentView === "active"
      ? appName
      : `${appName} / ${viewLabels[currentView] ?? currentView}`;

  const priorityOrder = {
    High: 0,
    Medium: 1,
    Low: 2,
  };

  const focusTasks = filteredTasks.sort((a, b) => {
    // Sort by priority first
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // If priority is the same, sort by due date
    if (!a.due_date && !b.due_date) return 0; // Both have no due date
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;

    // If due date is the same, sorty by date created
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const handleUpdatePlatforms = async (taskId: number, platforms: Platform[]) => {
    console.log("handleUpdatePlatforms called", taskId, platforms);

    // First, clear existing platforms for the task
    const { error } = await supabase
      .from("task_platforms")
      .delete()
      .eq("task_id", taskId);
    if (error) {
      console.error("Error clearing platforms:", error);
      return;
    }

    // Then, insert the updated platforms
    console.log("Inserting platforms:", platforms.map((p) => ({ platform_id: p.id ?? 0, task_id: taskId })));

    const { error: platformError } = await supabase
      .from("task_platforms")
      .insert(
        platforms.map((p) => ({
          platform_id: p.id ?? 0,
          task_id: taskId,
        }))
      )
      .select();
    if (platformError) {
      console.error("Error linking platforms:", platformError);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, platforms } : t))
      );
      setSelectedTask((prev) =>
        prev ? { ...prev, platforms } : null
      );
    }
  };

  return (
    <main className="w-full sm:w-1/2 mx-auto flex flex-col">
      {/* Menu Button */}
      <div className="flex items-center justify-start gap-x-2 mb-8 mt-4">
        <button
          className="p-2"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon size={24} color="#9ca3af" />
        </button>

        <div className="text-2xl font-thin flex items-center gap-x-2">
          <button
            type="button"
            className="text-left text-inherit hover:underline"
            onClick={() => setCurrentView("active")}
          >
            Dispatch
          </button>

          {currentView !== "active" && (
            <span className="text-gray-500">/ {viewLabels[currentView]}</span>
          )}
        </div>
      </div>

      {/* Task Card List */}
      <div className="flex flex-col gap-y-6">
        {currentView === "focus"
          ? focusTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                dimmed={index >= 3}
                onClick={() => setSelectedTask(task)}
              />
            ))
          : filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
              />
            ))}
      </div>

      {/* Add Task Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
        onClick={() => setIsAddTaskModalOpen(true)}
      >
        Add Task
      </button>

      {/* Menu */}
      {isMenuOpen && (
        <Menu
          onClose={() => setIsMenuOpen(false)}
          onSelect={(view) => {
            setCurrentView(view);
            setIsMenuOpen(false);
          }}
        />
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onAdd={async (task) => {
            const { data, error } = await supabase
              .from("tasks")
              .insert({
                title: task.title,
                status: task.status,
                priority: task.priority,
              })
              .select();
            if (error) {
              console.error("Error adding task:", error);
            } else {
              setTasks([...tasks, data[0] as Task]);
              const { error: platformError } = await supabase
                .from("task_platforms")
                .insert(
                  (task.platforms ?? []).map((p) => ({
                    platform_id: p.id ?? 0,
                    task_id: data[0].id,
                  }))
                )
                .select();
              if (platformError)
                console.error("Error linking platforms:", platformError);
            }
          }}
          onCreatePlatform={async (title) => {
            const { data, error } = await supabase
              .from("platforms")
              .insert({
                title,
              })
              .select()
              .single();
            if (error) {
              console.error("Error creating platform:", error);
              return null;
            } else {
              setPlatforms([...platforms, data as Platform]);
              return data as Platform;
            }
          }}
          platforms={platforms}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onDelete={async (taskId) => {
            const { error } = await supabase
              .from("tasks")
              .delete()
              .eq("id", taskId);
            if (error) {
              console.error("Error deleting task:", error);
            } else {
              setTasks(tasks.filter((t) => t.id !== taskId));
              setSelectedTask(null);
            }
          }}
          onUpdate={async (taskId, updatedFields) => {
            const { data, error } = await supabase
              .from("tasks")
              .update(updatedFields)
              .eq("id", taskId)
              .select();
            if (error) {
              console.error("Error updating task:", JSON.stringify(error));
            } else {
              setTasks(
                tasks.map((t) =>
                  t.id === taskId ? { ...t, ...updatedFields } : t
                )
              );
              setSelectedTask((prev) =>
                prev ? { ...prev, ...updatedFields } : null
              );
            }
          }}
          onUpdatePlatforms={handleUpdatePlatforms}
          onClose={() => setSelectedTask(null)}
          platforms={platforms}
        />
      )}
    </main>
  );
}
