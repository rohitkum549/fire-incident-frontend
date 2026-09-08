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

// Diagnostics
export interface HealthStatus {
  status: string;
  db?: boolean;
  timestamp?: string;
  [key: string]: unknown;
}

// Geography Domain
export interface Country {
  id: string;
  name: string;
  iso_code: string;
}

export interface CreateCountryPayload {
  name: string;
  iso_code: string;
}

export interface State {
  id: string;
  country_id: string;
  name: string;
  code: string;
}

export interface CreateStatePayload {
  country_id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  state_id: string;
  name: string;
}

export interface CreateCityPayload {
  state_id: string;
  name: string;
}

// Station Domain
export interface FireStation {
  id: string;
  cityId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface CreateStationPayload {
  cityId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Shift Domain
export type ShiftStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Shift {
  id: string;
  employee_id: string;
  station_id: string;
  status: ShiftStatus;
  check_in_latitude: number;
  check_in_longitude: number;
  check_out_latitude?: number;
  check_out_longitude?: number;
  created_at?: string;
}

export interface ShiftCheckInPayload {
  employee_id: string;
  station_id: string;
  check_in_latitude: number;
  check_in_longitude: number;
}

export interface ShiftCheckOutPayload {
  shift_id: string;
  check_out_latitude: number;
  check_out_longitude: number;
}

// Complaint & Incident Domain
export interface IncidentCategory {
  id: string;
  name: string;
  description?: string;
}

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ComplaintStatus = "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED";

export interface Complaint {
  id: string;
  reporterId: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  description: string;
  status?: ComplaintStatus;
  created_at?: string;
}

export interface SubmitComplaintPayload {
  reporterId: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  description: string;
}

export type IncidentStatus = "DISPATCHED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Incident {
  id: string;
  complaintId?: string;
  stationId: string;
  categoryId: string;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  notes?: string;
  created_at?: string;
}

export interface EscalateComplaintPayload {
  complaintId: string;
  stationId: string;
  categoryId: string;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  notes: string;
}

export interface UpdateIncidentStatusPayload {
  status: IncidentStatus;
  notes: string;
}
