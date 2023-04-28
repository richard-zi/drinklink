import React from "react";

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center space-x-8">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            currentStep === 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-indigo-600"
          }`}
        >
          1
        </div>
        <div className="text-sm ml-2">Datum</div>
      </div>
      <div className="flex items-center">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            currentStep === 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-indigo-600"
          }`}
        >
          2
        </div>
        <div className="text-sm ml-2">Zeit</div>
      </div>
      <div className="flex items-center">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            currentStep === 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-indigo-600"
          }`}
        >
          3
        </div>
        <div className="text-sm ml-2">Personen</div>
      </div>
    </div>
  );
}

export default StepIndicator;
