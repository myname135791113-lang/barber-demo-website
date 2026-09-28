import { useState, useEffect } from 'react';
import { API_URL } from './config';

function AdminPanel({ password, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: { 'x-admin-password': password },
      });

      if (!response.ok) {
        setError('Session expired. Please log in again.');
        return;
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });

      if (!response.ok) {
        setError('Failed to cancel booking.');
        return;
      }

      fetchBookings();
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>All bookings</h2>
        <button className="logout-btn" onClick={onLogout}>Log out</button>
      </div>

      {error && <p className="message">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Service</th>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.service}</td>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>
                  <button className="cancel-btn" onClick={() => handleCancel(b.id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;