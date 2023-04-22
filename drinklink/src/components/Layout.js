import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto mt-4 flex-grow bg-white p-4">
        {children}
      </main>
      <footer className="bg-white text-black py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} DrinkLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
