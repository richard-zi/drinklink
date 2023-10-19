import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { sendGetRequest } from "components/lib/apiUtils";
import BookingForm from "../../components/BookingForm";
import Head from "next/head";
import { getCurrentUser } from "../../lib/userUtils";
import LoginForm from "components/components/LoginForm";

// Definieren Sie die Server-URL
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Definieren Sie die Komponente Bar Details
export default function BarDetails() {
  // Abrufen der Router-Instanz
  const router = useRouter();
  // Abrufen der "id" aus der Router-Abfrage
  const { id } = router.query;
  // Zustandsvariablen definieren
  const [bar, setBar] = useState(null);
  const [user, setUser] = useState(null);

  // Abrufen von Bar Details, wenn sich 'id' ändert
  useEffect(() => {
    async function fetchBarDetails() {
      if (!id) return; // Wenn "id" nicht verfügbar ist, wird zurückgegeben
      try {
        // Senden Sie eine GET-Anfrage, um die Details der Bar abzurufen.
        const response = await sendGetRequest(`${serverUrl}/bar/${id}`);
        if (response.status === 200) {
          const barData = await response.json();
          setBar(barData); // Setzen Sie die abgerufenen Bar Details auf den Zustand
        } else {
          alert("Fehler beim Abrufen der Bar-Details");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchBarDetails();
  }, [id]);

  // Abrufen der aktuellen Benutzerdetails beim Einhängen der Komponente
  useEffect(() => {
    async function fetchCurrentUser() { 
      const currentUser = await getCurrentUser(); // Abrufen des aktuellen Benutzers
      setUser(currentUser); // Den aktuellen Benutzer auf den Zustand setzen
    }

    fetchCurrentUser();
  }, []);

  // Rendering des Ladezustands, wenn noch keine Bar Details verfügbar sind
  if (!bar) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>{bar.name}</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
          <div className="bg-white rounded-md p-6 shadow-md md:w-2/3 md:mr-4">
            <h1 className="text-3xl font-bold text-gray-800">{bar.name}</h1>
            <p className="text-gray-600">{bar.address}</p>
            <p className="mt-4">{bar.description}</p>
            <p className="mt-6">
              <span className="font-bold">Besitzer:</span>{" "}
              {bar.owner ? bar.owner.username : "Nicht verfügbar"}
            </p>
          </div>
          <div className="bg-white rounded-md p-6 shadow-md md:w-1/3 flex justify-center items-center">
              {user ? (
                <>
                  <BookingForm />
                </>
              ) : (
                <LoginForm></LoginForm>
              )}
          </div>
        </div>
      </Layout>
    </>
  );
}
