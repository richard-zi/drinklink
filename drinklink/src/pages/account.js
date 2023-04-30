// account.js

import { useEffect, useState } from "react";
import { sendPutRequest } from "../lib/api-utils";
import Head from "next/head";
import Layout from '../components/Layout';
import { getCurrentUser } from "../lib/getCurrentUser";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

async function updateAccount(username, oldPassword, newPassword) {
  const response = await sendPutRequest(`${serverUrl}/user`, {
    username,
    oldPassword,
    newPassword,
  });

  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    alert("Benutzerdaten wurden erfolgreich aktualisiert!");
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Aktualisierung der Benutzerdaten: " + error.error);
  }
}

export default function AccountPage() {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isBarOwner, setIsBarOwner] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsBarOwner(user.isBarOwner);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleBarOwnerChange = async (e) => {
    const newIsBarOwner = e.target.checked;
    setIsBarOwner(newIsBarOwner);
    await updateBarOwnerStatus(newIsBarOwner);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateAccount(username, oldPassword, newPassword);
  };

async function updateBarOwnerStatus(isBarOwner) {
    const response = await sendPutRequest(`${serverUrl}/set-bar-owner-status`, {
      isBarOwner,
    });
  
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      alert("Bar-Besitzer-Status wurde erfolgreich aktualisiert!");
    } else {
      const error = await response.json();
      console.error(error);
      alert("Fehler beim Aktualisieren des Bar-Besitzer-Status: " + error.error);
    }
  }

  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Benutzerkonto</title>
    </Head>
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-center bg-white min-h-screen">
                <div className="w-full md:w-1/2 order-last md:order-first p-6 flex flex-col justify-center items-center">
                    <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 md:w-full">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Settings</h1>
                        <p className="text-center text-gray-600 text-sm mb-8">Change your email or password.</p>
                        <form onSubmit={handleSubmit} className="mb-8">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="username"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="New username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    id="old-password"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Old password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    id="new-password"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm">
                            Save
                          </button>
                          </form>
                          <div className="flex items-center justify-between">
                            <label htmlFor="bar-owner-switch" className="text-sm text-gray-800">
                              Bar-Besitzer
                            </label>
                            <div className="relative inline-block w-10 ml-2 align-middle select-none transition duration-200 ease-in">
                              <input
                                type="checkbox"
                                name="bar-owner-switch"
                                id="bar-owner-switch"
                                checked={isBarOwner}
                                onChange={handleBarOwnerChange}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              />
                              <label
                              htmlFor="bar-owner-switch"
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                      </div>
              </div>
      </div>
      </Layout>
    </>
  );
}