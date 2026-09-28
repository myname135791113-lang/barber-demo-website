import { Routes, Route } from 'react-router-dom';
import BookingPage from './BookingPage';
import AdminPage from './AdminPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;