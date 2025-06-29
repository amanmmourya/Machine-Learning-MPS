"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
const Response = () => {
    const Router = useRouter();
    const [data, setData] = useState(null);
    const [possibleDisease, setPossibleDisease] = useState(null);
    const [recommendedPrescription, setRecommendedPrescription] = useState(null);
    const [suitableMedicines, setSuitableMedicines] = useState(null);
    
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const selectedSymptoms = JSON.parse(localStorage.getItem("selectedSymptoms"));
      const customDescription = localStorage.getItem("customDescription");
      const severity = localStorage.getItem("severity");
  
      if (userData && selectedSymptoms && customDescription !== null && severity !== null) {
          setData({
              userData,
              selectedSymptoms,
              customDescription,
              severity
          });
      }
  
      // Wrap everything in an async function
      (async () => {
          const possibleDiseaseFunction = async () => {
              const response = await fetch('http://localhost:8000/giveDisease', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ selectedSymptoms })
              });
              const data = await response.json();
              setPossibleDisease(data.disease);
              return data.disease;
          };
  
          const recommendedPrescriptionFunction = async (disease) => {
              const response = await fetch('http://localhost:8000/givePrescription', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ selectedSymptoms, userData, customDescription, severity, disease })
              });
              const data = await response.json();
              setRecommendedPrescription(data.prescription);
          };
  
          const suitableMedicines = async () => {
              const response = await fetch('http://localhost:8000/suitableMedicines', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ selectedSymptoms,userData,customDescription,severity,disease })
              });
              const data = await response.json();
              setSuitableMedicines(data.medicines);
          };
  
          // Execute in order
          const disease = await possibleDiseaseFunction();
          if (disease) {
              await recommendedPrescriptionFunction(disease);
          }
          await suitableMedicines();
  
      })();
  }, []);
  
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Analysis Results
          </h2>
          <p className="text-gray-600">
            Based on your symptoms and medical history
          </p>
        </div>

        {(!possibleDisease|| !recommendedPrescription || !data || !suitableMedicines) ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Analyzing your symptoms...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        ) : (
          // Results Section
          <div className="space-y-8">
            {/* Possible Disease Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Possible Disease
              </h3>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-gray-700">
                  Based on your symptoms: {possibleDisease?possibleDisease:'Loading...'}
                </p>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> This is a preliminary analysis. Please consult with a healthcare professional for accurate diagnosis.
                  </p>
                </div>
              </div>
            </div>

            {/* Prescription Section */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recommended Prescription
              </h3>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Patient Information:</h4>
                    <p className="text-gray-600">Name: {data.userData.name}</p>
                    <p className="text-gray-600">Age: {data.userData.age} years</p>
                    <p className="text-gray-600">Gender: {data.userData.gender}</p>
                    <p className="text-gray-600">Blood Group: {data.userData.bloodGroup}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Severity Level:</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      data.severity === 'mild' ? 'bg-green-100 text-green-800' :
                      data.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Treatment Recommendations:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {recommendedPrescription?recommendedPrescription:'Loading...'}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Suitable Medicines Section */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Suitable Medicines
              </h3>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 text-sm font-medium">
                      ⚠️ Important: This is for informational purposes only. Always consult a doctor before taking any medication.
                    </p>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Medicines</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {suitableMedicines?suitableMedicines:'Loading...'}
                      </ul>
                    </div>
                    
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-medium text-blue-900 mb-2">Dosage Guidelines:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Follow package instructions</li>
                      <li>• Do not exceed recommended dose</li>
                      <li>• Take with food if stomach upset occurs</li>
                      <li>• Consult pharmacist for interactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => Router.push('/symptoms')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default Response
