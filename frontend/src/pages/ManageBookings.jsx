import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBookings.css"; 

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`/api/bookings/${id}`);
      loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="manage-bookings-container">
      <h2>Manage Bookings</h2>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Bus</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking._id}</td>
              <td>{booking.userName}</td>
              <td>{booking.busName}</td>
              <td>{booking.seatNumbers && booking.seatNumbers.join(", ")}</td>
              <td>{booking.status}</td>
              <td>{booking.date}</td>
              <td>
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
