import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import './BookBus.css';

export default function BookBus() {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [utrNumber, setUtrNumber] = useState('');
  const [transactionFile, setTransactionFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  const fetchBusDetails = async () => {
    try {
      const seatData = await API.get(`/bookings/seats/${busId}`);
      const busInfo = await API.get(`/buses/${busId}`);
      setBus({ ...busInfo.data, ...seatData.data });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = () => {
    const seats = [];
    for (let i = 1; i <= bus.capacity; i++) {
      seats.push(`S${i}`);
    }
    return seats;
  };

  const handleSeatClick = (seatNumber) => {
    if (bus.bookedSeats && bus.bookedSeats.includes(seatNumber)) {
      return;
    }
    
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
  if (selectedSeats.length === 0) {
    alert('Please select at least one seat');
    return;
  }
  
  if (!transactionFile) {
    alert('Please upload transaction screenshot');
    return;
  }

  const formData = new FormData();
  formData.append('busId', busId);
  formData.append('seatNumbers', JSON.stringify(selectedSeats));
  formData.append('totalAmount', selectedSeats.length * bus.fare);
  formData.append('utrNumber', utrNumber);  // 🔥 FIXED (MUST SEND)
  formData.append('transactionScreenshot', transactionFile);

  try {
    await API.post('/bookings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    alert('Booking submitted! Payment verification pending.');
    navigate('/user/bookings');

  } catch (error) {
    alert('Booking failed: ' + (error.response?.data?.message || "Server Error"));
  }
};


  if (loading) return <div>Loading...</div>;

  if (loading) return <div>Loading...</div>;
  if (!bus) return <div>Bus not found</div>;

  const totalAmount = selectedSeats.length * bus.fare;

  return (
    <div className="book-bus-container">
      <h2>Book Bus - {bus.busNumber}</h2>
      
      <div className="booking-content">
        <div className="seat-selection">
          <h3>Select Seats</h3>
          <div className="seat-map">
            {generateSeats().map(seatNumber => (
              <button
                key={seatNumber}
                className={`seat ${
                  bus.bookedSeats?.includes(seatNumber) ? 'booked' :
                  selectedSeats.includes(seatNumber) ? 'selected' : 'available'
                }`}
                onClick={() => handleSeatClick(seatNumber)}
                disabled={bus.bookedSeats?.includes(seatNumber)}
              >
                {seatNumber}
              </button>
            ))}
          </div>
          
          <div className="seat-legend">
            <span className="legend-item">
              <div className="seat available"></div> Available
            </span>
            <span className="legend-item">
              <div className="seat selected"></div> Selected
            </span>
            <span className="legend-item">
              <div className="seat booked"></div> Booked
            </span>
          </div>
        </div>

        <div className="payment-section">
          <h3>Payment Details</h3>
          <div className="payment-info">
            <p><strong>Selected Seats ({selectedSeats.length}):</strong></p>
            {selectedSeats.length > 0 ? (
              <div className="seat-tags">
                {selectedSeats.map(seat => (
                  <span key={seat} className="seat-tag">{seat}</span>
                ))}
              </div>
            ) : (
              <p style={{color: '#ccc', fontStyle: 'italic'}}>No seats selected</p>
            )}
            <p>Fare per seat: ₹{bus.fare}</p>
            <p><strong>Total Amount: ₹{totalAmount}</strong></p>
          </div>

          <div className="qr-code">
            <h4>Scan QR Code to Pay</h4>
            <div className="qr-placeholder">
              <p>QR Code for Payment</p>
              <p>UPI ID: busbooking@paytm</p>
            </div>
          </div>

          <div className="upload-section">
  <label>UTR Number:</label>
  <input 
    type="text"
    value={utrNumber}
    onChange={(e) => setUtrNumber(e.target.value)}
    placeholder="Enter UTR Number"
    required
  />
</div>

<div className="upload-section">
  <label htmlFor="transaction">Upload Transaction Screenshot:</label>
  <input
    type="file"
    id="transaction"
    accept="image/*"
    onChange={(e) => setTransactionFile(e.target.files[0])}
    required
  />
</div>


          <button 
            className="confirm-booking-btn"
            onClick={handleBooking}
            disabled={selectedSeats.length === 0 || !transactionFile}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}