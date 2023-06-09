// barUtils.js

import { sendPutRequest } from "./apiUtils";
import { sendPostRequest } from "./apiUtils";
import { sendGetRequest } from "./apiUtils";
import { sendDeleteRequest } from "./apiUtils";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Funktion zum Erstellen einer Bar
export const createBar = async (name, address, description, capacity, openingTime, closingTime) => {
  try {
    const response = await sendPostRequest(`${serverUrl}/bar`, { name, address, description, capacity, openingTime, closingTime });
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error creating bar");
    }
  } catch (error) {
    console.error("Error creating bar:", error);
  }
};

// Funktion zum Aktualisieren einer Bar
export const updateBar = async (barId, name, address, description, capacity, openingTime, closingTime) => {
  try {
    const response = await sendPutRequest(`${serverUrl}/bar/${barId}`, { name, address, description, capacity, openingTime, closingTime });
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error updating bar");
    }
  } catch (error) {
    console.error("Error updating bar:", error);
  }
};

// Funktion zum Löschen einer Bar
export const deleteBar = async (barId) => {
  try {
    const response = await sendDeleteRequest(`${serverUrl}/bar/${barId}`);
    if (response.ok) {
      return true;
    } else {
      console.error("Error deleting bar");
    }
  } catch (error) {
    console.error("Error deleting bar:", error);
  }
};

// Funktion zum Abrufen einer Bar
export const getBar = async () => {
  try {
    const response = await sendGetRequest(`${serverUrl}/bar`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error fetching bar");
    }
  } catch (error) {
    console.error("Error fetching bar:", error);
  }
};
