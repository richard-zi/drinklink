import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { sendGetRequest } from "components/lib/apiUtils";
import BookingForm from "../../components/BookingForm";
import Head from "next/head";
import { getCurrentUser } from "../../lib/userUtils";
import LoginForm from "components/components/LoginForm";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function BarDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [bar, setBar] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchBarDetails() {
      if (!id) return;
      try {
        const response = await sendGetRequest(`${serverUrl}/bar/${id}`);
        if (response.status === 200) {
          const barData = await response.json();
          setBar(barData);
        } else {
          alert("Fehler beim Abrufen der Bar-Details");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchBarDetails();
  }, [id]);

  useEffect(() => {
    async function fetchCurrentUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }

    fetchCurrentUser();
  }, []);

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
