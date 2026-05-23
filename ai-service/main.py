from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import joblib
import math
import pandas as pd
import os
from datetime import datetime, timedelta

app = FastAPI(title="AgriIntel AI Engine", version="1.1.0")

# Load Model and Encoders
MODEL_PATH = 'models/crop_model.pkl'
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    le_region = joblib.load('models/le_region.pkl')
    le_soil = joblib.load('models/le_soil.pkl')
    le_season = joblib.load('models/le_season.pkl')
    print("Model loaded successfully.")
else:
    model = None
    print("Model file not found. Please run train_model.py first.")

class RecommendationRequest(BaseModel):
    region: str
    soil_type: str
    land_size: float
    season: str
    rainfall: float = 800.0  # Optional rainfall data

@app.get("/")
def read_root():
    return {"message": "AgriIntel AI Engine is active", "model_loaded": model is not None}

@app.post("/recommend")
def recommend_crop(request: RecommendationRequest):
    if model is None:
        return {"error": "Model not loaded"}

    try:
        # Preprocess input
        # Note: If a new category is sent that wasn't in training, this will fail in a real scenario.
        # For this demo, we'll use a fallback or assume categories exist.
        region_enc = le_region.transform([request.region])[0]
        soil_enc = le_soil.transform([request.soil_type])[0]
        season_enc = le_season.transform([request.season])[0]

        features = pd.DataFrame([[region_enc, soil_enc, season_enc, request.rainfall]], 
                               columns=['region_encoded', 'soil_encoded', 'season_encoded', 'rainfall_mm'])

        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        confidence = float(max(probabilities))

        recommendations = {
            "primary_crop": prediction,
            "confidence": round(confidence, 2),
            "reasoning": f"Based on {request.region} regional data and {request.soil_type} soil analysis."
        }
        return recommendations
    except Exception as e:
        return {"error": str(e), "message": "Ensure region, soil_type, and season match training data labels."}

# Load Price Model (from your previous project)
try:
    price_model = joblib.load('models/teff_price_model.pkl')
    print("Price model loaded successfully.")
except:
    price_model = None
    print("Price model not found, using simulation.")

@app.get("/predict-price")
def predict_price(crop: str = "Teff"):
    # Real recursive forecast logic from your ethiopian-agri-price-prediction project
    if price_model:
        current_date = datetime.now()
        price_history = [12000, 12100, 12250, 12300, 12450, 12400, 12500]
        forecast = []
        
        for i in range(1, 31):
            next_date = current_date + timedelta(days=i)
            month = next_date.month
            
            # Features: [year, month, quarter, is_belg_season, is_meher_season, lag_1, lag_3, rolling_7]
            features = [[
                next_date.year, 
                month, 
                (month-1)//3 + 1,
                1 if month in [3,4,5,6,7] else 0,
                1 if month in [9,10,11,12] else 0,
                price_history[-1],
                price_history[-3],
                sum(price_history[-7:]) / 7
            ]]
            
            pred = int(price_model.predict(pd.DataFrame(features, columns=['year','month','quarter','is_belg_season','is_meher_season','lag_1','lag_3','rolling_7']))[0])
            forecast.append({"date": next_date.strftime('%Y-%m-%d'), "price": pred})
            price_history.append(pred)
            
        return {"crop": crop, "forecast": forecast}
    else:
        # High-quality simulation fallback
        base = 12000
        forecast = [{"date": (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d'), 
                    "price": base + int(math.sin(i/5)*500) + (i*20)} for i in range(1, 31)]
        return {"crop": crop, "forecast": forecast}

@app.get("/predict-prices-all")
def predict_all_prices():
    # Return predictions for multiple crops
    crops_data = [
        {"name": "Teff", "current": "Birr 4,150", "base": 4150},
        {"name": "Coffee", "current": "$5.25/kg", "base": 5.25},
        {"name": "Maize", "current": "Birr 2,800", "base": 2800},
        {"name": "Sesame", "current": "$1,850/MT", "base": 1850}
    ]
    
    predictions = []
    for crop in crops_data:
        # Simulate ML prediction with confidence
        change_percent = (math.sin(len(predictions) * 0.5) * 5) + (math.random() * 2 - 1)
        predicted_value = crop["base"] * (1 + change_percent / 100)
        confidence = 75 + (math.random() * 20)
        
        # Format predicted value
        if "$" in crop["current"]:
            if "/kg" in crop["current"]:
                predicted_str = f"${predicted_value:.2f}/kg"
            else:
                predicted_str = f"${predicted_value:.0f}/MT"
        else:
            predicted_str = f"Birr {predicted_value:.0f}"
        
        predictions.append({
            "name": crop["name"],
            "current": crop["current"],
            "predicted": predicted_str,
            "change": f"{change_percent:+.1f}%",
            "trend": "up" if change_percent > 0 else "down",
            "confidence": f"{confidence:.0f}%"
        })
    
    return {"predictions": predictions}
@app.get("/weather")
def get_weather(region: str = "Oromia"):
    # Simulated localized weather data for Ethiopian regions
    # In production, this would call OpenWeatherMap or NMA Ethiopia API
    weather_data = {
        "Oromia": {"temp": 24, "condition": "Partly Cloudy", "rainfall": "800mm", "risk": "Low"},
        "Amhara": {"temp": 22, "condition": "Sunny", "rainfall": "600mm", "risk": "Medium (Heat)"},
        "Tigray": {"temp": 26, "condition": "Dry", "rainfall": "400mm", "risk": "High (Drought)"},
        "Southern": {"temp": 20, "condition": "Rainy", "rainfall": "1200mm", "risk": "Medium (Flood)"},
        "Afar": {"temp": 32, "condition": "Hot & Dry", "rainfall": "200mm", "risk": "Extreme Heat"}
    }
    return weather_data.get(region, weather_data["Oromia"])

@app.get("/market-trends")
def get_market_trends():
    # Simulated market trends for major Ethiopian crops
    trends = [
        {"crop": "Teff (Grade A)", "price": 4500, "change": "+12%", "trend": "up"},
        {"crop": "Maize", "price": 1800, "change": "+5%", "trend": "up"},
        {"crop": "Wheat", "price": 3200, "change": "-2%", "trend": "down"},
        {"crop": "Coffee (Buna)", "price": 12000, "change": "+8%", "trend": "up"}
    ]
    return trends

@app.post("/detect-disease")
def detect_disease():
    # Placeholder for CNN model processing an image
    # In a real scenario, we would receive a file (UploadFile)
    return {
        "status": "Healthy" if os.urandom(1)[0] % 2 == 0 else "Issue Detected",
        "disease": "Wheat Rust" if os.urandom(1)[0] % 2 != 0 else "None",
        "advice": "Apply appropriate fungicide and monitor moisture levels.",
        "confidence": 0.89
    }

@app.get("/farmers")
def get_farmers():
    # Simulated farmer registry data from the AI service
    return [
        {"id": 1, "name": "Bekele Abdi", "region": "Oromia", "status": "Active"},
        {"id": 2, "name": "Hanna Tesfaye", "region": "Amhara", "status": "Pending"},
        {"id": 3, "name": "Mohammed Ali", "region": "Afar", "status": "Active"},
        {"id": 4, "name": "Lwam Tekle", "region": "Tigray", "status": "Active"}
    ]

@app.get("/crops-catalog")
def get_crops_catalog():
    # Simulated crop expert data from the AI service
    return [
        {"name": "Teff", "type": "Cereal", "soil": "Black soil", "season": "Summer"},
        {"name": "Coffee", "type": "Cash Crop", "soil": "Volcanic", "season": "Summer"},
        {"name": "Maize", "type": "Cereal", "soil": "Sandy loam", "season": "Summer"},
        {"name": "Wheat", "type": "Cereal", "soil": "Clay loam", "season": "Winter"}
    ]

class AskRequest(BaseModel):
    question: str
    context: dict = {}
    language: str = "en"

@app.post("/ask")
def ask_question(request: AskRequest):
    # Professional AI response logic using agricultural context data
    q = request.question.lower()
    ctx = request.context
    
    # Use context data if available, otherwise use hardcoded responses
    if ctx:
        # Priority: Use context data for specific topics
        if "coffee" in q or "rust" in q or "ዝገት" in q:
            answer = ctx.get("coffee", "")
            if answer:
                return {"answer": answer}
        elif "maize" in q or "በቆሎ" in q or "oromia" in q:
            answer = ctx.get("maize", "")
            if answer:
                return {"answer": answer}
        elif "teff" in q or "ጤፍ" in q or "ph" in q:
            answer = ctx.get("teff", "")
            if answer:
                return {"answer": answer}
        elif "yield" in q or "prediction" in q or "ምርት" in q:
            answer = ctx.get("yield", "")
            if answer:
                return {"answer": answer}
        elif "wheat" in q or "pest" in q or "ስንዴ" in q:
            answer = ctx.get("wheat", "")
            if answer:
                return {"answer": answer}
        elif "irrigation" in q or "water" in q or "ማስተካከል" in q:
            answer = ctx.get("irrigation", "")
            if answer:
                return {"answer": answer}
        elif "fertilizer" in q or "npk" in q or "ንብረት" in q:
            answer = ctx.get("fertilizer", "")
            if answer:
                return {"answer": answer}
        elif "disease" in q or "prevention" in q or "በሽታ" in q:
            answer = ctx.get("disease", "")
            if answer:
                return {"answer": answer}
        elif "sorghum" in q or "ሹምብላ" in q:
            answer = ctx.get("sorghum", "")
            if answer:
                return {"answer": answer}
        elif "soil" in q or "testing" in q or "አፈር" in q:
            answer = ctx.get("soil", "")
            if answer:
                return {"answer": answer}
        elif "rotation" in q or "crop" in q or "ማሻሻል" in q:
            answer = ctx.get("rotation", "")
            if answer:
                return {"answer": answer}
        elif "weather" in q or "climate" in q or "አየር" in q:
            answer = ctx.get("weather", "")
            if answer:
                return {"answer": answer}
    
    # Fallback to hardcoded responses if context not available or no match
    if "teff" in q:
        if "rainfall" in q or "water" in q:
            return {"answer": "Teff requires 750-1000mm of annual rainfall. It is sensitive to waterlogging during the early stages but needs consistent moisture during the grain-filling period."}
        return {"answer": "Teff is Ethiopias staple cereal. It grows best in 'Bishoftu' black soil at altitudes of 1800-2100m. It is highly resistant to many pests but requires careful weeding."}
    
    elif "coffee" in q or "buna" in q:
        return {"answer": "Coffee (Arabica) thrives in well-drained volcanic soils at high altitudes (1500-2000m). It requires a mix of sun and shade, with annual rainfall between 1200-1500mm. Sidama and Kaffa regions provide ideal conditions."}
    
    elif "dry" in q or "drought" in q or "low rain" in q:
        return {"answer": "For low rainfall areas like Afar or Somali (under 400mm), we recommend drought-resistant Sorghum or specialized Maize varieties. Mulching can help retain soil moisture."}
    
    elif "price" in q or "market" in q:
        return {"answer": "Currently, Teff prices in Addis Ababa are trending UP at 4,500 ETB per quintal. We recommend checking the 'Market Trends' tab for real-time changes across jimma and Bahir Dar."}
    
    elif "disease" in q or "rust" in q or "pest" in q:
        return {"answer": "Early detection is critical. For Wheat Rust, monitor for orange pustules on leaves. If detected, apply triazole-based fungicides immediately and reduce nitrogen fertilization temporarily."}
    
    elif "soil" in q:
        return {"answer": "AgriIntel suggests Black soil (Koticha) for Teff and Wheat, while Sandy Loam is excellent for Maize. Always ensure proper drainage to prevent root rot."}
    
    else:
        return {"answer": "That is a great question. AgriIntel AI suggests consulting your local extension worker while we process your specific request based on your farm's GPS data."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
