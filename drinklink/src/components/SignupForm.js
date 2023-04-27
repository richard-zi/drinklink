// signup.js

import { useState } from "react";
import { sendPostRequest } from "../lib/api-utils";
import { useRouter } from "next/router"; // Importiere useRouter von 'next/router'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

async function register(username, password) {
  const response = await sendPostRequest(`${serverUrl}/signup`, {
    username,
    password,
  });
  if (response.status === 201) {
    const data = await response.json();
    console.log(data);
    alert("Erfolgreiche Registrierung!");
    return true;
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Registrierung: " + error.error);
    return false;
  }
}

function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Füge die useRouter Hook hinzu

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, password); // Speichere das Ergebnis der Registrierung in einer Variable

    if (success) {
      router.push("/login"); // Leite den Benutzer zur /login-Route weiter, wenn die Registrierung erfolgreich war
    }
  };

  return (
    <div className="flex justify-center items-center max-w-md">
      <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 md:w-full shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Please fill in the following fields to create an account.
        </p>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <input
              type="text"
              id="register-username"
              className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              placeholder="Email address"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="register-password"
              className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mb-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 font-bold">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
