// Importiere Navbar-Komponente
import Navbar from "./Navbar";

// Definiere die Layout-Komponente, die eine Navbar, einen Hauptbereich und einen Footer enthält
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto mt-4 flex-grow bg-white p-4">
        {children}
      </main>
      <footer className="bg-white text-black py-4">
        <div className="container mx-auto text-center">
          © {new Date().getFullYear()} DrinkLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Exportiere die Layout-Komponente
export default Layout;
