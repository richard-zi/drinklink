import Link from 'next/link';
import { useState, useEffect } from 'react';
import { sendGetRequest } from '../lib/apiUtils';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function BarCard() {
  const [bars, setBars] = useState([]); // Zustand für Bars initialisieren
  const [searchTerm, setSearchTerm] = useState(''); // Zustand für Suchbegriff initialisieren

  useEffect(() => {
    async function fetchBars() {
      try {
        const response = await sendGetRequest(`${serverUrl}/bars`); // GET-Anfrage an den Server senden
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json(); // Antwortdaten in JSON-Format umwandeln
        setBars(data); // Bars-Zustand aktualisieren mit den erhaltenen Daten
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    }
  
    fetchBars(); // Funktion zum Abrufen der Bars aufrufen
  }, []);
  
  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  ); // Bars filtern basierend auf dem Suchbegriff

  useEffect(() => {
    const handleSearchTermChange = (event) => {
      setSearchTerm(event.detail); // Suchbegriff aktualisieren, wenn das Ereignis 'searchTermChange' auftritt
    };

    window.addEventListener('searchTermChange', handleSearchTermChange); // Event-Listener hinzufügen

    return () => {
      window.removeEventListener('searchTermChange', handleSearchTermChange); // Event-Listener entfernen, um Speicherlecks zu vermeiden
    };
  }, []);

  return (
    <>
      {filteredBars.map((bar) => (
        <Link key={bar.id} href={`/bar/${bar.id}`}>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{bar.name}</h2>
            <p className="text-gray-600">{bar.address}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
