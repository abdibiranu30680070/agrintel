
import pandas as pd
import random

regions = ['Oromia', 'Amhara', 'Tigray', 'Southern', 'Afar', 'Sidama', 'Somali', 'Benishangul', 'Gambella']
soils = ['Black soil', 'Clay loam', 'Sandy loam', 'Volcanic', 'Red soil', 'Sandy']
seasons = ['Summer', 'Winter', 'Spring']
crops = ['Teff', 'Maize', 'Wheat', 'Coffee', 'Sorghum', 'Barley']

data = []

for _ in range(550): # Generate 550 rows
    region = random.choice(regions)
    soil = random.choice(soils)
    season = random.choice(seasons)
    
    # Logic-based rainfall and crop assignment for realistic training
    if region == 'Afar' or region == 'Somali':
        rainfall = random.randint(150, 400)
        soil = 'Sandy'
    elif region == 'Southern' or region == 'Sidama':
        rainfall = random.randint(1000, 1500)
        soil = random.choice(['Volcanic', 'Red soil', 'Black soil'])
    else:
        rainfall = random.randint(400, 1000)

    # Simple logic for "Target Crop" (to be learned by AI)
    if rainfall > 1100 and soil == 'Volcanic':
        crop = 'Coffee'
    elif 700 < rainfall < 1100 and soil == 'Black soil':
        crop = 'Teff'
    elif 500 < rainfall < 900 and soil == 'Sandy loam':
        crop = 'Maize'
    elif rainfall < 400:
        crop = 'Sorghum'
    elif 400 < rainfall < 700 and soil == 'Clay loam':
        crop = 'Wheat'
    else:
        crop = random.choice(['Maize', 'Barley', 'Teff'])

    data.append([region, soil, random.uniform(0.5, 10.0), season, rainfall, crop])

df = pd.DataFrame(data, columns=['region', 'soil_type', 'land_size', 'season', 'rainfall_mm', 'crop'])
df.to_csv('data/sample_crop_data.csv', index=False)

print(f"✅ Successfully generated {len(df)} rows of training data in data/sample_crop_data.csv")
