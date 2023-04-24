// src/components/Navbar.js

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { sendPostRequest } from "../lib/api-utils";
import { getCurrentUser } from "../lib/getCurrentUser";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    fetchUser();
  }, [router.pathname]);

  async function handleLogout() {
    await sendPostRequest(`${serverUrl}/logout`);
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="bg-white p-4 shadow-md sticky top-0">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link href="/">
            <span className="font-bold cursor-pointer">DrinkLink</span>
          </Link>
        </div>
        <ul className="hidden md:flex space-x-6 text-black">
          <li>
            <Link href="/">
              <span className="cursor-pointer hover:border-b-2 border-black">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/findbar">
              <span className="cursor-pointer hover:border-b-2 border-black">
                Find Bar
              </span>
            </Link>
          </li>
          <li>
            <Link href="/becomepartner">
              <span className="cursor-pointer hover:border-b-2 border-black">
                Become Partner
              </span>
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/account">
                <span className="cursor-pointer hover:border-b-2 border-black">
                  Settings
                </span>
              </Link>
            </li>
          )}
        </ul>

        <div className="flex space-x-6 text-black">
          {user ? (
            <>
              <span className="font-semibold">{user.username}</span>
              <button
                className="border-0 bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup">
                <span className="border-0 bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
                  SignUp
                </span>
              </Link>
              <Link href="/login">
                <span className="border-0 bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
                  Login
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
