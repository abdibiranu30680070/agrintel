import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load data
data_path = 'data/sample_crop_data.csv'
df = pd.read_csv(data_path)

# Prepare Features and Target
# We'll encode categorical variables
le_region = LabelEncoder()
le_soil = LabelEncoder()
le_season = LabelEncoder()

df['region_encoded'] = le_region.fit_transform(df['region'])
df['soil_encoded'] = le_soil.fit_transform(df['soil_type'])
df['season_encoded'] = le_season.fit_transform(df['season'])

X = df[['region_encoded', 'soil_encoded', 'season_encoded', 'rainfall_mm']]
y = df['crop']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save Model and Encoders
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/crop_model.pkl')
joblib.dump(le_region, 'models/le_region.pkl')
joblib.dump(le_soil, 'models/le_soil.pkl')
joblib.dump(le_season, 'models/le_season.pkl')

print("Model trained and saved successfully in 'models/' directory.")
print(f"Accuracy on test set: {model.score(X_test, y_test):.2f}")
