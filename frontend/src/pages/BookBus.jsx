import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./BookBus.css"; // Create this file for styles

export default function BookBus() {
  const { busId } = useParams();
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/buses").then((res) => {
      setBus(res.data.find((b) => b._id === busId));
    });
  }, [busId]);

  const toggleSeat = (seat) => {
    if (bus.bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    await API.post("/bookings", { busId, seatNumbers: selectedSeats });
    alert("Booking successful!");
    navigate("/my-bookings");
  };

  if (!bus) return <p>Loading...</p>;

  return (
    <div className="bookbus-container">
      <h2>Book Seats for {bus.busNumber}</h2>
      <div className="seats-grid">
        {Array.from({ length: bus.totalSeats }, (_, i) => {
          const seat = (i + 1).toString();
          const booked = bus.bookedSeats.includes(seat);
          const selected = selectedSeats.includes(seat);
          return (
            <div
              key={seat}
              className={`seat ${booked ? "booked" : ""} ${selected ? "selected" : ""}`}
              onClick={() => toggleSeat(seat)}
            >
              {seat}
            </div>
          );
        })}
      </div>
      <button className="confirm-btn" onClick={handleBooking} disabled={selectedSeats.length === 0}>
        Confirm Booking
      </button>
    </div>
  );
}
