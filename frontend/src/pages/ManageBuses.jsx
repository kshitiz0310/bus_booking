import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBuses.css"; // Create this file for styles

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);

  const loadBuses = async () => {
    try {
      const { data } = await axios.get("/api/buses");
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
      await axios.delete(`/api/buses/${id}`);
      loadBuses();
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  return (
    <div className="manage-buses-container">
      <h2>Manage Buses</h2>
      <button className="add-bus-btn">Add New Bus</button>
      <table className="buses-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus Name</th>
            <th>Route</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus._id}>
              <td>{bus._id}</td>
              <td>{bus.name}</td>
              <td>{bus.route}</td>
              <td>{bus.seats}</td>
              <td>{bus.status}</td>
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
