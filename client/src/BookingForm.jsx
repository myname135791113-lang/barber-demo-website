import { useState, useEffect } from 'react';
import { API_URL } from './config';
import './BookingForm.css';

const SERVICES = [
  { id: 'Haircut', label: 'Haircut', duration: '30 min', price: '€25' },
  { id: 'Beard Trim', label: 'Beard Trim', duration: '15 min', price: '€15' },
  { id: 'Haircut + Beard', label: 'Haircut + Beard', duration: '45 min', price: '€35' },
];

const MORNING_SLOTS = ['09:00', '10:00', '11:00', '12:00'];
const AFTERNOON_SLOTS = ['13:00', '14:00', '15:00', '16:00', '17:00'];

function BookingForm() {
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [takenSlots, setTakenSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async (selectedDate) => {
    if (!selectedDate) {
      setTakenSlots([]);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/availability?date=${selectedDate}`);
      const data = await response.json();
      setTakenSlots(data.taken || []);
    } catch (err) {
      console.error('Failed to load availability', err);
    }
  };

  useEffect(() => {
    fetchAvailability(date);
  }, [date]);

  const selectedService = SERVICES.find((s) => s.id === service);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, date, time, service }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Booking failed');
        setLoading(false);
        return;
      }

      setMessage(`Booked: ${data.service} on ${data.date} at ${data.time}.`);
      setName('');
      setEmail('');
      setTime('');
      fetchAvailability(date);
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSlotGroup = (label, slots) => (
    <div className="slot-group">
      <span className="slot-group-label">{label}</span>
      <div className="time-slots">
        {slots.map((slot) => {
          const isTaken = takenSlots.includes(slot);
          return (
            <button
              type="button"
              key={slot}
              disabled={isTaken}
              className={`slot ${time === slot ? 'selected' : ''} ${isTaken ? 'taken' : ''}`}
              onClick={() => setTime(slot)}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );

  const canSubmit = service && date && time && name && email && !loading;

  return (
    <form className="booking-layout" onSubmit={handleSubmit}>
      <div className="booking-main">
        <section className="step">
          <h2>Choose a service</h2>
          <div className="service-cards">
            {SERVICES.map((s) => (
              <button
                type="button"
                key={s.id}
                className={`service-card ${service === s.id ? 'selected' : ''}`}
                onClick={() => setService(s.id)}
              >
                <span className="service-name">{s.label}</span>
                <span className="service-meta">{s.duration} · {s.price}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="step">
          <h2>Choose a date</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setTime(''); }}
            required
          />
        </section>

        {date && (
          <section className="step">
            <h2>Choose a time</h2>
            {renderSlotGroup('Morning', MORNING_SLOTS)}