"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SymptomsPage() {
  const router = useRouter();
  
  // Array of common symptoms
  const symptomsList=['anxiety and nervousness',
    'depression',
    'shortness of breath',
    'depressive or psychotic symptoms',
    'sharp chest pain',
    'dizziness',
    'insomnia',
    'abnormal involuntary movements',
    'chest tightness',
    'palpitations',
    'irregular heartbeat',
    'sore throat',
    'difficulty speaking',
    'cough',
    'nasal congestion',
    'diminished hearing',
    'difficulty in swallowing',
    'skin swelling',
    'retention of urine',
    'leg pain',
    'hip pain',
    'suprapubic pain',
    'blood in stool',
    'abusing alcohol',
    'fainting',
    'hostile behavior',
    'drug abuse',
    'sharp abdominal pain',
    'vomiting',
    'headache',
    'nausea',
    'diarrhea',
    'vaginal itching',
    'painful urination',
    'involuntary urination',
    'frequent urination',
    'lower abdominal pain',
    'vaginal discharge',
    'blood in urine',
    'intermenstrual bleeding',
    'hand or finger pain',
    'arm pain',
    'lip swelling',
    'abnormal appearing skin',
    'skin lesion',
    'acne or pimples',
    'facial pain',
    'skin growth',
    'diminished vision',
    'symptoms of eye',
    'pain in eye',
    'foreign body sensation in eye',
    'irregular appearing scalp',
    'back pain',
    'neck pain',
    'low back pain',
    'pain during pregnancy',
    'pelvic pain',
    'burning abdominal pain',
    'peripheral edema',
    'ear pain',
    'knee pain',
    'foot or toe pain',
    'skin moles',
    'problems with movement',
    'leg swelling',
    'heartburn',
    'weakness',
    'spots or clouds in vision',
    'eye redness',
    'lacrimation',
    'itchiness of eye',
    'decreased appetite',
    'excessive anger',
    'loss of sensation',
    'disturbance of memory',
    'paresthesia',
    'side pain',
    'fever',
    'shoulder pain',
    'ache all over',
    'lower body pain',
    'cramps and spasms',
    'upper abdominal pain',
    'difficulty breathing',
    'chills',
    'fatigue',
    'delusions or hallucinations',
    'temper problems',
    'coryza',
    'allergic reaction',
    'itching of skin',
    'skin dryness, peeling, scaliness, or roughness',
    'skin rash','diseases']
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customDescription, setCustomDescription] = useState('');
  const [severity, setSeverity] = useState('mild');

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const symptomsData = {
      selectedSymptoms,
      customDescription,
      severity,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('selectedSymptoms', JSON.stringify(selectedSymptoms));
    localStorage.setItem('customDescription', JSON.stringify(customDescription));
    localStorage.setItem('severity', JSON.stringify(severity));
    router.push('/response');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Describe Your <span className="text-blue-600">Symptoms</span>
          </h1>
          <p className="text-lg text-gray-600">
            Select all symptoms that apply to you and provide additional details
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Symptoms Selection */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select Your Symptoms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {symptomsList.map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => handleSymptomToggle(symptom)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Description */}
            <div>
              <label htmlFor="customDescription" className="block text-xl font-semibold text-gray-900 mb-4">
                Additional Description
              </label>
              <textarea
                id="customDescription"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe your symptoms in detail, including when they started, how long they last, and any other relevant information..."
              />
            </div>

            {/* Severity Selection */}
            <div>
              <label className="block text-xl font-semibold text-gray-900 mb-4">
                Symptom Severity
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'mild', label: 'Mild', color: 'bg-green-100 text-green-800 border-green-200' },
                  { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  { value: 'severe', label: 'Severe', color: 'bg-red-100 text-red-800 border-red-200' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="severity"
                      value={option.value}
                      checked={severity === option.value}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`text-sm font-medium ${option.color} px-3 py-1 rounded-full`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Selected Symptoms Summary */}
            {selectedSymptoms.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Selected Symptoms ({selectedSymptoms.length}):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <span key={symptom} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={selectedSymptoms.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generate Prescription
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
              <p className="text-sm text-blue-700 mt-1">
                This is for informational purposes only. Please consult with a healthcare professional for proper medical diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
