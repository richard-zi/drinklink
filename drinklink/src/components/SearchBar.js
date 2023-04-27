import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearch = (e) => {
      e.preventDefault();
      onSearch(searchTerm);
    };
    
  return (
      <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bar finden</h1>
                            </div>
                        </div>
                        <div className="-mr-2 flex items-center md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="hidden md:flex md:items-center">
                            <form className="flex flex-row gap-2">
                                <label htmlFor="date" className="sr-only">
                                    Datum:
                                </label>
                                <input type="date" id="date" name="date" className="w-32 py-2 px-4 border border-gray-400 rounded-md" />

                                <label htmlFor="time" className="sr-only">
                                    Uhrzeit:
                                </label>
                                <input type="time" id="time" name="time" className="w-24 py-2 px-4 border border-gray-400 rounded-md" />

                                <label htmlFor="people" className="sr-only">
                                    Anzahl der Personen:
                                </label>
                                <input
                                    type="number"
                                    id="people"
                                    name="people"
                                    min="1"
                                    className="w-24 py-2 px-4 border border-gray-400 rounded-md"
                                />

                                <label htmlFor="restaurant" className="sr-only">
                                    Ort/Restaurantname:
                                </label>
                                <input
                                    type="text"
                                    id="restaurant"
                                    name="restaurant"
                                    placeholder="Ort/Restaurantname"
                                    className="w-48 py-2 px-4 border border-gray-400 rounded-md"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <button
                                    onClick={handleSearch}
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Suchen
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <form className="flex flex-col gap-2">
                            <label htmlFor="date" className="sr-only">
                                Datum:
                            </label>
                            <input type="date" id="date" name="date" className="w-full py-2 px-4 border border-gray-400 rounded-md" />

                            <label htmlFor="time" className="sr-only">
                                Uhrzeit:
                            </label>
                            <input type="time" id="time" name="time" className="w-full py-2 px-4 border border-gray-400 rounded-md" />

                            <label htmlFor="people" className="sr-only">
                                Anzahl der Personen:
                            </label>
                            <input
                                type="number"
                                id="people"
                                name="people"
                                min="1"
                                className="w-full py-2 px-4 border border-gray-400 rounded-md"
                            />

                            <label htmlFor="restaurant" className="sr-only">
                                Ort/Restaurantname:
                            </label>
                            <input
                                type="text"
                                id="restaurant"
                                name="restaurant"
                                placeholder="Ort/Restaurantname"
                                className="w-full py-2 px-4 border border-gray-400 rounded-md"
                            />

                            <button
                                type="submit"
                                className="w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Suchen
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
  );
}
