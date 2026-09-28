import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import './AdminPanel.css';

function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('adminPassword') || '');

  const handleLogin = (pw) => {
    sessionStorage.setItem('adminPassword', pw);
    setPassword(pw);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    setPassword('');
  };

  return (
    <div className="app">
      <header className="site-header">
        <h1>Feel Good Barber Shop</h1>
        <p className="tagline">Admin</p>
      </header>
      {password ? (
        <AdminPanel password={password} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
}

export default AdminPage;