import pandas as pd
from joblib import load
from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'semantic'))
from gemini import process_with_context
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
all_col=['anxiety and nervousness',
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

rf_model=load('./mlModel/rf_model.joblib')

@app.post("/giveDisease")
async def giveDisease(request:Request):
    response=await request.json()
    print(response)
    row=[1 if col in response['selectedSymptoms'] else 0 for col in all_col]
    binary_df = pd.DataFrame([row], columns=all_col)
    final_df=binary_df.drop(columns='diseases')
    Y_pred = rf_model.predict(final_df)
    return {"disease":Y_pred[0]}
@app.post("/givePrescription")
async def givePrescription(request:Request):
    response=await request.json()
    print(response)
    query=f"How to treat {response['disease']} in {response['userData']['gender']} suffering with {response['selectedSymptoms']} and {response['customDescription']} and {response['severity']} and give response in 100 words only."
    results=f"The disease is {response['disease']} and the symptoms are {response['selectedSymptoms']} and the custom description is {response['customDescription']} and the severity is {response['severity']}"
    context=f"Generate a structured response for the following results in 100 words only: {results}"
    data=process_with_context(context,query)
    return {"prescription":data}
@app.post("/suitableMedicines")
async def giveSuitableMedicines(request:Request):
    response=await request.json()
    print(response)
    query=f"Give three-four suitable medicines only for {response['disease']}"
    results=f"The disease is {response['disease']} and the symptoms are {response['selectedSymptoms']} and the custom description is {response['customDescription']} and the severity is {response['severity']}"
    context=f"Generate a list of only three-four medicines for the following results.Nothing extra: {results}"
    queryForLLM=f"Give three-four suitable medicines for {response['disease']} in {response['userData']['gender']} suffering with {response['selectedSymptoms']} and {response['customDescription']} and {response['severity']} and give only medicines name.Nothing extra."
    data=process_with_context(context,queryForLLM)
    return {"medicines":data}