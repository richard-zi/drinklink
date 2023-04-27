import Link from 'next/link';
import { useState, useEffect } from 'react';
import { sendGetRequest } from '../lib/api-utils';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function BarCard({ searchTerm }) {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    async function fetchBars() {
      const response = await sendGetRequest(`${serverUrl}/bars`);
      const data = await response.json();
      setBars(data);
    }

    fetchBars();
  }, []);

  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

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
