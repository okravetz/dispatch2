import React from "react"
import { Task } from "../data/tasks";

type TaskCardProps = {
    task: Task;
    onClick?: () => void;
};

function PriorityIndicator({ priority }: { priority: Task["priority"] }) {
    switch (priority) {
        case "Low":
            return <p className="text-sm bg-green-100 text-green-800 font-bold rounded-full p-1 px-2">L</p>;
        case "Medium":
            return <p className="text-sm bg-yellow-100 text-yellow-800 font-bold rounded-full p-1 px-2">M</p>;
        case "High":
            return <p className="text-sm bg-red-100 text-red-800 font-bold rounded-full p-1 px-2">H</p>;
        default:
            return null;
    }
}

function StatusIndicator({ status }: { status: Task["status"] }) {
    switch (status) {
        case "Not Started":
            return <p className="text-sm bg-gray-100 text-gray-800 font-bold rounded-full p-1 px-2">Not Started</p>;
        case "In Progress":
            return <p className="text-sm bg-blue-100 text-blue-800 font-bold rounded-full p-1 px-2">In Progress</p>;
        case "Waiting":
            return <p className="text-sm bg-yellow-100 text-yellow-800 font-bold rounded-full p-1 px-2">Waiting</p>;
        case "Responded":
            return <p className="text-sm bg-green-100 text-green-800 font-bold rounded-full p-1 px-2">Responded</p>;
        case "Done":
            return <p className="text-sm bg-gray-100 text-gray-800 font-bold rounded-full p-1 px-2">Done</p>;
        default:
            return null;
    }
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        
        // Task Card
        <div className="flex flex-col p-2 border-b rounded-lg border-gray-300 m-4 bg-gray-800 hover:bg-gray-600 cursor-pointer" onClick={onClick}>
            
            {/* Task Header */}
            <div className="flex flex-row flex-auto pb-4">

                {/* Priority Indicator */}
                <div className="flex-none pr-4">
                    <PriorityIndicator priority={task.priority} />
                </div>

                {/* Task Info */}
                <div className="flex-auto">
                    <h2 className="text-lg font-bold">{task.title}</h2>
                    <p className="text-sm text-gray-500">{task.contact}</p>
                </div>

                {/* Status Indicator */}
                <div className="flex-none pl-4">
                    <StatusIndicator status={task.status} />
                </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-auto">
               {task.due_date ? <p className="text-sm">Due: {new Date(task.due_date + 'T00:00:00').toLocaleDateString()}</p> : null}
            </div>

        </div>
    );
}