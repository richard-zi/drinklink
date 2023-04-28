import Link from 'next/link';
import { useState, useEffect } from 'react';
import { sendGetRequest } from '../lib/api-utils';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function BarCard() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchBars() {
      try {
        const response = await sendGetRequest(`${serverUrl}/bars`);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json();
        setBars(data);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    }
  
    fetchBars();
  }, []);
  
  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  useEffect(() => {
    const handleSearchTermChange = (event) => {
      setSearchTerm(event.detail);
    };

    window.addEventListener('searchTermChange', handleSearchTermChange);

    return () => {
      window.removeEventListener('searchTermChange', handleSearchTermChange);
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
