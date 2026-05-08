export type Task = {
    id: number;
    title: string;
    status: "Not Started" | "In Progress" | "Responded" | "Waiting" | "Done";
    priority: "Low" | "Medium" | "High";
    contact: string;
    due_date: string | null; // ISO format date string
    nudge_at?: string | null; // ISO format date string, optional
    nudge_sent?: boolean; // Indicates if nudge has been sent
};

export const task_list: Task[] = [
    {  
        id: 0,
        title: "Task 1",
        status: "Not Started",
        priority: "Medium",
        contact: "John Doe",
        due_date: "2026-07-01"
    },
    {  
        id: 1,
        title: "Task 2",
        status: "Not Started",
        priority: "Medium",
        contact: "John Doe",
        due_date: "2026-07-01"
    },
    {  
        id: 2,
        title: "Task 3",
        status: "Not Started",
        priority: "Medium",
        contact: "John Doe",
        due_date: "2026-07-01"
    },
    {  
        id: 3,
        title: "Task 4",
        status: "Not Started",
        priority: "Medium",
        contact: "John Doe",
        due_date: "2026-07-01"
    }
];