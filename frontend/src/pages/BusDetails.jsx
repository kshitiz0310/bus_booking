import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BusDetails.css'; // Create this file for styles

export default function BusDetails() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const { data } = await axios.get(`/api/buses/${id}`);
        setBus(data);
      } catch (error) {
        console.error('Error fetching bus:', error);
      }
    };
    fetchBus();
  }, [id]);

  if (!bus) return <div className="busdetails-loading">Loading...</div>;

  return (
    <div className="busdetails-bg">
      <div className="busdetails-container">
        <h1 className="busdetails-title">Bus Details</h1>
        <div className="busdetails-grid">
          <div>
            <h2 className="busdetails-section">Bus Information</h2>
            <p><strong>ID:</strong> {bus._id}</p>
            <p><strong>Name:</strong> {bus.name}</p>
            <p><strong>Route:</strong> {bus.route}</p>
            <p><strong>Seats:</strong> {bus.seats}</p>
            <p><strong>Status:</strong> {bus.status}</p>
          </div>
          <div>
            <h2 className="busdetails-section">Additional Details</h2>
            <p><strong>Departure Time:</strong> {bus.departureTime || 'N/A'}</p>
            <p><strong>Arrival Time:</strong> {bus.arrivalTime || 'N/A'}</p>
            <p><strong>Price:</strong> ${bus.price || 'N/A'}</p>
          </div>
        </div>
        <div className="busdetails-footer">
          <button
            onClick={() => window.history.back()}
            className="busdetails-back-btn"
          >
            Back to Manage Buses
          </button>
        </div>
      </div>
    </div>
  );
}
