// booking.js

import { sendPostRequest } from "./utils.js";

const serverUrl = "http://localhost:3000";

async function createBooking(date, time, people) {
  const bookingDateTime = new Date(`${date}T${time}`);
  if (isNaN(bookingDateTime)) {
    alert("Ungültiges Datum oder Uhrzeit. Bitte überprüfen Sie Ihre Eingabe.");
    return;
  }

  const response = await sendPostRequest(`${serverUrl}/booking`, {
    date: bookingDateTime.toISOString(),
    people: parseInt(people, 10),
  });

  if (response.status === 201) {
    const data = await response.json();
    console.log(data);
    alert("Buchung erfolgreich erstellt!");
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Buchung: " + error.error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("booking-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const date = document.getElementById("booking-date").value;
      const time = document.getElementById("booking-time").value;
      const people = document.getElementById("booking-people").value;
      await createBooking(date, time, people);
    });
});
