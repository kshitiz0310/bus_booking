import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./SearchResults.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const ac = searchParams.get("ac");
  const nonAc = searchParams.get("nonAc");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (date) params.append("date", date);
        if (ac) params.append("ac", ac);
        if (nonAc) params.append("nonAc", nonAc);

        const { data } = await API.get(`/buses?${params.toString()}`);
        setBuses(data);
      } catch (error) {
        console.error("Error fetching buses:", error);
        setError("Failed to load buses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [from, to, date, ac, nonAc]);

  const handleBookBus = (busId) => {
    navigate(`/book/${busId}`);
  };

  if (loading) return <div className="search-results-container"><p>Loading buses...</p></div>;
  if (error) return <div className="search-results-container"><p className="error">{error}</p></div>;

  return (
    <div className="search-results-container">
      <h2>Search Results</h2>
      <p>From: {from} | To: {to} | Date: {date || "Any"}</p>

      {buses.length === 0 ? (
        <p>No buses found for your search criteria.</p>
      ) : (
        <div className="buses-list">
          {buses.map((bus) => (
            <div key={bus._id} className="bus-card">
              <div className="bus-info">
                <h3>{bus.busNumber}</h3>
                <p><strong>Route:</strong> {bus.startPoint} → {bus.destination}</p>
                <p><strong>Date:</strong> {bus.date}</p>
                <p><strong>Time:</strong> {bus.departureTime} - {bus.arrivalTime}</p>
                <p><strong>Type:</strong> {bus.ac ? "AC" : "Non-AC"}</p>
                <p><strong>Capacity:</strong> {bus.capacity}</p>
                <p><strong>Available Seats:</strong> {bus.seatsAvailable}</p>
                <p><strong>Fare:</strong> ₹{bus.fare}</p>
                <p><strong>Driver:</strong> {bus.driverName} ({bus.driverPhone})</p>
                {bus.notes && <p><strong>Notes:</strong> {bus.notes}</p>}
              </div>
              <button
                className="book-btn"
                onClick={() => handleBookBus(bus._id)}
                disabled={bus.seatsAvailable <= 0}
              >
                {bus.seatsAvailable > 0 ? "Book Now" : "No Seats"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
