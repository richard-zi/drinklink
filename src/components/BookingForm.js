// Importiert die benötigten Hooks und Funktionen von verschiedenen Modulen
import { useState, useEffect } from "react";
import { sendPostRequest } from "../lib/apiUtils";
import { useRouter } from "next/router";
import StepIndicator from "./StepIndicator";
import ReactDatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { getBar } from "../lib/barUtils";

// Registriert das deutsche Locale für den Datepicker
registerLocale("de", de);

// Definiert die Server-URL aus der Umgebungsvariablen
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Hauptkomponente für das Buchungsformular
function BookingForm() {
  // Verwendet den useRouter-Hook, um auf den Router zuzugreifen und die ID der Bar aus der URL abzurufen
  const router = useRouter();
  const { id } = router.query;

  // Verwaltet den Zustand der Buchungsdaten
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    people: "",
    barId: "",
  });

  // Verwaltet den Zustand des aktuellen Schritts im Formular
  const [currentStep, setCurrentStep] = useState(1);

  // Verwaltet den Zustand der Bar-Informationen
  const [bar, setBar] = useState(null);

  // Verwendet den useEffect-Hook, um die Bar-Informationen abzurufen, wenn die ID vorhanden ist
  useEffect(() => {
    if (id) {
      setBookingData((prevData) => ({ ...prevData, barId: id }));
      fetchBarData();
    }
  }, [id]);

  // Asynchrone Funktion zum Abrufen der Bar-Informationen
  const fetchBarData = async () => {
    const barData = await getBar(id);
    setBar(barData);
  };

  // Asynchrone Funktion, die aufgerufen wird, wenn das Formular abgeschickt wird
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Erstelle ein neues Date-Objekt, wobei die Zeitzone auf 'UTC' gesetzt ist
    const dateTime = new Date(`${bookingData.date}T${bookingData.time}:00Z`);

    // Erstellt das Payload-Objekt für die POST-Anfrage
    const payload = {
      ...bookingData,
      dateTime: dateTime.toISOString(),
    };

    // Sendet die POST-Anfrage an den Server und verarbeitet die Antwort
    const response = await sendPostRequest(`${serverUrl}/booking`, payload);

    // Überprüft den Status der Antwort und verarbeitet entsprechend
    if (response.status === 201) {
      alert("Buchung erfolgreich!");
      router.push("/");
    } else {
      const errorData = await response.json();
      const errorMessage =
        errorData.error ||
        "Buchung fehlgeschlagen, bitte versuchen Sie es erneut.";
      alert(errorMessage);
    }
  };

  // Funktion zum Verarbeiten von Änderungen in Formularfeldern
  const handleChange = (name, value) => {
    if (
      name === "time" &&
      parseInt(value.slice(0, 2)) < parseInt(bar.openingTime.slice(0, 2))
    ) {
      const currentDate = new Date(bookingData.date);
      const nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1));
      const nextDayISOString = nextDay.toISOString().slice(0, 10);
      // Aktualisiert den Zustand der Buchungsdaten basierend auf den eingegebenen Werten
      setBookingData((prevData) => ({
        ...prevData,
        date: nextDayISOString,
        [name]: value,
      }));
    } else {
      setBookingData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Funktion zum Fortfahren zum nächsten Schritt im Formular
  const handleNextStep = () => {
    if (currentStep === 1 && bookingData.date) {
      setCurrentStep(2);
    } else if (currentStep === 2 && bookingData.time) {
      setCurrentStep(3);
    }
  };

  // Funktion zum Zurückkehren zum vorherigen Schritt im Formular
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Funktion zum Generieren von Zeitfenstern basierend auf Öffnungs- und Schließzeiten
  const generateTimeSlots = (openingTime, closingTime) => {
    const timeSlots = [];
    let start = openingTime;
    let end = closingTime;

    // Wenn die Schließzeit kleiner oder gleich der Öffnungszeit ist, wird die Schließzeit auf Mitternacht gesetzt
    if (closingTime <= openingTime) {
      end = "24:00";
    }

    // Generiert Zeitfenster in 30-Minuten-Intervallen zwischen Öffnungs- und Schließzeiten
    while (start < end) {
      timeSlots.push(start);
      const [hour, minute] = start.split(":");
      let nextHour = parseInt(hour);
      let nextMinute = parseInt(minute) + 30;

      // Passt Stunden und Minuten für das nächste Zeitfenster an
      if (nextMinute >= 60) {
        nextMinute = 0;
        nextHour += 1;
      }

      // Setzt die Startzeit auf Mitternacht und das Ende auf die Schließzeit, wenn die Schließzeit kleiner oder gleich der Öffnungszeit ist
      if (nextHour === 24 && closingTime <= openingTime) {
        start = "00:00";
        end = closingTime;
      } else {
        start = `${nextHour.toString().padStart(2, "0")}:${nextMinute
          .toString()
          .padStart(2, "0")}`;
      }
    }

    return timeSlots;
  };

  const timeSlots = bar
    ? generateTimeSlots(bar.openingTime, bar.closingTime)
    : [];

  const CustomDateInput = ({ value, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px4 py-2 border border-gray-300 ${
        value ? "bg-blue-500 text-white" : "text-gray-700"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {value ? value : "Wählen Sie ein Datum"}
    </button>
  );

  return (
    <div className="w-full md:w-2/3">
    <div className="space-y-4">
      <StepIndicator currentStep={currentStep} />
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentStep === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Datum:
            </label>
            <ReactDatePicker
              selected={bookingData.date ? new Date(bookingData.date) : null}
              onChange={(date) =>
                handleChange("date", date.toISOString().slice(0, 10))
              }
              locale="de"
              dateFormat="dd.MM.yyyy"
              minDate={new Date()}
              customInput={<CustomDateInput />}
              inline
              className="react-datepicker-custom"
            />
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Zeit:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleChange("time", time)}
                  className={`w-full px-4 py-2 border border-gray-300 ${
                    bookingData.time === time
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Personen:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleChange("people", count)}
                  className={`w-full px-4 py-2 border border-gray-300 ${
                    bookingData.people === count
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}
        {currentStep < 3 && (
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Weiter
          </button>
        )}
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevStep}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Zurück
          </button>
        )}
        {currentStep === 3 && (
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Buchung erstellen
          </button>
        )}
      </form>
    </div>
    </div>
  );
}

export default BookingForm;
