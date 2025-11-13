import React, { useEffect, useState } from "react";
import API from "../api";
import "./ManageBuses.css"; // Create this file for styles

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    startPoint: "",
    destination: "",
    driverName: "",
    driverPhone: "",
    capacity: 40,
    seatsAvailable: 40,
    ac: true,
    fare: 0,
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBuses = async () => {
    try {
      const { data } = await API.get("/buses");
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/buses/${id}`);
      loadBuses();
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/buses", formData);
      setShowAddForm(false);
      setFormData({
        busNumber: "",
        date: "",
        departureTime: "",
        arrivalTime: "",
        startPoint: "",
        destination: "",
        driverName: "",
        driverPhone: "",
        capacity: 40,
        seatsAvailable: 40,
        ac: true,
        fare: 0,
        notes: ""
      });
      loadBuses();
    } catch (error) {
      setError("Failed to add bus. Please try again.");
      console.error("Error adding bus:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-buses-container">
      <h2>Manage Buses</h2>
      <button className="add-bus-btn" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel" : "Add New Bus"}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-bus-form">
          <h3>Add New Bus</h3>
          {error && <p className="error-message">{error}</p>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="busNumber">Bus Number:</label>
              <input
                type="text"
                id="busNumber"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleInputChange}
                required
                placeholder="e.g., BUS-001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="departureTime">Departure Time:</label>
              <input
                type="time"
                id="departureTime"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="arrivalTime">Arrival Time:</label>
              <input
                type="time"
                id="arrivalTime"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startPoint">Start Point:</label>
              <input
                type="text"
                id="startPoint"
                name="startPoint"
                value={formData.startPoint}
                onChange={handleInputChange}
                required
                placeholder="e.g., New York"
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">Destination:</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
                placeholder="e.g., Boston"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="driverName">Driver Name:</label>
              <input
                type="text"
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleInputChange}
                required
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="driverPhone">Driver Phone:</label>
              <input
                type="tel"
                id="driverPhone"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleInputChange}
                required
                placeholder="e.g., +1-555-123-4567"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">Capacity:</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fare">Fare:</label>
              <input
                type="number"
                id="fare"
                name="fare"
                value={formData.fare}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes..."
              rows="3"
            />
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="ac">
              <input
                type="checkbox"
                id="ac"
                name="ac"
                checked={formData.ac}
                onChange={handleInputChange}
              />
              Air Conditioned
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding Bus..." : "Add Bus"}
          </button>
        </form>
      )}

      <table className="buses-table">
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Route</th>
            <th>Date</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Capacity</th>
            <th>Fare</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus._id}>
              <td>{bus.busNumber}</td>
              <td>{bus.startPoint} to {bus.destination}</td>
              <td>{new Date(bus.date).toLocaleDateString()}</td>
              <td>{bus.departureTime}</td>
              <td>{bus.arrivalTime}</td>
              <td>{bus.capacity}</td>
              <td>${bus.fare}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(bus._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
