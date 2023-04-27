// findbar.js
import { useState } from 'react';
import Layout from '../components/Layout';
import BarCard from '../components/BarCard';
import SearchBar from '../components/SearchBar';

export default function FindBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Layout>
      <SearchBar onSearch={handleSearch} ></SearchBar>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <BarCard searchTerm={searchTerm}></BarCard>
      </div>
    </Layout>
  );
}
