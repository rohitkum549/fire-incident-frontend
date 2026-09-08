import React, { useEffect, useState } from "react";
import { DashboardCard } from "../components/ui/DashboardCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { incidentService } from "../services/incidentService";
import { complaintService } from "../services/complaintService";
import { shiftService } from "../services/shiftService";
import { adminService } from "../services/adminService";
import { useAuth } from "../auth/useAuth";
import {
  DashboardMetric,
  IncidentCategory,
  Complaint,
  Incident,
  Shift,
  SeverityLevel,
} from "../types";
import {
  ShieldAlert,
  Flame,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  FlameKindling,
  Activity,
} from "lucide-react";

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [categories, setCategories] = useState<IncidentCategory[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form states for Citizen Complaint
  const [complaintCategory, setComplaintCategory] = useState<string>("");
  const [complaintSeverity, setComplaintSeverity] = useState<SeverityLevel>("HIGH");
  const [complaintDescription, setComplaintDescription] = useState<string>("");
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState<boolean>(false);

  // Form states for Admin Complaint Escalation
  const [escalateComplaintId, setEscalateComplaintId] = useState<string>("");
  const [escalateStationId, setEscalateStationId] = useState<string>("");
  const [escalateNotes, setEscalateNotes] = useState<string>("");
  const [isEscalating, setIsEscalating] = useState<boolean>(false);

  // Form states for Firefighter Shift & Incident status update
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("");
  const [incidentNotes, setIncidentNotes] = useState<string>("");
  const [isUpdatingIncident, setIsUpdatingIncident] = useState<boolean>(false);
  const [isShiftProcessing, setIsShiftProcessing] = useState<boolean>(false);

  const roles = user?.roles || [];
  const isAdmin = roles.some((r) => r.toUpperCase().includes("ADMIN"));
  const isFirefighter = roles.some((r) => r.toUpperCase().includes("FIREFIGHTER"));
  const isCitizen = !isAdmin && !isFirefighter;

  const loadData = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const [metricsData, categoriesData, complaintsData, incidentsData, shiftsData] =
        await Promise.all([
          incidentService.getDashboardMetrics(),
          complaintService.getCategories(),
          complaintService.getComplaints(),
          incidentService.getIncidents(),
          shiftService.getShifts(),
        ]);

      setMetrics(metricsData);
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setComplaintCategory((prev) => prev || categoriesData[0].id);
      }

      setComplaints(complaintsData);
      if (complaintsData.length > 0) {
        setEscalateComplaintId((prev) => prev || complaintsData[0].id);
      }

      setIncidents(incidentsData);
      if (incidentsData.length > 0) {
        setSelectedIncidentId((prev) => prev || incidentsData[0].id);
      }

      const currentActive = shiftsData.find((s) => s.status === "ACTIVE") || null;
      setActiveShift(currentActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleCitizenSubmitComplaint = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!complaintDescription.trim()) {
      setError("Please describe the incident before submitting.");
      return;
    }

    setIsSubmittingComplaint(true);
    setError(null);
    setActionSuccess(null);

    try {
      const newComplaint = await complaintService.submitComplaint({
        reporterId: user?.id || "citizen-user",
        categoryId: complaintCategory,
        latitude: 37.7749,
        longitude: -122.4194,
        severity: complaintSeverity,
        description: complaintDescription.trim(),
      });

      setComplaints((prev) => [newComplaint, ...prev]);
      setActionSuccess(`Complaint #${newComplaint.id || "submitted"} reported successfully.`);
      setComplaintDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit complaint.");
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const handleAdminEscalate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!escalateComplaintId) {
      setError("Select a complaint to escalate.");
      return;
    }

    setIsEscalating(true);
    setError(null);
    setActionSuccess(null);

    try {
      const targetComplaint = complaints.find((c) => c.id === escalateComplaintId);
      const newIncident = await adminService.escalateComplaint({
        complaintId: escalateComplaintId,
        stationId: escalateStationId || user?.station_id || "station-1",
        categoryId: targetComplaint?.categoryId || complaintCategory || "cat-001",
        severity: targetComplaint?.severity || "HIGH",
        latitude: targetComplaint?.latitude || 37.7749,
        longitude: targetComplaint?.longitude || -122.4194,
        notes: escalateNotes.trim() || "Escalated by station dispatcher.",
      });

      setIncidents((prev) => [newIncident, ...prev]);
      setActionSuccess(`Complaint escalated to Incident #${newIncident.id}. Units dispatched.`);
      setEscalateNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Escalation failed.");
    } finally {
      setIsEscalating(false);
    }
  };

  const handleShiftToggle = async (): Promise<void> => {
    setIsShiftProcessing(true);
    setError(null);
    setActionSuccess(null);

    try {
      if (activeShift) {
        // Check out
        const updated = await shiftService.checkOut({
          shift_id: activeShift.id,
          check_out_latitude: 37.7756,
          check_out_longitude: -122.4194,
        });
        setActiveShift(null);
        setActionSuccess(`Shift #${updated.id || activeShift.id} checked out successfully.`);
      } else {
        // Check in
        const newShift = await shiftService.checkIn({
          employee_id: user?.employee_code || user?.id || "emp-101",
          station_id: user?.station_id || "station-1",
          check_in_latitude: 37.7749,
          check_in_longitude: -122.4194,
        });
        setActiveShift(newShift);
        setActionSuccess(`Checked in for shift #${newShift.id || "active"} at station.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shift status update failed.");
    } finally {
      setIsShiftProcessing(false);
    }
  };

  const handleIncidentStatusTransition = async (
    newStatus: "IN_PROGRESS" | "RESOLVED"
  ): Promise<void> => {
    if (!selectedIncidentId) {
      setError("Select an incident to update status.");
      return;
    }

    setIsUpdatingIncident(true);
    setError(null);
    setActionSuccess(null);

    try {
      await incidentService.updateIncidentStatus(selectedIncidentId, {
        status: newStatus,
        notes: incidentNotes.trim() || `Incident status set to ${newStatus}.`,
      });

      setIncidents((prev) =>
        prev.map((inc) => (inc.id === selectedIncidentId ? { ...inc, status: newStatus } : inc))
      );
      setActionSuccess(`Incident #${selectedIncidentId} updated to ${newStatus}.`);
      setIncidentNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incident status update failed.");
    } finally {
      setIsUpdatingIncident(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Synchronizing operational metrics..." />;
  }

  return (
    <main className="dashboard-page">
      {/* Top Banner Success Notification */}
      {actionSuccess ? (
        <div className="action-success-banner" role="status">
          <CheckCircle2 size={18} /> {actionSuccess}
        </div>
      ) : null}

      {error ? <ErrorMessage message={error} onRetry={loadData} /> : null}

      {/* Metrics Row */}
      <section className="metric-grid">
        {metrics.map((metric) => (
          <DashboardCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            caption={metric.caption}
          />
        ))}
      </section>

      {/* Role-Based Dashboard Panels */}

      {/* 1. ADMIN DASHBOARD PANEL */}
      {isAdmin ? (
        <section className="role-dashboard-panel admin-panel">
          <div className="panel-header">
            <ShieldAlert size={22} className="panel-icon admin-icon" />
            <div>
              <h3>Station Dispatcher & Admin Operations</h3>
              <p>Escalate reported citizen complaints into active response incidents.</p>
            </div>
          </div>

          <div className="panel-content-grid">
            <form onSubmit={handleAdminEscalate} className="admin-escalate-form">
              <h4>
                <Flame size={16} /> Escalate Complaint to Incident
              </h4>

              <div className="input-group">
                <label htmlFor="complaint-select">Reported Complaint</label>
                {complaints.length > 0 ? (
                  <select
                    id="complaint-select"
                    className="custom-select-input"
                    value={escalateComplaintId}
                    onChange={(e) => setEscalateComplaintId(e.target.value)}
                  >
                    {complaints.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.severity}] #{c.id} - {c.description.slice(0, 45)}...
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={escalateComplaintId}
                    onChange={(e) => setEscalateComplaintId(e.target.value)}
                    placeholder="Enter Complaint ID"
                  />
                )}
              </div>

              <div className="input-group">
                <label htmlFor="station-id-input">Assigned Fire Station ID</label>
                <input
                  id="station-id-input"
                  type="text"
                  value={escalateStationId || user?.station_id || "station-1"}
                  onChange={(e) => setEscalateStationId(e.target.value)}
                  placeholder="Station ID"
                />
              </div>

              <div className="input-group">
                <label htmlFor="escalate-notes">Dispatcher Notes</label>
                <textarea
                  id="escalate-notes"
                  rows={2}
                  value={escalateNotes}
                  onChange={(e) => setEscalateNotes(e.target.value)}
                  placeholder="Dispatching SFFD Station 1 Units to location..."
                />
              </div>

              <button type="submit" className="button-primary" disabled={isEscalating}>
                {isEscalating ? "Escalating..." : "Dispatch & Create Incident"}
              </button>
            </form>

            <div className="admin-status-overview">
              <h4>System Active Incidents ({incidents.length})</h4>
              {incidents.length === 0 ? (
                <EmptyState
                  title="No Active Incidents"
                  description="All complaints are currently cleared."
                />
              ) : (
                <div className="incident-list-scroll">
                  {incidents.map((inc) => (
                    <div key={inc.id} className="incident-status-card">
                      <div className="inc-header">
                        <strong>Incident #{inc.id}</strong>
                        <span className={`status-pill status-${inc.status.toLowerCase()}`}>
                          {inc.status}
                        </span>
                      </div>
                      <small>
                        Severity: {inc.severity} | Location: ({inc.latitude}, {inc.longitude})
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* 2. FIREFIGHTER DASHBOARD PANEL */}
      {isFirefighter ? (
        <section className="role-dashboard-panel firefighter-panel">
          <div className="panel-header">
            <FlameKindling size={22} className="panel-icon ff-icon" />
            <div>
              <h3>Firefighter Operational Response & Shift Logging</h3>
              <p>Log shift check-in/out and update live scene incident status.</p>
            </div>
          </div>

          <div className="panel-content-grid">
            <div className="shift-card-block">
              <h4>
                <Clock size={16} /> Shift Proximity Logging
              </h4>
              <p className="card-copy">
                Station ID: <strong>{user?.station_id || "Station 1"}</strong> | Employee Code:{" "}
                <strong>{user?.employee_code || "EMP-99881"}</strong>
              </p>
              <div className="shift-status-row">
                <span className={`status-pill ${activeShift ? "status-safe" : "status-warning"}`}>
                  {activeShift ? "ACTIVE SHIFT IN PROGRESS" : "NOT CHECKED IN"}
                </span>
                <button
                  type="button"
                  className={activeShift ? "button-secondary" : "button-primary"}
                  onClick={handleShiftToggle}
                  disabled={isShiftProcessing}
                >
                  {isShiftProcessing
                    ? "Processing..."
                    : activeShift
                      ? "Check Out Shift"
                      : "Check In Shift (GPS: 37.7749, -122.4194)"}
                </button>
              </div>
            </div>

            <div className="incident-transition-block">
              <h4>
                <Activity size={16} /> Transition Scene Status
              </h4>
              <div className="input-group">
                <label htmlFor="select-incident">Active Scene Incident</label>
                {incidents.length > 0 ? (
                  <select
                    id="select-incident"
                    className="custom-select-input"
                    value={selectedIncidentId}
                    onChange={(e) => setSelectedIncidentId(e.target.value)}
                  >
                    {incidents.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        Incident #{inc.id} [{inc.status}] - Severity: {inc.severity}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedIncidentId}
                    onChange={(e) => setSelectedIncidentId(e.target.value)}
                    placeholder="Enter Incident ID"
                  />
                )}
              </div>

              <div className="input-group">
                <label htmlFor="inc-notes">Operational Field Notes</label>
                <input
                  id="inc-notes"
                  type="text"
                  value={incidentNotes}
                  onChange={(e) => setIncidentNotes(e.target.value)}
                  placeholder="Engine arrived on scene / hose lines deployed..."
                />
              </div>

              <div className="transition-buttons-row">
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => handleIncidentStatusTransition("IN_PROGRESS")}
                  disabled={isUpdatingIncident}
                >
                  Set IN_PROGRESS
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => handleIncidentStatusTransition("RESOLVED")}
                  disabled={isUpdatingIncident}
                >
                  Set RESOLVED
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. CITIZEN DASHBOARD PANEL */}
      {isCitizen ? (
        <section className="role-dashboard-panel citizen-panel">
          <div className="panel-header">
            <UserCheck size={22} className="panel-icon citizen-icon" />
            <div>
              <h3>Public Emergency & Incident Reporting</h3>
              <p>Report fire emergencies directly to local fire station dispatchers.</p>
            </div>
          </div>

          <div className="panel-content-grid">
            <form onSubmit={handleCitizenSubmitComplaint} className="citizen-complaint-form">
              <h4>
                <Send size={16} /> Submit Fire Emergency Complaint
              </h4>

              <div className="form-row-2col">
                <div className="input-group">
                  <label htmlFor="category-select">Emergency Category</label>
                  <select
                    id="category-select"
                    className="custom-select-input"
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.description})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="severity-select">Severity Level</label>
                  <select
                    id="severity-select"
                    className="custom-select-input"
                    value={complaintSeverity}
                    onChange={(e) => setComplaintSeverity(e.target.value as SeverityLevel)}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="complaint-desc">Incident Description & Location Details</label>
                <textarea
                  id="complaint-desc"
                  rows={3}
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  placeholder="Heavy smoke observed coming from commercial building near Lafayette St..."
                  required
                />
              </div>

              <button type="submit" className="button-primary" disabled={isSubmittingComplaint}>
                {isSubmittingComplaint ? "Submitting Report..." : "Submit Emergency Complaint"}
              </button>
            </form>

            <div className="citizen-complaints-list">
              <h4>Recent Emergency Complaints ({complaints.length})</h4>
              {complaints.length === 0 ? (
                <EmptyState
                  title="No Active Complaints"
                  description="You have not submitted any complaints yet."
                />
              ) : (
                <div className="complaint-scroll-box">
                  {complaints.map((cmp) => (
                    <div key={cmp.id} className="complaint-card-item">
                      <div className="cmp-header">
                        <strong>Complaint #{cmp.id}</strong>
                        <span
                          className={`status-pill status-${(cmp.status || "PENDING").toLowerCase()}`}
                        >
                          {cmp.status || "PENDING"}
                        </span>
                      </div>
                      <p className="cmp-desc">{cmp.description}</p>
                      <small>
                        Severity: {cmp.severity} | Category: {cmp.categoryId}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default Home;
