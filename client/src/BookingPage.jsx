import BookingForm from './BookingForm';

function BookingPage() {
  return (
    <div className="app">
      <header className="site-header">
        <h1>Feel Good Barber Shop</h1>
        <p className="tagline">Walk-ins welcome. Bookings preferred.</p>
      </header>
      <BookingForm />
    </div>
  );
}

export default BookingPage;