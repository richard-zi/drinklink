import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { sendGetRequest } from "../../lib/api-utils";
import BookingForm from "../../components/BookingForm";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function BarDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [bar, setBar] = useState(null);

  useEffect(() => {
    async function fetchBarDetails() {
      if (!id) return;
      try {
        const response = await sendGetRequest(`${serverUrl}/api/bar/${id}`);
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

  if (!bar) {
    return <div>Loading...</div>;
  }

  return (
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
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Buchungsformular</h2>
            <BookingForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
