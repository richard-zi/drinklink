// barUtils.js

import { sendPutRequest } from "./apiUtils";
import { sendPostRequest } from "./apiUtils";
import { sendGetRequest } from "./apiUtils";
import { sendDeleteRequest } from "./apiUtils";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

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

export const getBar = async (barId) => {
  try {
    const response = await sendGetRequest(`${serverUrl}/api/bar/${barId}`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error fetching bar");
    }
  } catch (error) {
    console.error("Error fetching bar:", error);
  }
};