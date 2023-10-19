// bookingUtils.js
import { sendGetRequest } from "./apiUtils.js";
import { sendDeleteRequest } from "./apiUtils.js";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Abrufen der Buchungen eines Benutzers
export async function getUserBookings() {
  try {
    const response = await sendGetRequest(`${serverUrl}/user-bookings`);

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch user bookings");
      return [];
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerbuchungen", error);
    return [];
  }
}

// Stornieren einer Buchung
export async function cancelBooking(bookingId) {
    try {
      const response = await sendDeleteRequest(`${serverUrl}/booking/${bookingId}`);
      return response;
    } catch (error) {
      console.error("Error cancelling booking", error);
      return null;
    }
  }