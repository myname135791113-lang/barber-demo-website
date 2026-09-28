import { useState } from 'react';
import { API_URL } from './config';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: { 'x-admin-password': password },
      });

      if (!response.ok) {
        setError('Incorrect password');
        return;
      }

      onLogin(password);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>Admin login</h2>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="submit-btn">Log in</button>
        {error && <p className="message">{error}</p>}
      </form>
    </div>
  );
}

export default AdminLogin;