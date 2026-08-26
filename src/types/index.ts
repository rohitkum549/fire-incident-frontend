export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

export type AssetStatus = "Available" | "In Service" | "Inspection" | "Out of Service";

export interface Asset {
  id: number;
  name: string;
  status: AssetStatus;
  details: string;
  location: string;
  nextInspection?: string;
  notes?: string;
}

export type WorkOrderStatus = "Open" | "Assigned" | "In Progress" | "Pending" | "Completed";

export interface WorkOrder {
  id: number;
  title: string;
  status: WorkOrderStatus;
  due: string;
  assignedTo: string;
  description: string;
  location: string;
}

export interface DashboardMetric {
  title: string;
  value: string;
  caption?: string;
}

export interface ChatMessage {
  id: number;
  name: string;
  message: string;
  time: string;
}

export interface SettingItem {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
