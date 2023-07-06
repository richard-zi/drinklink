import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "components/lib/userUtils";
import { logout } from "components/lib/authUtils";

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Holt den aktuellen Benutzer ab, wenn sich die Route ändert
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    fetchUser();
  }, [router.pathname]);

  async function handleLogout() {
    // Führt Logout-Aktionen durch und leitet zur Homepage weiter
    await logout();
    setUser(null);
    router.push("/");
  }

  function toggleDropdown() {
    // Schaltet das Dropdown-Menü für Benutzeraktionen ein
    setDropdownOpen(!dropdownOpen);
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
              <span className="cursor-pointer hover:text-blue-600">Home</span>
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
        </ul>

        <div className="relative flex items-center space-x-6 text-black">
          {user ? (
            <>
              <div
                className="flex items-center cursor-pointer username-container"
                onClick={toggleDropdown}
              >
                <span className="font-semibold">{user.username}</span>
                <svg
                  className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 7.293a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {dropdownOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-md px-1 py-0.5 dropdown-container min-w-max">
                  <ul className="py-1">
                    <li>
                      <Link href="/bookings">
                        <span className="block px-4 py-1 text-sm sm:text-base cursor-pointer hover:bg-blue-600 hover:text-white rounded-md">
                          Bookings
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/account">
                        <span className="block px-4 py-1 text-sm sm:text-base cursor-pointer hover:bg-blue-600 hover:text-white rounded-md">
                          Settings
                        </span>
                      </Link>
                    </li>
                    {user.isBarOwner && (
                      <li>
                        <Link href="/managebar">
                          <span className="block px-4 py-1 text-sm sm:text-base cursor-pointer hover:bg-blue-600 hover:text-white rounded-md">
                            Manage Bar
                          </span>
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        className="block w-full text-left px-4 py-1 text-sm sm:text-base cursor-pointer hover:bg-blue-600 hover:text-white rounded-md"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
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
