// BookingList.js

import { useEffect, useState } from "react";
import { getCurrentUser } from "components/lib/userUtils";
import { getUserBookings } from "components/lib/bookingUtils";
import { cancelBooking } from "components/lib/bookingUtils";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userBookings = await getUserBookings(currentUser.id);
        setBookings(userBookings);
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  async function handleCancelBooking(bookingId) {
    const response = await cancelBooking(bookingId);

    if (response && response.ok) {
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } else {
      alert("Fehler beim Stornieren der Buchung");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!bookings || bookings.length === 0) {
    return <div>Keine Buchungen gefunden</div>;
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Ihre Buchungen</h2>
      <ul className="mt-4">
        {bookings.map((booking) => (
          <li key={booking.id} className="border-b border-gray-200 py-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{booking.bar.name}</h3>
                <p>
                  Datum: {formatDate(booking.dateTime)} | Personen:{" "}
                  {booking.people}
                </p>
              </div>
              <button
                onClick={() => handleCancelBooking(booking.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              >
                Stornieren
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingList;
