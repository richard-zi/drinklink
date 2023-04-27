// src/components/Navbar.js

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { sendPostRequest } from "components/lib/api-utils";
import { getCurrentUser } from "components/lib/getCurrentUser";

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
    <nav className="bg-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link href="/">
            <span className="font-bold text-2xl text-blue-600 cursor-pointer">
              DrinkLink
            </span>
          </Link>
        </div>
        <ul className="hidden md:flex space-x-6 text-black">
          <li>
            <Link href="/">
              <span className="cursor-pointer hover:text-blue-600">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/findbar">
              <span className="cursor-pointer hover:text-blue-600">
                Find Bar
              </span>
            </Link>
          </li>
          <li>
            <Link href="/becomepartner">
              <span className="cursor-pointer hover:text-blue-600">
                Become Partner
              </span>
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/account">
                <span className="cursor-pointer hover:text-blue-600">
                  Settings
                </span>
              </Link>
            </li>
          )}
          {user && user.isBarOwner && (
            <li>
              <Link href="/managebar">
                <span className="cursor-pointer hover:text-blue-600">
                  Manage Bar
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
                className="border-0 bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup">
                <span className="border-0 bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded-md">
                  SignUp
                </span>
              </Link>
              <Link href="/login">
                <span className="border-0 bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded-md">
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
