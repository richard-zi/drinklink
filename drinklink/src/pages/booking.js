// BookingPage.js

import Layout from '../components/Layout';
import { useState } from 'react';
import { sendPostRequest } from '../lib/api-utils';
import Head from 'next/head';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

async function createBooking(date, time, people) {
  const bookingDateTime = new Date(`${date}T${time}`);
  if (isNaN(bookingDateTime)) {
    alert('Ungültiges Datum oder Uhrzeit. Bitte überprüfen Sie Ihre Eingabe.');
    return;
  }

  const response = await sendPostRequest(`${serverUrl}/booking`, {
    date: bookingDateTime.toISOString(),
    people: parseInt(people, 10),
  });

  if (response.status === 201) {
    const data = await response.json();
    console.log(data);
    alert('Buchung erfolgreich erstellt!');
  } else {
    const error = await response.json();
    console.error(error);
    alert('Fehler bei der Buchung: ' + error.error);
  }
}

export default function BookingPage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBooking(date, time, people);
  };

  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Booking</title>
    </Head>
      <Layout>
      <h1>Buchung erstellen</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="booking-date">Datum:</label>
        <input
          type="date"
          id="booking-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <br />
        <label htmlFor="booking-time">Uhrzeit:</label>
        <input
          type="time"
          id="booking-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <br />
        <label htmlFor="booking-people">Personenanzahl:</label>
        <input
          type="number"
          id="booking-people"
          min="1"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          required
        />
        <br />
        <button type="submit">Buchung erstellen</button>
      </form>
      </Layout>
    </>
  );
}
