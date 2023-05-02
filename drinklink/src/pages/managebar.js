// managebar.js

import { useState } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import { createBar, updateBar, deleteBar, getBar } from "../lib/barUtils";

function ManageBar() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [createdBar, setCreatedBar] = useState(null);

  const handleCreateBar = async () => {
    if (createdBar) {
      alert("Du kannst nur eine Bar erstellen.");
      return;
    }

    try {
      const barData = await createBar(
        name,
        address,
        description,
        capacity,
        openingTime,
        closingTime
      );
      setCreatedBar(barData);
    } catch (error) {
      console.error("Error creating bar:", error);
    }
  };

  const handleUpdateBar = async () => {
    if (createdBar) {
      try {
        const updatedBar = await updateBar(
          createdBar.id,
          name,
          address,
          description,
          capacity,
          openingTime,
          closingTime
        );
        setCreatedBar(updatedBar);
      } catch (error) {
        console.error("Error updating bar:", error);
      }
    } else {
      console.log("No bar to update");
    }
  };

  const handleDeleteBar = async () => {
    if (createdBar) {
      try {
        await deleteBar(createdBar.id);
        setCreatedBar(null);
      } catch (error) {
        console.error("Error deleting bar:", error);
      }
    } else {
      console.log("No bar to delete");
    }
  };

  const handleGetBar = async () => {
    try {
      const barData = await getBar();
      setCreatedBar(barData);
    } catch (error) {
      console.error("Error fetching bar:", error);
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Manage Bar</title>
      </Head>
      <Layout>
        <div className="flex flex-col md:flex-row items-center justify-center bg-white min-h-screen">
          <div className="w-full md:w-1/2 order-last md:order-first p-6 flex flex-col justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 md:w-full">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                Manage Bar
              </h1>
              <p className="text-center text-gray-600 text-sm mb-8">
                Manage your Bar
              </p>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Adresse"
                  className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Beschreibung"
                  className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  placeholder="Maximale Personenanzahl"
                  className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="time"
                  placeholder="Öffnungszeit"
                  className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="time"
                  placeholder="Schließzeit"
                  className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                />
              </div>
              <div>
                <button
                  onClick={handleCreateBar}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm"
                >
                  Bar erstellen
                </button>
                <button
                  onClick={handleUpdateBar}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm"
                >
                  Bar aktualisieren
                </button>
                <button
                  onClick={handleDeleteBar}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm"
                >
                  Bar löschen
                </button>
              </div>
            </div>
            <button
              onClick={handleGetBar}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm"
            >
              Bar anzeigen
            </button>
            {createdBar && (
              <div>
                <h3>Bar-Details</h3>
                <p>Name: {createdBar.name}</p>
                <p>Adresse: {createdBar.address}</p>
                <p>Beschreibung: {createdBar.description}</p>
                <p>Maximale Personenanzahl: {createdBar.capacity}</p>
                <p>Öffnungszeit: {createdBar.openingTime}</p>
                <p>Schließzeit: {createdBar.closingTime}</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ManageBar;
