import { useState, useEffect } from "react";
import { sendPostRequest } from "../lib/apiUtils";
import { useRouter } from "next/router";
import StepIndicator from "./StepIndicator";
import ReactDatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";

registerLocale("de", de);

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function BookingForm() {
  const router = useRouter();
  const { id } = router.query;

  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    people: "",
    barId: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (id) {
      setBookingData((prevData) => ({ ...prevData, barId: id }));
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await sendPostRequest(`${serverUrl}/booking`, bookingData);

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

  const handleChange = (name, value) => {
    setBookingData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && bookingData.date) {
      setCurrentStep(2);
    } else if (currentStep === 2 && bookingData.time) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = j === 0 ? "00" : "30";
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const CustomDateInput = ({ value, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-4 py-2 border border-gray-300 ${
        value ? "bg-indigo-600 text-white" : "text-gray-700"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {value ? value : "Wählen Sie ein Datum"}
    </button>
  );

  return (
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
              onChange={(date) => handleChange("date", date.toISOString().slice(0, 10))}
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
              {timeOptions.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleChange("time", time)}
                  className={`w-full px-4 py-2 border border-gray-300 ${
                    bookingData.time === time
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
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
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Buchung erstellen
          </button>
        )}
      </form>
    </div>
  );
}

export default BookingForm;