import os
import pickle
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (Allows frontend to make requests to this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this to specific frontend URL if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Get working directory
working_dir = os.path.dirname(os.path.abspath(__file__))

# Load saved models
try:
    diabetes_model = pickle.load(open(f'{working_dir}/saved_models/diabetes_model.sav', 'rb'))
    heart_disease_model = pickle.load(open(f'{working_dir}/saved_models/heart_disease_model.sav', 'rb'))
    parkinsons_model = pickle.load(open(f'{working_dir}/saved_models/parkinsons_model.sav', 'rb'))
except Exception as e:
    print("Error loading models:", e)

# Define request body schemas
class DiabetesInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float

class HeartInput(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

class ParkinsonsInput(BaseModel):
    fo: float
    fhi: float
    flo: float
    Jitter_percent: float
    Jitter_Abs: float
    RAP: float
    PPQ: float
    DDP: float
    Shimmer: float
    Shimmer_dB: float
    APQ3: float
    APQ5: float
    APQ: float
    DDA: float
    NHR: float
    HNR: float
    RPDE: float
    DFA: float
    spread1: float
    spread2: float
    D2: float
    PPE: float

# Health Check API (To test if the backend is running)
@app.get("/")
def home():
    return {"message": "Backend is running!"}

# Diabetes Prediction API
@app.post("/predict-diabetes")
def predict_diabetes(data: DiabetesInput):
    try:
        input_data = np.array([[data.Pregnancies, data.Glucose, data.BloodPressure, data.SkinThickness,
                                data.Insulin, data.BMI, data.DiabetesPedigreeFunction, data.Age]])
        prediction = diabetes_model.predict(input_data)
        result = "The person is diabetic" if prediction[0] == 1 else "The person is not diabetic"
        return {"prediction": result}
    except Exception as e:
        return {"error": str(e)}

# Heart Disease Prediction API
@app.post("/predict-heart-disease")
def predict_heart_disease(data: HeartInput):
    try:
        input_data = np.array([[data.age, data.sex, data.cp, data.trestbps, data.chol, data.fbs,
                                data.restecg, data.thalach, data.exang, data.oldpeak,
                                data.slope, data.ca, data.thal]])
        prediction = heart_disease_model.predict(input_data)
        result = "The person has heart disease" if prediction[0] == 1 else "The person does not have heart disease"
        return {"prediction": result}
    except Exception as e:
        return {"error": str(e)}

# Parkinson's Prediction API
@app.post("/predict-parkinsons")
def predict_parkinsons(data: ParkinsonsInput):
    try:
        input_data = np.array([[data.fo, data.fhi, data.flo, data.Jitter_percent, data.Jitter_Abs,
                                data.RAP, data.PPQ, data.DDP, data.Shimmer, data.Shimmer_dB, 
                                data.APQ3, data.APQ5, data.APQ, data.DDA, data.NHR, data.HNR, 
                                data.RPDE, data.DFA, data.spread1, data.spread2, data.D2, data.PPE]])
        prediction = parkinsons_model.predict(input_data)
        result = "The person has Parkinson's disease" if prediction[0] == 1 else "The person does not have Parkinson's disease"
        return {"prediction": result}
    except Exception as e:
        return {"error": str(e)}


# to run backend command 
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
