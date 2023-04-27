// managebar.js

import { useState } from "react";
import { sendPostRequest, sendPutRequest, sendGetRequest, sendDeleteRequest } from "../lib/api-utils";
import Layout from '../components/Layout';
import Head from 'next/head';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function ManageBar() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [createdBar, setCreatedBar] = useState(null);

  const createBar = async () => {
    if (createdBar) {
      alert("Du kannst nur eine Bar erstellen.");
      return;
    }
  
    try {
      const response = await sendPostRequest(`${serverUrl}/bar`, { name, address, description });
      if (response.ok) {
        const barData = await response.json();
        setCreatedBar(barData);
      } else {
        console.error("Error creating bar");
      }
    } catch (error) {
      console.error("Error creating bar:", error);
    }
  }; 

  const updateBar = async () => {
    if (createdBar) {
      try {
        const response = await sendPutRequest(`${serverUrl}/bar/${createdBar.id}`, { name, address, description });
        if (response.ok) {
          const updatedBar = await response.json();
          setCreatedBar(updatedBar);
        } else {
          console.error("Error updating bar");
        }
      } catch (error) {
        console.error("Error updating bar:", error);
      }
    } else {
      console.log("No bar to update");
    }
  };

  const deleteBar = async () => {
    if (createdBar) {
      try {
        const response = await sendDeleteRequest(`${serverUrl}/bar/${createdBar.id}`);
        if (response.ok) {
          setCreatedBar(null);
        } else {
          console.error("Error deleting bar");
        }
      } catch (error) {
        console.error("Error deleting bar:", error);
      }
    } else {
      console.log("No bar to delete");
    }
  };

  const getBar = async () => {
    try {
      const response = await sendGetRequest(`${serverUrl}/bar`);
      if (response.ok) {
        const barData = await response.json();
        setCreatedBar(barData);
      } else {
        console.error("Error fetching bar");
      }
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
      <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 md:w-full shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Manage Bar</h1>
      <p className="text-center text-gray-600 text-sm mb-8">Manage your Bar</p>
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
        <div>
        <button onClick={createBar} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm">Bar erstellen</button>
        <button onClick={updateBar} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm">Bar aktualisieren</button>
        <button onClick={deleteBar} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm">Bar löschen</button>
      </div>
      </div>
      <button onClick={getBar} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm">Bar anzeigen</button>
      {createdBar && (
        <div>
         <h3>Bar-Details</h3>
      <p>Name: {createdBar.name}</p>
      <p>Adresse: {createdBar.address}</p>
      <p>Beschreibung: {createdBar.description}</p>
    </div>
  )}
  </div>
  </div>
</Layout>
</>
);
}

export default ManageBar;