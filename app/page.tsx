import { task_list } from "./data/tasks";
import TaskCard from "./components/TaskCard";

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-bold py-4 px-2">Dispatch2</h1>
      {task_list.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </main>
  );
}