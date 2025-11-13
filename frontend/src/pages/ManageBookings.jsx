import React, { useEffect, useState } from "react";
import API from "../api";
import "./ManageBookings.css"; 

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const { data } = await API.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handlePaymentVerification = async (id, status) => {
    try {
      await API.patch(`/bookings/${id}/verify`, { paymentStatus: status });
      loadBookings();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.patch(`/bookings/${id}/cancel`);
      loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await API.delete(`/bookings/${id}`);
        loadBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  return (
    <div className="manage-bookings-container">
      <h2>Manage Bookings</h2>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Bus</th>
            <th>Seats</th>
            <th>Amount</th>
            <th>UTR Number</th>
            <th>Payment Status</th>
            <th>Screenshot</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.userId?.name || booking.userId?.email}</td>
              <td>{booking.busId?.busNumber}</td>
              <td>{booking.seatNumbers?.join(", ")}</td>
              <td>₹{booking.totalAmount}</td>
              <td>{booking.utrNumber || 'N/A'}</td>
              <td>
                <span className={`status ${booking.paymentStatus}`}>
                  {booking.paymentStatus}
                </span>
              </td>
              <td>
                {booking.transactionScreenshot && (
                  <a 
                    href={`http://localhost:5001/uploads/transactions/${booking.transactionScreenshot}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                )}
              </td>
              <td>
                {booking.paymentStatus === 'pending' && (
                  <>
                    <button
                      className="verify-btn"
                      onClick={() => handlePaymentVerification(booking._id, 'verified')}
                    >
                      Verify
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handlePaymentVerification(booking._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(booking._id)}
                >
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