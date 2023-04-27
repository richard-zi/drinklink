import { useState } from "react";
import { useRouter } from "next/router";
import { sendPostRequest } from "../lib/api-utils";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

async function login(username, password) {
  const response = await sendPostRequest(`${serverUrl}/login`, {
    username,
    password,
  });
  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    alert(`Erfolgreiche Anmeldung! Willkommen ${data.user.username}`);
    return true;
  } else {
    const error = await response.json();
    console.error(error);
    alert("Fehler bei der Anmeldung: " + error.error);
    return false;
  }
}

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await login(username, password)) {
      router.push("/");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 md:w-full shadow-md">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Log in to DrinkLink</h1>
                        <p className="text-center text-gray-600 text-sm mb-8">Welcome to DrinkLink. Please log in with your account or create a new one.</p>
                        <form className="mb-8" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="login-username"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    id="login-password"
                                    className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-6 focus:outline-none shadow-sm">
                                Log in
                            </button>
                        </form>
                        <p className="text-center text-gray-600 text-sm mb-4">
                            Don't have an account? <a href="/signup" className="text-blue-500 font-bold">Sign up</a>
                        </p>
                        <div className="flex items-center">
                            <hr className="border-gray-300 flex-grow" />
                            <p className="text-center mx-4 text-gray-400">OR</p>
                            <hr className="border-gray-300 flex-grow" />
                        </div>
                        <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg w-full mt-4 focus:outline-none shadow-sm">
                            <img src="https://img.icons8.com/color/16/000000/facebook-new.png" className="inline-block" alt="Facebook logo" />
                            Log in with Facebook
                        </button>
                    </div>
                );
            }

            export default LoginForm;