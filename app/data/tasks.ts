import { Platform } from "./Platform";

export type Task = {
  id?: number; //optiona, set by the database
  title: string;
  status: "Not Started" | "In Progress" | "Responded" | "Waiting" | "Done";
  priority: "Low" | "Medium" | "High";
  contact?: string; //optional
  platforms: Platform[];
  due_date: string | null; // ISO format date string
  nudge_at?: string | null; // ISO format date string, optional
  nudge_sent?: boolean; // Indicates if nudge has been sent
};
