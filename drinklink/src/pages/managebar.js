// managebar.js
import { useState, useEffect } from "react";
import { sendPostRequest, sendPutRequest, sendGetRequest, sendDeleteRequest } from "../lib/api-utils";
import Layout from '../components/Layout';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function ManageBar() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [createdBar, setCreatedBar] = useState(null);

  const createBar = async () => {
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
    <Layout>
      <h1>Manage Bar</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <button onClick={createBar}>Bar erstellen</button>
        <button onClick={updateBar}>Bar aktualisieren</button>
        <button onClick={deleteBar}>Bar löschen</button>
      </div>
      <button onClick={getBar}>Bar anzeigen</button>
      {createdBar && (
        <div>
         <h3>Bar-Details</h3>
      <p>Name: {createdBar.name}</p>
      <p>Adresse: {createdBar.address}</p>
      <p>Beschreibung: {createdBar.description}</p>
    </div>
  )}
</Layout>
);
}

export default ManageBar;