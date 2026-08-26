import { Asset, WorkOrder, DashboardMetric, ChatMessage } from "../types";
import { fetchApi } from "../api/client";

const mockMetrics: DashboardMetric[] = [
  { title: "Total Incidents", value: "12", caption: "Last 24 hours" },
  { title: "Units Dispatched", value: "06 Trucks", caption: "Active response" },
  { title: "Avg Response", value: "5.5 mins", caption: "Field average" },
];

const mockAssets: Asset[] = [
  {
    id: 1,
    name: "Engine 5",
    status: "Available",
    details: "Location: Station 3",
    location: "Station 3",
    nextInspection: "2026-09-12",
    notes: "Full pump test completed. No outstanding issues.",
  },
  {
    id: 2,
    name: "Ladder 2",
    status: "In Service",
    details: "Maintenance due",
    location: "Station 1",
    nextInspection: "2026-08-30",
    notes: "Hydraulic lift check scheduled.",
  },
  {
    id: 3,
    name: "Rescue 1",
    status: "Inspection",
    details: "Safety check scheduled",
    location: "HQ Depot",
    nextInspection: "2026-08-25",
    notes: "First aid equipment restocking required.",
  },
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: 201,
    title: "Service Engine 5",
    status: "Open",
    due: "Today",
    assignedTo: "Crew Alpha",
    description: "Complete routine service and verify pump output pressures.",
    location: "Station 3",
  },
  {
    id: 202,
    title: "Inspect Ladder 2",
    status: "Assigned",
    due: "Tomorrow",
    assignedTo: "Crew Bravo",
    description: "Comprehensive structural and hydraulic inspection of ladder assembly.",
    location: "Station 1",
  },
  {
    id: 203,
    title: "Calibrate Radio Systems",
    status: "Pending",
    due: "Sep 30",
    assignedTo: "Comms Team",
    description: "Calibrate multi-band field transceivers and dispatch channels.",
    location: "HQ Depot",
  },
];

const mockChatMessages: ChatMessage[] = [
  { id: 1, name: "Dispatch", message: "Engine 5 en route to station.", time: "09:18" },
  { id: 2, name: "Field Team", message: "Confirming ladder inspection completed.", time: "09:12" },
];

export const incidentService = {
  async getDashboardMetrics(): Promise<DashboardMetric[]> {
    try {
      return await fetchApi<DashboardMetric[]>("/metrics");
    } catch {
      // Fallback mock data for local UAT execution when backend server is offline
      return mockMetrics;
    }
  },

  async getAssets(): Promise<Asset[]> {
    try {
      return await fetchApi<Asset[]>("/assets");
    } catch {
      return mockAssets;
    }
  },

  async getAssetById(id: number): Promise<Asset | null> {
    try {
      return await fetchApi<Asset>(`/assets/${id}`);
    } catch {
      return mockAssets.find((a) => a.id === id) || null;
    }
  },

  async getWorkOrders(): Promise<WorkOrder[]> {
    try {
      return await fetchApi<WorkOrder[]>("/work-orders");
    } catch {
      return mockWorkOrders;
    }
  },

  async getWorkOrderById(id: number): Promise<WorkOrder | null> {
    try {
      return await fetchApi<WorkOrder>(`/work-orders/${id}`);
    } catch {
      return mockWorkOrders.find((w) => w.id === id) || null;
    }
  },

  async getChatMessages(): Promise<ChatMessage[]> {
    try {
      return await fetchApi<ChatMessage[]>("/messages");
    } catch {
      return mockChatMessages;
    }
  },
};
